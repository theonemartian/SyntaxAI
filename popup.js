document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const rephraseStyleSelect = document.getElementById('rephraseStyle');
    const customStyleGroup = document.getElementById('customStyleGroup');
    const customStyleTextarea = document.getElementById('customStyle');
    const saveKeyButton = document.getElementById('saveKey');
    const testConnectionButton = document.getElementById('testConnection');
    const saveSettingsButton = document.getElementById('saveSettings');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    loadSettings();

    // Handle rephrase style change
    rephraseStyleSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customStyleGroup.style.display = 'block';
        } else {
            customStyleGroup.style.display = 'none';
        }
    });

    // Save API Key button
    saveKeyButton.addEventListener('click', async function() {
        await saveApiKey();
    });

    // Test Connection button
    testConnectionButton.addEventListener('click', async function() {
        await testConnection();
    });

    // Save All Settings button
    saveSettingsButton.addEventListener('click', async function() {
        await saveAllSettings();
    });

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
            await chrome.storage.sync.set({ openaiApiKey: apiKey });
            showStatus('API key saved successfully!', 'success');
            updateButtonStates();
        } catch (error) {
            showStatus('Failed to save API key', 'error');
        }
    }

    async function saveAllSettings() {
        const apiKey = apiKeyInput.value.trim();
        const rephraseStyle = rephraseStyleSelect.value;
        const customStyle = customStyleTextarea.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key', 'error');
            return;
        }

        if (!isValidApiKeyFormat(apiKey)) {
            showStatus('Invalid API key format. Should start with "sk-"', 'error');
            return;
        }

        if (rephraseStyle === 'custom' && !customStyle) {
            showStatus('Please enter custom instructions or choose a different style', 'error');
            return;
        }

        try {
            const settings = {
                openaiApiKey: apiKey,
                rephraseStyle: rephraseStyle,
                customStyle: customStyle
            };
            
            await chrome.storage.sync.set(settings);
            showStatus('All settings saved successfully!', 'success');
            updateButtonStates();
        } catch (error) {
            showStatus('Failed to save settings', 'error');
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

        setButtonLoading(testConnectionButton, true);
        showStatus('Testing connection...', 'info');

        try {
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
                            role: 'user',
                            content: 'Test connection - please respond with "OK"'
                        }
                    ],
                    max_tokens: 5
                })
            });

            if (response.ok) {
                showStatus('✅ Connection successful!', 'success');
            } else {
                let errorMessage = 'Connection failed';
                if (response.status === 401) {
                    errorMessage = 'Invalid API key';
                } else if (response.status === 429) {
                    errorMessage = 'Rate limit exceeded';
                } else if (response.status === 403) {
                    errorMessage = 'API access forbidden';
                }
                showStatus(`❌ ${errorMessage}`, 'error');
            }
        } catch (error) {
            showStatus('❌ Network error. Check your connection.', 'error');
        } finally {
            setButtonLoading(testConnectionButton, false);
        }
    }

    async function loadSettings() {
        try {
            const result = await chrome.storage.sync.get([
                'openaiApiKey', 
                'rephraseStyle', 
                'customStyle'
            ]);
            
            if (result.openaiApiKey) {
                apiKeyInput.value = result.openaiApiKey;
            }
            
            if (result.rephraseStyle) {
                rephraseStyleSelect.value = result.rephraseStyle;
                if (result.rephraseStyle === 'custom') {
                    customStyleGroup.style.display = 'block';
                    if (result.customStyle) {
                        customStyleTextarea.value = result.customStyle;
                    }
                }
            }
            
            updateButtonStates();
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    function updateButtonStates() {
        const hasApiKey = apiKeyInput.value.trim().length > 0;
        const isValidFormat = isValidApiKeyFormat(apiKeyInput.value.trim());
        
        testConnectionButton.disabled = !hasApiKey || !isValidFormat;
        
        // Check if current key is already saved
        chrome.storage.sync.get(['openaiApiKey']).then(result => {
            const hasExistingKey = result.openaiApiKey && result.openaiApiKey === apiKeyInput.value.trim();
            saveKeyButton.textContent = hasExistingKey ? 'API Key Saved ✓' : 'Save API Key';
            saveKeyButton.disabled = hasExistingKey;
        });
    }

    function isValidApiKeyFormat(apiKey) {
        return apiKey.startsWith('sk-') && apiKey.length > 20;
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.textContent = '';
                statusDiv.className = 'status';
            }, 3000);
        }
    }

    function setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    // Update button states when API key changes
    apiKeyInput.addEventListener('input', updateButtonStates);
});