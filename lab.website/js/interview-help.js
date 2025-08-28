document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('interviewForm');
    const output = document.getElementById('interviewOutput');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const jobRoleSelect = document.getElementById('jobRole');
    const customRoleDiv = document.getElementById('customRoleDiv');
    const customRoleInput = document.getElementById('customRole');

    // Show/hide custom role input based on selection
    jobRoleSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            customRoleDiv.classList.remove('hidden');
            customRoleInput.required = true;
        } else {
            customRoleDiv.classList.add('hidden');
            customRoleInput.required = false;
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading spinner
        output.style.display = 'none';
        loadingSpinner.classList.remove('hidden');
        
        try {
            const formData = new FormData(form);
            const data = {
                jobRole: formData.get('jobRole') === 'other' ? formData.get('customRole') : formData.get('jobRole'),
                experienceLevel: formData.get('experienceLevel'),
                interviewType: formData.get('interviewType'),
                additionalContext: formData.get('additionalContext')
            };

            const questions = await generateInterviewQuestions(data);
            displayQuestions(questions);
        } catch (error) {
            console.error('Error generating interview questions:', error);
            showError(`Failed to generate interview questions: ${error.message}. Please check your API key and try again.`);
        } finally {
            loadingSpinner.classList.add('hidden');
            output.style.display = 'block';
        }
    });

    async function generateInterviewQuestions(data) {
        const experienceMap = {
            'entry-level': 'entry-level (0-2 years experience)',
            'mid-level': 'mid-level (3-5 years experience)',
            'senior': 'senior-level (6-10 years experience)',
            'lead': 'lead/manager level (10+ years experience)'
        };

        const interviewTypeMap = {
            'technical': 'technical questions',
            'behavioral': 'behavioral questions',
            'general': 'general interview questions',
            'case-study': 'case study questions',
            'system-design': 'system design questions',
            'coding': 'coding questions'
        };

        const experience = experienceMap[data.experienceLevel] || 'entry-level';
        const interviewType = interviewTypeMap[data.interviewType] || 'general';
        const context = data.additionalContext ? `\nAdditional context: ${data.additionalContext}` : '';

        const prompt = `Generate 10-15 ${interviewType} for a ${experience} ${data.jobRole} position.${context}

Please provide:
1. A mix of common and challenging questions appropriate for the experience level
2. Questions that test both technical skills and soft skills
3. Questions that are relevant to the specific job role
4. Brief explanations of what the interviewer is looking for in each answer

Format the response with clear question numbers and explanations.`;

        const messages = [
            {
                role: 'system',
                content: 'You are an expert interview coach and recruiter. Provide relevant, challenging, and appropriate interview questions for different roles and experience levels.'
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        return await callGroqAPI(messages, 2000, 0.7);
    }

    function displayQuestions(questionsText) {
        // Convert the text to HTML with proper formatting
        const formattedQuestions = questionsText
            .replace(/\n\n/g, '</p><p class="mb-4">')
            .replace(/\n/g, '<br>')
            .replace(/^(.*?)$/m, '<p class="mb-4">$1');

        output.innerHTML = `
            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div class="prose max-w-none">
                    ${formattedQuestions}
                </div>
                <div class="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                    <button onclick="copyToClipboard()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Copy to Clipboard
                    </button>
                    <button onclick="downloadQuestions()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        Download as Text
                    </button>
                    <button onclick="generateMoreQuestions()" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                        Generate More Questions
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
    const questionsContent = document.querySelector('#interviewOutput .prose').innerText;
    navigator.clipboard.writeText(questionsContent).then(() => {
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

function downloadQuestions() {
    const questionsContent = document.querySelector('#interviewOutput .prose').innerText;
    const blob = new Blob([questionsContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-questions.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function generateMoreQuestions() {
    // Trigger form submission again to generate more questions
    document.getElementById('interviewForm').dispatchEvent(new Event('submit'));
} 