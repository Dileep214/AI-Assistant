document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('emailForm');
    const output = document.getElementById('emailOutput');
    const loadingSpinner = document.getElementById('loadingSpinner');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading spinner
        output.style.display = 'none';
        loadingSpinner.classList.remove('hidden');
        
        try {
            const formData = new FormData(form);
            const data = {
                emailType: formData.get('emailType'),
                recipient: formData.get('recipient'),
                subject: formData.get('subject'),
                context: formData.get('context')
            };

            const email = await generateEmail(data);
            displayEmail(email);
        } catch (error) {
            console.error('Error generating email:', error);
            showError(`Failed to generate email: ${error.message}. Please check your API key and try again.`);
        } finally {
            loadingSpinner.classList.add('hidden');
            output.style.display = 'block';
        }
    });

    async function generateEmail(data) {
        const toneMap = {
            'professional': 'professional and formal',
            'casual': 'friendly and casual',
            'formal': 'very formal and academic',
            'sales': 'persuasive and sales-oriented',
            'follow-up': 'professional and follow-up focused',
            'thank-you': 'warm and appreciative'
        };

        const tone = toneMap[data.emailType] || 'professional';
        const recipientText = data.recipient ? ` for ${data.recipient}` : '';

        const prompt = `Write a ${tone} email${recipientText} with the subject line: "${data.subject}"

Context and requirements:
${data.context}

Please write a complete email including:
1. Appropriate greeting
2. Clear and well-structured body
3. Professional closing
4. Your name (use "Best regards" or similar)

Make sure the email is ${tone} in tone and addresses the context provided.`;

        const messages = [
            {
                role: 'system',
                content: 'You are a professional email writer. Create well-structured, appropriate emails based on the context and tone requirements.'
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        return await callGroqAPI(messages, 1000, 0.7);
    }

    function displayEmail(emailText) {
        // Convert the text to HTML with proper formatting
        const formattedEmail = emailText
            .replace(/\n\n/g, '</p><p class="mb-4">')
            .replace(/\n/g, '<br>')
            .replace(/^(.*?)$/m, '<p class="mb-4">$1');

        output.innerHTML = `
            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div class="prose max-w-none">
                    ${formattedEmail}
                </div>
                <div class="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                    <button onclick="copyToClipboard()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Copy to Clipboard
                    </button>
                    <button onclick="downloadEmail()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        Download as Text
                    </button>
                    <button onclick="editEmail()" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                        Edit Email
                    </button>
                </div>
            </div>
        `;
    }

    function showError(message) {
        output.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                <div class="flex items-center">
                    <svg class="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-red-700">${message}</p>
                </div>
            </div>
        `;
    }
});

function copyToClipboard() {
    const emailContent = document.querySelector('#emailOutput .prose').innerText;
    navigator.clipboard.writeText(emailContent).then(() => {
        // Show success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        button.classList.add('bg-green-500', 'hover:bg-green-600');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-500', 'hover:bg-green-600');
            button.classList.add('bg-blue-500', 'hover:bg-blue-600');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard. Please copy manually.');
    });
}

function downloadEmail() {
    const emailContent = document.querySelector('#emailOutput .prose').innerText;
    const blob = new Blob([emailContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-email.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function editEmail() {
    const emailContent = document.querySelector('#emailOutput .prose').innerText;
    const textarea = document.createElement('textarea');
    textarea.value = emailContent;
    textarea.style.width = '100%';
    textarea.style.height = '200px';
    textarea.style.marginTop = '1rem';
    textarea.style.padding = '0.5rem';
    textarea.style.border = '1px solid #d1d5db';
    textarea.style.borderRadius = '0.375rem';
    
    const container = document.querySelector('#emailOutput .prose');
    container.innerHTML = '';
    container.appendChild(textarea);
    
    // Add save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Changes';
    saveButton.className = 'mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors';
    saveButton.onclick = () => {
        const newContent = textarea.value;
        displayEmail(newContent);
    };
    container.appendChild(saveButton);
} 