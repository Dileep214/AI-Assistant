// API Configuration
const API_CONFIG = {
    GROQ_API_KEY: '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', // Your actual Groq API key
    GROQ_BASE_URL: 'https://api.groq.com/openai/v1',
    MODEL: 'llama3-70b-8192'  // ✅ correct model name
};

// Function to get API key (you can modify this to load from localStorage or environment)
function getApiKey() {
    // You can store the API key in localStorage for persistence
    const storedKey = localStorage.getItem('groq_api_key');
    if (storedKey) {
        return storedKey;
    }
    return API_CONFIG.GROQ_API_KEY;
}

// Function to set API key
function setApiKey(key) {
    localStorage.setItem('groq_api_key', key);
    API_CONFIG.GROQ_API_KEY = key;
}

// Function to make API calls to Groq
async function callGroqAPI(messages, maxTokens = 1000, temperature = 0.7) {
    const apiKey = getApiKey();
    
    if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
        throw new Error('Please set your Groq API key first. Go to https://console.groq.com/home to get your API key.');
    }

    console.log('Making API call to Groq with key:', apiKey.substring(0, 10) + '...');
    console.log('Request payload:', {
        model: API_CONFIG.MODEL,
        messages: messages,
        max_tokens: maxTokens,
        temperature: temperature
    });

    try {
        const response = await fetch(`${API_CONFIG.GROQ_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.MODEL,
                messages: messages,
                max_tokens: maxTokens,
                temperature: temperature
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Groq API error response:', errorData);
            throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const result = await response.json();
        console.log('API response:', result);
        
        if (!result.choices || !result.choices[0] || !result.choices[0].message) {
            throw new Error('Invalid response format from Groq API');
        }
        
        return result.choices[0].message.content;
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error: Unable to connect to Groq API. Please check your internet connection.');
        }
        throw error;
    }
} 