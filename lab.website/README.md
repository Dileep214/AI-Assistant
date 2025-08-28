# AI Assistant - Powered by Groq

A modern web application that provides AI-powered tools for resume building, email writing, and interview preparation. Built with HTML, CSS (Tailwind), and JavaScript, using Groq's fast inference API.

## Features

- **Resume Builder**: Create professional resumes with AI-generated content
- **Email Writer**: Generate context-aware emails with customizable tone
- **Interview Help**: Get role-specific interview questions and preparation guidance
- **API Key Management**: Secure storage and testing of your Groq API key

## Setup Instructions

### 1. Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/home)
2. Sign up or log in to your account
3. Navigate to the "API Keys" section
4. Create a new API key
5. Copy the API key (it starts with `gsk_`)

### 2. Configure the API Key

1. Open the application in your browser
2. On the home page, you'll see an "API Configuration" section
3. Enter your Groq API key in the password field
4. Click "Save API Key" to store it securely
5. Click "Test Connection" to verify everything is working

### 3. Start Using the Tools

Once your API key is configured, you can use any of the three main tools:

- **Resume Builder**: Fill in your information and generate professional resumes
- **Email Writer**: Choose email type, add context, and generate appropriate emails
- **Interview Help**: Select job role and experience level for targeted interview questions

## Technical Details

### API Configuration

The application uses Groq's Llama 3.3 70B model for fast inference. The API configuration is managed in `js/config.js`:

- **Base URL**: `https://api.groq.com/openai/v1`
- **Model**: `llama-3.3-70b-v2`
- **Storage**: API keys are stored securely in browser localStorage

### File Structure

```
lab.website/
├── index.html              # Home page with API configuration
├── resume-builder.html     # Resume generation tool
├── email-writer.html       # Email writing tool
├── interview-help.html     # Interview preparation tool
├── js/
│   ├── config.js          # API configuration and functions
│   ├── resume-builder.js  # Resume generation logic
│   ├── email-writer.js    # Email generation logic
│   └── interview-help.js  # Interview questions logic
└── README.md              # This file
```

### Security Notes

- API keys are stored locally in your browser's localStorage
- Keys are never transmitted to external servers except Groq's API
- The application runs entirely in your browser for maximum privacy

## Troubleshooting

### Common Issues

1. **"Please set your Groq API key first"**
   - Make sure you've entered your API key on the home page
   - Click "Save API Key" after entering it

2. **"Connection failed"**
   - Verify your API key is correct
   - Check your internet connection
   - Ensure you have sufficient Groq credits

3. **"API key is working but no response"**
   - Try refreshing the page
   - Check the browser console for detailed error messages

### Getting Help

- Visit [Groq Documentation](https://console.groq.com/docs) for API details
- Check the browser console (F12) for detailed error messages
- Ensure you have sufficient credits in your Groq account

## Browser Compatibility

This application works best in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is open source and available under the MIT License.

---

**Note**: This application requires a valid Groq API key to function. The API key is used only for making requests to Groq's servers and is stored locally in your browser. 