// Content script for SYNTAX Chrome Extension
let isProcessing = false;
let currentSelection = null;
let loadingIndicator = null;
let isInitialized = false;

// Initialize the content script
function initializeContentScript() {
  try {
    if (isInitialized) {
      console.log('SYNTAX content script already initialized');
      return;
    }
    
    console.log('SYNTAX content script initializing...');
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeContentScript, 100);
      });
      return;
    }
    
    setTimeout(() => {
      injectStyles();
      isInitialized = true;
      console.log('SYNTAX content script initialized successfully');
    }, 100);
    
  } catch (error) {
    console.error('Error initializing SYNTAX content script:', error);
    setTimeout(initializeContentScript, 1000);
  }
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'startRephrase') {
    handleStartRephrase(request.selectedText);
    sendResponse({ success: true });
  } else if (request.action === 'replaceText') {
    handleReplaceText(request.originalText, request.rephrasedText);
    sendResponse({ success: true });
  } else if (request.action === 'ping') {
    sendResponse({ status: 'pong' });
  }
  
  return false;
});

function handleStartRephrase(selectedText) {
  try {
    console.log('Starting rephrase for:', selectedText);
    
    // Get the current selection and store exact details
    const selection = window.getSelection();
    const activeElement = document.activeElement;
    
    currentSelection = {
      text: selectedText,
      element: null,
      startOffset: null,
      endOffset: null,
      xpath: null,
      selectionStart: null,
      selectionEnd: null
    };
    
    // Case 1: Text selected in input/textarea
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      currentSelection.element = activeElement;
      currentSelection.selectionStart = activeElement.selectionStart;
      currentSelection.selectionEnd = activeElement.selectionEnd;
      currentSelection.xpath = getXPath(activeElement);
      console.log('Input/textarea selection stored:', currentSelection);
    }
    // Case 2: Text selected in contenteditable or regular text
    else if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      currentSelection.element = range.commonAncestorContainer;
      currentSelection.startOffset = range.startOffset;
      currentSelection.endOffset = range.endOffset;
      currentSelection.xpath = getXPath(currentSelection.element);
      console.log('Range selection stored:', currentSelection);
    }
    
    showLoadingIndicator();
    isProcessing = true;
    
  } catch (error) {
    console.error('Error in handleStartRephrase:', error);
    showError('Failed to start rephrasing process');
  }
}

function handleReplaceText(originalText, rephrasedText) {
  try {
    console.log('Replacing text:', { originalText, rephrasedText });
    
    if (!currentSelection || !currentSelection.element) {
      showError('No selection found to replace');
      return;
    }
    
    let success = false;
    
    // Case 1: Replace in input/textarea
    if (currentSelection.element.tagName === 'INPUT' || currentSelection.element.tagName === 'TEXTAREA') {
      success = replaceInInputElement(originalText, rephrasedText);
    }
    // Case 2: Replace in contenteditable or text nodes
    else {
      success = replaceInTextNode(originalText, rephrasedText);
    }
    
    if (success) {
      showSuccess('Text rephrased successfully!');
    } else {
      showError('Could not replace the selected text');
    }
    
  } catch (error) {
    console.error('Error in handleReplaceText:', error);
    showError('Failed to replace text');
  } finally {
    cleanup();
  }
}

function replaceInInputElement(originalText, newText) {
  try {
    const element = currentSelection.element;
    const currentValue = element.value;
    
    // Simple replacement
    if (currentValue.includes(originalText)) {
      element.value = currentValue.replace(originalText, newText);
      
      // Trigger events
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Set cursor position
      const newPosition = element.value.indexOf(newText) + newText.length;
      element.setSelectionRange(newPosition, newPosition);
      
      console.log('Successfully replaced text in input element');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error replacing in input element:', error);
    return false;
  }
}

function replaceInTextNode(originalText, newText) {
  try {
    const element = currentSelection.element;
    
    // If it's a text node, get its parent element
    const targetElement = element.nodeType === Node.TEXT_NODE ? element.parentElement : element;
    
    // Case 1: Contenteditable element
    if (targetElement.contentEditable === 'true' || targetElement.isContentEditable) {
      if (targetElement.textContent.includes(originalText)) {
        targetElement.textContent = targetElement.textContent.replace(originalText, newText);
        targetElement.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('Replaced text in contenteditable element');
        return true;
      }
    }
    
    // Case 2: Regular text node
    if (element.nodeType === Node.TEXT_NODE && element.nodeValue.includes(originalText)) {
      element.nodeValue = element.nodeValue.replace(originalText, newText);
      console.log('Replaced text in text node');
      return true;
    }
    
    // Case 3: Element with text content
    if (targetElement.textContent && targetElement.textContent.includes(originalText)) {
      targetElement.textContent = targetElement.textContent.replace(originalText, newText);
      console.log('Replaced text in element textContent');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error replacing in text node:', error);
    return false;
  }
}

// Simple XPath generator
function getXPath(element) {
  try {
    if (!element) return '';
    
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }
    
    const parts = [];
    let current = element;
    
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let tagName = current.tagName.toLowerCase();
      let index = 1;
      
      // Count siblings with same tag name
      let sibling = current.previousElementSibling;
      while (sibling) {
        if (sibling.tagName.toLowerCase() === tagName) {
          index++;
        }
        sibling = sibling.previousElementSibling;
      }
      
      parts.unshift(`${tagName}[${index}]`);
      current = current.parentElement;
    }
    
    return '/' + parts.join('/');
  } catch (error) {
    console.error('Error generating XPath:', error);
    return '';
  }
}

