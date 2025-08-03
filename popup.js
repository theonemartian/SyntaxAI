// Popup script for SYNTAX Chrome Extension
document.addEventListener('DOMContentLoaded', async function() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveBtn = document.getElementById('saveBtn');
    const testBtn = document.getElementById('testBtn');
    const toggleBtn = document.getElementById('toggleVisibility');
    const statusDiv = document.getElementById('status');
    
    // Load existing API key
    await loadApiKey();
    
    // Event listeners
    saveBtn.addEventListener('click', saveApiKey);
    testBtn.addEventListener('click', testConnection);
    toggleBtn.addEventListener('click', togglePasswordVisibility);
    apiKeyInput.addEventListener('input', onApiKeyInput);
    apiKeyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveApiKey();
        }
    });
    
    async function loadApiKey() {
        try {
            const result = await chrome.storage.sync.get(['openaiApiKey']);
            if (result.openaiApiKey) {
                apiKeyInput.value = result.openaiApiKey;
                updateButtonStates();
            }
        } catch (error) {
            console.error('Error loading API key:', error);
            showStatus('Error loading saved API key', 'error');
        }
    }
    
    async function saveApiKey() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key', 'error');
            return;
        }
        
        if (!isValidApiKeyFormat(apiKey)) {
            showStatus('Invalid API key format. Should start with "sk-"', 'error');
            return;
        }
        
        try {
            showStatus('Saving API key...', 'loading');
            
            await chrome.storage.sync.set({ openaiApiKey: apiKey });
            showStatus('API key saved successfully!', 'success');
            updateButtonStates();
            
        } catch (error) {
            console.error('Error saving API key:', error);
            showStatus('Error saving API key', 'error');
        }
    }
    
    async function testConnection() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key first', 'error');
            return;
        }
        
        if (!isValidApiKeyFormat(apiKey)) {
            showStatus('Invalid API key format', 'error');
            return;
        }
        
        try {
            showStatus('Testing connection...', 'loading');
            testBtn.disabled = true;
            
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                showStatus('✅ Connection successful!', 'success');
            } else {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = 'Connection failed';
                
                switch (response.status) {
                    case 401:
                        errorMessage = 'Invalid API key';
                        break;
                    case 403:
                        errorMessage = 'API access forbidden';
                        break;
                    case 429:
                        errorMessage = 'Rate limit exceeded';
                        break;
                    default:
                        errorMessage = errorData.error?.message || `Error ${response.status}`;
                }
                
                showStatus(`❌ ${errorMessage}`, 'error');
            }
            
        } catch (error) {
            console.error('Error testing connection:', error);
            showStatus('❌ Network error. Check your connection.', 'error');
        } finally {
            testBtn.disabled = false;
        }
    }
    
    function togglePasswordVisibility() {
        const isPassword = apiKeyInput.type === 'password';
        apiKeyInput.type = isPassword ? 'text' : 'password';
        toggleBtn.textContent = isPassword ? '🙈' : '👁️';
        toggleBtn.title = isPassword ? 'Hide API key' : 'Show API key';
    }
    
    function onApiKeyInput() {
        updateButtonStates();
        // Clear status when user starts typing
        if (statusDiv.textContent && !statusDiv.classList.contains('loading')) {
            hideStatus();
        }
    }
    
    function updateButtonStates() {
        const hasApiKey = apiKeyInput.value.trim().length > 0;
        const isValidFormat = isValidApiKeyFormat(apiKeyInput.value.trim());
        
        saveBtn.disabled = !hasApiKey;
        testBtn.disabled = !hasApiKey || !isValidFormat;
        
        // Update save button text based on whether key exists
        chrome.storage.sync.get(['openaiApiKey']).then(result => {
            const hasExistingKey = result.openaiApiKey && result.openaiApiKey === apiKeyInput.value.trim();
            saveBtn.textContent = hasExistingKey ? 'API Key Saved' : 'Save API Key';
            saveBtn.disabled = hasExistingKey;
        });
    }
    
    function isValidApiKeyFormat(apiKey) {
        return apiKey.startsWith('sk-') && apiKey.length > 20;
    }
    
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.classList.remove('hidden');
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideStatus();
            }, 3000);
        }
    }
    
    function hideStatus() {
        statusDiv.classList.add('hidden');
    }
    
    // Handle external links
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.href) {
            e.preventDefault();
            chrome.tabs.create({ url: e.target.href });
        }
    });
});