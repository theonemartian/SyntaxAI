# SYNTAX - AI Text Rephraser Chrome Extension

A powerful Chrome extension that uses the latest **GPT-4.1 Nano** model to rephrase selected text with customizable writing styles for clearer, more professional writing.

## Features

- 🤖 **Latest AI Model**: Powered by OpenAI's GPT-4.1 Nano (2025-04-14) for superior text rephrasing
- 🎨 **Multiple Writing Styles**: Choose from Professional, Casual, Formal, Concise, Creative, or Custom styles
- ✏️ **Custom Instructions**: Define your own rephrasing style with personalized instructions
- 🎯 **Right-click Integration**: Select text and right-click to access "Rephrase with AI"
- ✨ **Smart Text Replacement**: Direct element targeting for reliable text replacement
- 📝 **Universal Compatibility**: Works on any website with text inputs, textareas, and contenteditable elements
- ⚡ **Fast Processing**: Quick API responses with loading indicators
- 📏 **Longer Text Support**: Handles up to ~3000 tokens (≈12,000 characters) of text
- 🔒 **Secure Storage**: API keys and preferences stored locally in Chrome's sync storage
- 🎨 **Modern UI**: Clean, intuitive popup interface for configuration

## Installation

### From Source (Developer Mode)

1. **Download the Extension**
   - Clone or download this repository
   - Extract the files to a folder on your computer

2. **Enable Developer Mode**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"


## 🎨 Writing Styles Available

### 📋 **Built-in Styles**
- **Professional** (Default): Clear, professional, and well-structured
- **Casual**: Friendly, conversational, and approachable
- **Formal**: Academic, precise, and sophisticated
- **Concise**: Brief, direct, and to the point
- **Creative**: Engaging, vivid, and interesting

### ✏️ **Custom Style**
Define your own rephrasing instructions:
- "Make it sound more confident and persuasive"
- "Use simple words that a 12-year-old can understand"
- "Add more technical details and industry jargon"
- "Make it sound more empathetic and caring"

## ⚙️ Setup

1. Click the SYNTAX extension icon in your toolbar
2. Enter your OpenAI API key in the popup
3. **Choose your preferred writing style:**
   - **Professional** (Default): Clear and professional
   - **Casual**: Friendly and conversational
   - **Formal**: Academic and sophisticated
   - **Concise**: Brief and direct
   - **Creative**: Engaging and vivid
   - **Custom**: Define your own style with specific instructions
4. Click "Save All Settings"
5. Use "Test Connection" to verify your setup

### 🎨 Custom Style Examples

When selecting "Custom Style", you can provide specific instructions like:
- *"Make it sound more confident and assertive"*
- *"Use simple language that anyone can understand"*
- *"Add more technical details and industry terminology"*
- *"Make it more empathetic and understanding"*
- *"Write in a storytelling format with examples"*

2. **Enable Developer Mode**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The SYNTAX extension should now appear in your extensions list

4. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in Chrome's toolbar
   - Find SYNTAX and click the pin icon to keep it visible

## Setup

### Getting Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account (create one if needed)
3. Click "Create new secret key"
4. Copy the generated API key (starts with `sk-`)

### Configuring the Extension

1. Click the SYNTAX extension icon in your Chrome toolbar
2. Paste your OpenAI API key in the input field
3. Click "Save API Key"
4. Optionally, click "Test Connection" to verify your key works


# SYNTAX - AI Text Rephraser Chrome Extension

A simple and effective Chrome extension that uses ChatGPT API to rephrase selected text on any webpage with customizable writing styles for clearer, more professional writing.

## ✨ Key Features

- **Simple & Direct**: Captures the exact element where text is selected and replaces it directly
- **Multiple Writing Styles**: Choose from Professional, Casual, Formal, Concise, Creative, or Custom styles
- **Custom Instructions**: Define your own rephrasing style with personalized instructions
- **Universal Compatibility**: Works on input fields, textareas, and contenteditable elements
- **Secure API Integration**: Your OpenAI API key is stored securely in Chrome's sync storage
- **Smart Element Detection**: Uses XPath to precisely identify and target elements
- **Longer Text Support**: Handles up to ~3000 tokens (≈12,000 characters) of text
- **Clean Interface**: Minimal, non-intrusive notifications

## 🎨 Writing Styles Available

### 📋 **Built-in Styles**
- **Professional** (Default): Clear, professional, and well-structured
- **Casual**: Friendly, conversational, and approachable
- **Formal**: Academic, precise, and sophisticated
- **Concise**: Brief, direct, and to the point
- **Creative**: Engaging, vivid, and interesting

