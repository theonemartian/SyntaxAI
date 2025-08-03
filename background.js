// Background service worker for SYNTAX Chrome Extension
let contextMenuId = null;

// Initialize context menu when extension starts
chrome.runtime.onStartup.addListener(createContextMenu);
chrome.runtime.onInstalled.addListener(createContextMenu);

function createContextMenu() {
  // Remove existing context menu if it exists
  if (contextMenuId) {
    chrome.contextMenus.remove(contextMenuId);
  }
  
  // Create new context menu
  contextMenuId = chrome.contextMenus.create({
    id: "syntax-rephrase",
    title: "Rephrase with AI",
    contexts: ["selection"],
    documentUrlPatterns: ["http://*/*", "https://*/*"]
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "syntax-rephrase" && info.selectionText) {
    try {
      // Get API key from storage
      const result = await chrome.storage.sync.get(['openaiApiKey']);

      if (!result.openaiApiKey) {
        // Send message to content script to show error
        await sendMessageToTab(tab.id, {
          action: "showError",
          message: "Please set your OpenAI API key in the extension popup first."
        });
        return;
      }

      // Send message to content script to start rephrasing
      await sendMessageToTab(tab.id, {
        action: "startRephrase",
        selectedText: info.selectionText
      });

      // Call OpenAI API
      const rephrasedText = await rephraseText(info.selectionText, result.openaiApiKey);

      // Send rephrased text back to content script
      await sendMessageToTab(tab.id, {
        action: "replaceText",
        originalText: info.selectionText,
        rephrasedText: rephrasedText
      });

    } catch (error) {
      console.error('Error in background script:', error);
      await sendMessageToTab(tab.id, {
        action: "showError",
        message: error.message || "An error occurred while rephrasing text."
      });
    }
  }
});

// Function to call OpenAI API
async function rephraseText(text, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional writing assistant. Rephrase the given text to make it clearer, more professional, and better structured while maintaining the original meaning and tone. Return only the rephrased text without any additional commentary.'
        },
        {
          role: 'user',
          content: `Please rephrase the following text: "${text}"`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key.');
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (response.status === 403) {
      throw new Error('API access forbidden. Please check your API key permissions.');
    } else {
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response from OpenAI API');
  }

  return data.choices[0].message.content.trim();
}


// Helper function to send messages to content script with error handling
async function sendMessageToTab(tabId, message, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      // First, ensure content script is injected
      await ensureContentScriptInjected(tabId);

      // Send the message
      await chrome.tabs.sendMessage(tabId, message);
      return; // Success, exit the retry loop
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed to send message:`, error);

      if (i === retries - 1) {
        // Last attempt failed, show error to user
        console.error('Failed to communicate with content script after all retries');
        // Try to inject content script and show error
        try {
          await ensureContentScriptInjected(tabId);
          await chrome.tabs.sendMessage(tabId, {
            action: "showError",
            message: "Extension communication error. Please refresh the page and try again."
          });
        } catch (finalError) {
          console.error('Final error handling failed:', finalError);
        }
      } else {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
}

// Ensure content script is injected
async function ensureContentScriptInjected(tabId) {
  try {
    // Try to ping the content script
    await chrome.tabs.sendMessage(tabId, { action: "ping" });
  } catch (error) {
    // Content script not available, inject it
    console.log('Injecting content script...');
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });

    // Wait a bit for the script to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "getApiKey") {
    chrome.storage.sync.get(['openaiApiKey']).then(result => {
      sendResponse({ apiKey: result.openaiApiKey });
    });
    return true; // Keep message channel open for async response
  } else if (request.action === "ping") {
    // Respond to ping from content script
    sendResponse({ status: "pong" });
    return false;
  }
});