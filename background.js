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
      const selectedText = info.selectionText.trim();

      // Check text length (rough estimate: 1 token ≈ 4 characters)
      const estimatedTokens = Math.ceil(selectedText.length / 4);
      const maxInputTokens = 3000; // Leave room for system prompt and response

      if (estimatedTokens > maxInputTokens) {
        await sendMessageToTab(tab.id, {
          action: "showError",
          message: `Selected text is too long (≈${estimatedTokens} tokens). Please select shorter text (max ≈${maxInputTokens} tokens).`
        });
        return;
      }

      if (selectedText.length < 3) {
        await sendMessageToTab(tab.id, {
          action: "showError",
          message: "Please select more text to rephrase (minimum 3 characters)."
        });
        return;
      }

      // Get settings from storage
      const result = await chrome.storage.sync.get([
        'openaiApiKey',
        'rephraseStyle',
        'customStyle'
      ]);

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
        selectedText: selectedText
      });

      // Call OpenAI API with user preferences
      const rephrasedText = await rephraseText(
        selectedText,
        result.openaiApiKey,
        result.rephraseStyle || 'professional',
        result.customStyle || ''
      );

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

// Function to rephrase text using OpenAI API
async function rephraseText(text, apiKey, rephraseStyle = 'professional', customStyle = '') {
  // Create system prompt based on style preference
  let systemPrompt = '';

  switch (rephraseStyle) {
    case 'professional':
      systemPrompt = 'You are a professional writing assistant. Rephrase the given text to make it clearer, more professional, and better structured while maintaining the original meaning and tone. Return only the rephrased text without any additional commentary.';
      break;
    case 'casual':
      systemPrompt = 'You are a friendly writing assistant. Rephrase the given text to make it more casual, conversational, and approachable while keeping the original meaning. Return only the rephrased text without any additional commentary.';
      break;
    case 'formal':
      systemPrompt = 'You are an academic writing assistant. Rephrase the given text to make it more formal, precise, and scholarly while maintaining the original meaning. Use sophisticated vocabulary and proper academic tone. Return only the rephrased text without any additional commentary.';
      break;
    case 'concise':
      systemPrompt = 'You are a concise writing assistant. Rephrase the given text to make it shorter, more direct, and to the point while preserving all important information and meaning. Remove unnecessary words and make it as brief as possible. Return only the rephrased text without any additional commentary.';
      break;
    case 'creative':
      systemPrompt = 'You are a creative writing assistant. Rephrase the given text to make it more engaging, vivid, and interesting while maintaining the original meaning. Use creative language, metaphors, and compelling expressions. Return only the rephrased text without any additional commentary.';
      break;
    case 'custom':
      systemPrompt = `You are a writing assistant. Rephrase the given text according to these specific instructions: "${customStyle}". Maintain the original meaning while following the provided style guidelines. Return only the rephrased text without any additional commentary.`;
      break;
    default:
      systemPrompt = 'You are a professional writing assistant. Rephrase the given text to make it clearer, more professional, and better structured while maintaining the original meaning and tone. Return only the rephrased text without any additional commentary.';
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Please rephrase the following text and correct any grammatical mistakes there is: "${text}"`
        }
      ],
      max_tokens: 2000,
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