### ✏️ **Custom Style**
Define your own rephrasing instructions:
- "Make it sound more confident and persuasive"
- "Use simple words that a 12-year-old can understand"
- "Add more technical details and industry jargon"
- "Make it sound more empathetic and caring"

## 🎯 How It Works

### Simple 2-Step Process

1. **Capture Selection**: When you select text, the extension captures:
   - The exact element (input, textarea, or contenteditable)
   - The element's XPath for precise targeting
   - Selection start/end positions for inputs
   - Text node details for contenteditable areas

2. **Direct Replacement**: Replace text directly in the captured element:
   - **Input/Textarea**: Direct value replacement with proper event triggering
   - **Contenteditable**: Text content replacement with input events
   - **Text Nodes**: Direct node value replacement

- **Simple & Direct**: Captures the exact element where text is selected and replaces it directly
- **Universal Compatibility**: Works on input fields, textareas, and contenteditable elements
- **Secure API Integration**: Your OpenAI API key is stored securely in Chrome's sync storage
- **Smart Element Detection**: Uses XPath to precisely identify and target elements
- **Clean Interface**: Minimal, non-intrusive notifications
- **Intelligent Positioning**: Context-aware notification positioning
- **Robust Error Handling**: Comprehensive fallback mechanisms for reliable operation

## 🎯 Supported Text Input Types

### Standard Elements
- ✅ Text inputs (`<input type="text">`)
- ✅ Email inputs (`<input type="email">`)
- ✅ Password inputs (`<input type="password">`)
- ✅ Search inputs (`<input type="search">`)
- ✅ URL inputs (`<input type="url">`)
- ✅ Tel inputs (`<input type="tel">`)
- ✅ Number inputs (`<input type="number">`)
- ✅ Textareas (`<textarea>`)

### Advanced Elements
- ✅ Contenteditable divs (`<div contenteditable="true">`)
- ✅ Elements with `role="textbox"`
- ✅ Rich text editors (Quill, Draft.js, Froala, Summernote)
- ✅ Google Docs and Google Sheets
- ✅ Code editors (Ace, CodeMirror, Monaco)
- ✅ Custom web applications with complex DOM structures

### Complex Scenarios
- ✅ Shadow DOM elements
- ✅ Dynamically created content
- ✅ Iframe content (where accessible)
- ✅ Focus-within containers
- ✅ Recently interacted elements

## 🚀 How It Works

### Multi-Layer Text Replacement Strategy

The extension uses a sophisticated 6-layer approach to ensure text replacement works across different websites:

1. **Stored Selection Method**: Uses the original text selection range (most reliable)
2. **Focused Element Method**: Targets the currently focused input element
3. **Input Elements Scan**: Searches all standard input elements on the page
4. **Contenteditable Scan**: Searches all contenteditable elements
5. **Document Selection Method**: Uses current browser selection
6. **Advanced Text Walker**: Deep DOM traversal for complex scenarios

### Smart Element Detection

The extension intelligently identifies editable elements by checking:
- Standard HTML input types and attributes
- Contenteditable properties
- ARIA roles (`role="textbox"`)
- Common rich text editor class names
- Data attributes indicating editability
- Element focus state and cursor styles
- Shadow DOM content

### Website-Specific Optimizations

Special handling for popular platforms:
- **Google Docs**: Detects `.notranslate` and `.kix-lineview` elements
- **Quill Editor**: Targets `.ql-editor` elements
- **Draft.js**: Handles `.DraftEditor-root` components
- **Code Editors**: Supports Ace (`.ace_editor`), CodeMirror (`.CodeMirror`), Monaco (`.monaco-editor`)
- **WYSIWYG Editors**: Generic support for common editor patterns

## 🔧 Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The SYNTAX extension icon should appear in your toolbar

## ⚙️ Setup

1. Click the SYNTAX extension icon in your toolbar
2. Enter your OpenAI API key in the popup
3. Click "Save API Key"
4. Use "Test Connection" to verify your setup

## 📖 Usage

1. **Select Text**: Highlight any text on a webpage
2. **Right-Click**: Open the context menu
3. **Choose "Rephrase with AI"**: The extension will process your text
4. **Wait for Results**: A loading indicator will appear
5. **Text Replaced**: The original text will be replaced with the AI-rephrased version

## 🌐 Website Compatibility

### Excellent Compatibility
- Gmail compose window
- Google Docs
- LinkedIn messaging
- Twitter compose
- Facebook posts
- Standard HTML forms
- Most blogging platforms

### Good Compatibility
- Complex web applications (like Abacus.ai)
- Rich text editors
- Custom input components
- Dynamic content areas

