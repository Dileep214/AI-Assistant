document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resumeForm');
    const preview = document.getElementById('resumePreview');
    const loadingSpinner = document.getElementById('loadingSpinner');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading spinner
        preview.style.display = 'none';
        loadingSpinner.classList.remove('hidden');
        
        try {
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                skills: formData.get('skills'),
                education: formData.get('education'),
                experience: formData.get('experience')
            };

            const resume = await generateResume(data);
            displayResume(resume);
        } catch (error) {
            console.error('Error generating resume:', error);
            showError(`Failed to generate resume: ${error.message}. Please check your API key and try again.`);
        } finally {
            loadingSpinner.classList.add('hidden');
            preview.style.display = 'block';
        }
    });

    async function generateResume(data) {
        const prompt = `Create a professional resume for ${data.name} with the following information:

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}

Skills: ${data.skills}

Education: ${data.education}

Work Experience: ${data.experience}

Please format this as a professional resume with clear sections, bullet points for achievements, and professional language. Include a professional summary at the top.`;

        const messages = [
            {
                role: 'system',
                content: 'You are a professional resume writer. Create well-formatted, professional resumes that highlight skills and achievements.'
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        return await callGroqAPI(messages, 1500, 0.7);
    }

    function displayResume(resumeText) {
        // Convert the text to HTML with proper formatting
        const formattedResume = resumeText
            .replace(/\n\n/g, '</p><p class="mb-4">')
            .replace(/\n/g, '<br>')
            .replace(/^(.*?)$/m, '<p class="mb-4">$1');

        preview.innerHTML = `
            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div class="prose max-w-none">
                    ${formattedResume}
                </div>
                <div class="mt-6 pt-4 border-t border-gray-200">
                    <button onclick="window.print()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        Print Resume
                    </button>
                    <button onclick="downloadResume()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors ml-2">
                        Download PDF
                    </button>
                </div>
            </div>
        `;
    }

    function showError(message) {
        preview.innerHTML = `
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

function downloadResume() {
    // This would typically use a library like jsPDF or html2pdf
    // For now, we'll just show an alert
    alert('PDF download functionality would be implemented here. For now, you can use the print function to save as PDF.');
} 