function showLoadingIndicator() {
  try {
    hideNotifications();
    
    loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'syntax-loading';
    loadingIndicator.className = 'syntax-notification syntax-loading';
    loadingIndicator.innerHTML = `
      <div class="syntax-spinner"></div>
      <span>Rephrasing text with AI...</span>
    `;
    
    document.body.appendChild(loadingIndicator);
    positionNotification(loadingIndicator);
    
  } catch (error) {
    console.error('Error showing loading indicator:', error);
  }
}

function showSuccess(message) {
  try {
    hideNotifications();
    
    const successDiv = document.createElement('div');
    successDiv.id = 'syntax-success';
    successDiv.className = 'syntax-notification syntax-success';
    successDiv.innerHTML = `<span>✓ ${message}</span>`;
    
    document.body.appendChild(successDiv);
    positionNotification(successDiv);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove();
      }
    }, 3000);
    
  } catch (error) {
    console.error('Error showing success message:', error);
  }
}

function showError(message) {
  try {
    hideNotifications();
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'syntax-error';
    errorDiv.className = 'syntax-notification syntax-error';
    errorDiv.innerHTML = `
      <span>⚠ ${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(errorDiv);
    positionNotification(errorDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
    
  } catch (error) {
    console.error('Error showing error message:', error);
  }
}

function positionNotification(element) {
  try {
    element.style.position = 'fixed';
    element.style.top = '20px';
    element.style.right = '20px';
    element.style.zIndex = '2147483647';
    element.style.display = 'flex';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
  } catch (error) {
    console.error('Error positioning notification:', error);
  }
}

function hideNotifications() {
  try {
    const notifications = document.querySelectorAll('#syntax-loading, #syntax-success, #syntax-error');
    notifications.forEach(notification => notification.remove());
  } catch (error) {
    console.error('Error hiding notifications:', error);
  }
}

function cleanup() {
  try {
    isProcessing = false;
    currentSelection = null;
    hideNotifications();
    console.log('Cleanup completed');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

function injectStyles() {
  const styleContent = `
    .syntax-notification {
      background: white !important;
      border: 1px solid #ddd !important;
      border-radius: 8px !important;
      padding: 12px 16px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      max-width: 300px !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      position: fixed !important;
      z-index: 2147483647 !important;
      box-sizing: border-box !important;
      line-height: 1.4 !important;
      color: #333 !important;
      text-align: left !important;
      margin: 0 !important;
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
      transition: all 0.3s ease !important;
    }
    
    .syntax-loading {
      background: #f0f9ff !important;
      border-color: #0ea5e9 !important;
      color: #0c4a6e !important;
    }
    
    .syntax-success {
      background: #f0fdf4 !important;
      border-color: #22c55e !important;
      color: #15803d !important;
    }
    
    .syntax-error {
      background: #fef2f2 !important;
      border-color: #ef4444 !important;
      color: #dc2626 !important;
    }
    
    .syntax-spinner {
      width: 16px !important;
      height: 16px !important;
      border: 2px solid #e5e7eb !important;
      border-top: 2px solid #0ea5e9 !important;
      border-radius: 50% !important;
      animation: syntax-spin 1s linear infinite !important;
      flex-shrink: 0 !important;
    }
    
    @keyframes syntax-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .syntax-error button {
      background: none !important;
      border: none !important;
      color: #dc2626 !important;
      cursor: pointer !important;
      font-size: 18px !important;
      padding: 4px !important;
      margin: 0 0 0 auto !important;
      line-height: 1 !important;
      width: auto !important;
      height: auto !important;
      min-width: auto !important;
      min-height: auto !important;
      border-radius: 4px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    .syntax-error button:hover {
      background: rgba(220, 38, 38, 0.1) !important;
    }
    
    .syntax-notification span {
      flex: 1 !important;
      margin: 0 !important;
      padding: 0 !important;
      font-weight: normal !important;
      text-decoration: none !important;
      text-transform: none !important;
      letter-spacing: normal !important;
    }
  `;

  try {
    if (document.getElementById('syntax-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'syntax-styles';
    style.textContent = styleContent;

    if (!document.head) {
      setTimeout(() => injectStyles(), 100);
      return;
    }

    document.head.appendChild(style);
    console.log('SYNTAX styles injected successfully');
  } catch (error) {
    console.error('Error injecting SYNTAX styles:', error);
  }
}

// Initialize when DOM is ready
try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContentScript);
    setTimeout(initializeContentScript, 1000);
  } else {
    initializeContentScript();
  }
  
  window.addEventListener('load', () => {
    if (!isInitialized) {
      initializeContentScript();
    }
  });
  
} catch (error) {
  console.error('Error setting up SYNTAX initialization:', error);
  setTimeout(initializeContentScript, 2000);
}