### Limited Compatibility
- Read-only content
- Heavily protected forms
- Some iframe-based editors
- Elements with strict CSP policies

## 🛠️ Technical Details

### Architecture
- **Manifest V3**: Uses the latest Chrome extension architecture
- **Service Worker**: Background script for API calls and context menu
- **Content Script**: Injected into all pages for text manipulation
- **Popup Interface**: Settings and API key management

### Security
- API keys stored in Chrome's secure sync storage
- No data sent to external servers except OpenAI
- Minimal permissions requested
- Content Security Policy compliant

### Performance
- Lazy loading of components
- Efficient DOM traversal algorithms
- Minimal memory footprint
- Smart caching of element references

## 🔍 Troubleshooting

### Common Issues

**Text not being replaced?**
- Try selecting text in a simpler input field first
- Ensure the text is in an editable element
- Check that the extension has proper permissions

**Extension not working on a specific site?**
- Refresh the page after installing/updating the extension
- Check browser console for error messages
- Some sites may have restrictions on content modification

**API errors?**
- Verify your OpenAI API key is correct
- Check your OpenAI account billing status
- Ensure you have API access enabled

### Debug Information

The extension provides detailed console logging:
1. Press F12 to open Developer Tools
2. Go to the Console tab
3. Look for messages starting with "SYNTAX"
4. These will show the replacement strategy being used

## 📁 Project Structure

```
SYNTAX/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (API calls, context menu)
├── content.js            # Content script (text replacement logic)
├── popup.html            # Settings interface
├── popup.js              # Popup functionality
├── styles.css            # Extension styling
├── icons/                # Extension icons
├── README.md             # This file
├── INSTALLATION.md       # Installation guide
├── QUICK_START.md        # Quick start guide
├── PROJECT_STRUCTURE.md  # Detailed project structure
└── TROUBLESHOOTING.md    # Troubleshooting guide
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is open source. Please check the license file for details.

## 🔗 Links

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Chrome Extension Development](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

---

**Made with ❤️ for better writing everywhere on the web!**
5. **Done**: The selected text is automatically replaced with the rephrased version

### Supported Elements

- Text input fields (`<input type="text">`)
- Textareas (`<textarea>`)
- Contenteditable elements (rich text editors)
- Regular webpage text (read-only replacement)

## Privacy & Security

- **Local Storage**: Your API key is stored securely in Chrome's local storage
- **Direct Communication**: Text is sent directly to OpenAI's servers
- **No Data Collection**: This extension doesn't collect or store your text
- **Open Source**: All code is available for review

## Troubleshooting

### Common Issues

**"Please set your OpenAI API key" Error**
- Solution: Open the extension popup and enter your API key

**"Invalid API key" Error**
- Solution: Verify your API key is correct and starts with `sk-`
- Check that your OpenAI account has API access

**"Rate limit exceeded" Error**
- Solution: Wait a few minutes before trying again
- Consider upgrading your OpenAI plan for higher limits

**Text not replacing properly**
- Solution: Try selecting the text again and ensure it's in an editable field
- Some websites may have restrictions on text modification

**Extension not appearing in context menu**
- Solution: Refresh the webpage and try again
- Check that the extension is enabled in `chrome://extensions/`

### API Costs

- This extension uses OpenAI's GPT-3.5-turbo model
- Typical cost: ~$0.002 per 1000 tokens (very affordable)
- Monitor usage in your [OpenAI dashboard](https://platform.openai.com/usage)

## Technical Details

### Files Structure

```
SYNTAX/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for API calls
├── content.js            # Text selection and replacement
├── popup.html            # Settings interface
├── popup.js              # Popup functionality
├── styles.css            # UI styling
├── icons/                # Extension icons
└── README.md             # This file
```

### Permissions Used

- `storage`: Store API key securely
- `contextMenus`: Add right-click menu option
- `activeTab`: Access current webpage for text replacement
- `https://api.openai.com/*`: Make API calls to OpenAI

### API Integration

- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Model**: `gpt-3.5-turbo`
- **Max Tokens**: 500
- **Temperature**: 0.7 (balanced creativity/consistency)

## Development

### Building from Source

1. Clone the repository
2. No build process required - it's vanilla JavaScript
3. Load in Chrome as described in Installation section

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Version History

### v1.0.0
- Initial release
- Basic text rephrasing functionality
- OpenAI API integration
- Context menu integration
- Popup configuration interface

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests:
1. Check the troubleshooting section above
2. Review existing GitHub issues
3. Create a new issue with detailed information

---

**Made with ❤️ for better writing**