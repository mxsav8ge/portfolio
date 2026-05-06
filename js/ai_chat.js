document.addEventListener('DOMContentLoaded', () => {
    const launcher = document.getElementById('ai-chat-launcher');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-chat');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatQuickSuggestions = document.getElementById('chat-quick-suggestions');

    // --- Page Content Extraction ---
    const extractPageContent = () => {
        const content = {
            skills: [],
            projects: [],
            education: null,
            experience: [],
            contact: {},
            about: ""
        };

        // Extract skills from skill cards
        const skillCards = document.querySelectorAll('.skill-category-card');
        skillCards.forEach(card => {
            const title = card.querySelector('.head-text h3')?.textContent.trim();
            const skills = [];
            const skillBars = card.querySelectorAll('.skill-bar-wrapper');
            skillBars.forEach(bar => {
                const skillName = bar.querySelector('.skill-info span')?.textContent.trim();
                if (skillName) skills.push(skillName);
            });
            if (title) {
                content.skills.push({ category: title, items: skills });
            }
        });

        // Extract projects
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const title = card.getAttribute('data-title');
            const tags = card.getAttribute('data-tags');
            if (title) {
                content.projects.push({ title, tags });
            }
        });

        // Extract education
        const eduCard = document.querySelector('.education-card');
        if (eduCard) {
            const degree = eduCard.querySelector('.edu-info h3')?.textContent.trim();
            const institution = eduCard.querySelector('.institution')?.textContent.trim();
            const coursework = [];
            eduCard.querySelectorAll('.coursework-list li').forEach(item => {
                coursework.push(item.textContent.trim());
            });
            content.education = { degree, institution, coursework };
        }

        // Extract experience
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            const title = item.querySelector('.exp-title-group h3')?.textContent.trim();
            const company = item.querySelector('.exp-company')?.textContent.trim();
            const details = [];
            item.querySelectorAll('.exp-details li').forEach(detail => {
                details.push(detail.textContent.trim());
            });
            if (title) {
                content.experience.push({ title, company, details });
            }
        });

        // Extract contact info
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            const label = item.querySelector('.label')?.textContent.trim();
            const value = item.querySelector('p')?.textContent.trim();
            if (label && value) {
                content.contact[label.toLowerCase()] = value;
            }
        });

        // Extract about description
        const aboutDesc = document.querySelector('.about-description');
        if (aboutDesc) {
            content.about = aboutDesc.textContent.trim();
        }

        return content;
    };

    const pageContent = extractPageContent();

    // AI Assistant Responses
    const responses = {
        welcome: "Hi there! 👋 I'm MC.Dev's AI assistant. Ask me about my skills, projects, experience, education, or get in touch!",
        placeholder: "Ask me anything...",
        resume_btn: "View My Resume",
        error: "I'm sorry, I didn't quite understand that. Try asking about my skills, projects, experience, education, or how to contact me!",
        hi: "I'm Mica Joy Labis, a front-end web developer with a passion for creating visually stunning and user-friendly digital experiences. What would you like to know?",
        praise: "Thank you so much! I appreciate your kind words. Feel free to explore more of my work or ask any questions!",
        thanks: "You're welcome! 😊 Let me know if you need anything else.",
        about: `I'm a front-end web designer specializing in sleek, high-performance websites. I combine technical proficiency with minimalist design to create compelling digital solutions. ${pageContent.about ? 'More about me: ' + pageContent.about.substring(0, 200) + '...' : ''}`,
        contact: "You can reach me through the contact form or directly via email. What's the best way I can help you?",
        resume: "I'm a graduate at Opol Community College with hands-on experience in front-end development, UI/UX design, and web development. <br><br> <button class='btn-chat-resume'>View My Resume</button>"
    };

    // Generate dynamic suggestions based on page content
    const generateQuickSuggestions = () => {
        const suggestions = [
            "Tell me about you",
        ];
        
        if (pageContent.skills.length > 0) suggestions.push("What are your skills?");
        if (pageContent.projects.length > 0) suggestions.push("Show me your projects");
        if (pageContent.experience.length > 0) suggestions.push("What's your experience?");
        
        return suggestions;
    };

    const renderQuickChats = () => {
        const suggestions = generateQuickSuggestions();
        chatQuickSuggestions.innerHTML = suggestions.map(chip => `<button class="chip">${chip}</button>`).join('');
    };

    // Toggle Chat Window
    launcher.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
            chatInput.placeholder = responses.placeholder;
            renderQuickChats();
        }
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Close on escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatWindow.classList.contains('active')) {
            chatWindow.classList.remove('active');
        }
    });

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const showTyping = () => {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing">
                <span></span><span></span><span></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    };

    // Generate skill response from extracted data
    const generateSkillsResponse = () => {
        if (pageContent.skills.length === 0) return responses.error;

        let response = "Here are my key skill areas:<br><br>";
        pageContent.skills.forEach(skillGroup => {
            response += `<strong>${skillGroup.category}:</strong> ${skillGroup.items.join(', ')}<br>`;
        });
        return response;
    };

    // Generate projects response from extracted data
    const generateProjectsResponse = () => {
        if (pageContent.projects.length === 0) return responses.error;

        let response = "My latest projects include:<br><br>";
        pageContent.projects.forEach(proj => {
            response += `<strong>${proj.title}</strong> - ${proj.tags}<br>`;
        });
        response += "<br>Check out the projects section for details!";
        return response;
    };

    // Generate experience response from extracted data
    const generateExperienceResponse = () => {
        if (pageContent.experience.length === 0) return responses.error;

        let response = "Here's my professional experience:<br><br>";
        pageContent.experience.forEach(exp => {
            response += `<strong>${exp.title}</strong> at ${exp.company || 'N/A'}<br>`;
        });
        return response;
    };

    // Generate education response from extracted data
    const generateEducationResponse = () => {
        if (!pageContent.education) return responses.error;

        const edu = pageContent.education;
        let response = `<strong>${edu.degree}</strong> from ${edu.institution}<br><br>`;
        if (edu.coursework.length > 0) {
            response += "Relevant coursework: ";
            response += edu.coursework.join(", ");
        }
        return response;
    };

    // Generate contact response from extracted data
    const generateContactResponse = () => {
        let response = "You can reach me through:<br><br>";
        Object.entries(pageContent.contact).forEach(([key, value]) => {
            response += `<strong>${key}:</strong> ${value}<br>`;
        });
        return response;
    };

    const handleChat = async (directText = null) => {
        const text = directText || chatInput.value.trim();
        if (!text) return;

        // User Message
        addMessage(text, 'user');
        chatInput.value = '';

        // AI Thinking
        const typingIndicator = showTyping();

        // Simulate AI response delay
        setTimeout(() => {
            typingIndicator.remove();
            
            const input = text.toLowerCase();
            let response = "";

            // Greeting
            if (input.includes('hello') || input.includes('hi') || input.includes('who are you')) {
                response = `${responses.hi} <br><br> <button class="btn-chat-resume">${responses.resume_btn}</button>`;
            }
            // Praise
            else if (input.includes('nice') || input.includes('good job') || input.includes('great') || input.includes('amazing') || input.includes('wow')) {
                response = responses.praise;
            }
            // Thanks
            else if (input.includes('thank you') || input.includes('thanks')) {
                response = responses.thanks;
            }
            // Skills
            else if (input.includes('skill') || input.includes('expertise') || input.includes('proficient')) {
                response = generateSkillsResponse();
            }
            // Projects
            else if (input.includes('project') || input.includes('work') || input.includes('portfolio')) {
                response = generateProjectsResponse();
            }
            // Experience
            else if (input.includes('experience') || input.includes('worked') || input.includes('job')) {
                response = generateExperienceResponse();
            }
            // Education
            else if (input.includes('education') || input.includes('school') || input.includes('degree')) {
                response = generateEducationResponse();
            }
            // Contact
            else if (input.includes('contact') || input.includes('email') || input.includes('reach') || input.includes('phone')) {
                response = generateContactResponse();
            }
            // About
            else if (input.includes('about') || input.includes('tell me') || input.includes('who')) {
                response = responses.about;
            }
            // Resume
            else if (input.includes('resume') || input.includes('cv')) {
                response = `${responses.resume}`;
            }
            // Default
            else {
                response = responses.error;
            }
            
            addMessage(response, 'ai');
        }, 1500);
    };

    // Handle clicks on dynamically added elements
    chatWindow.addEventListener('click', (e) => {
        // Resume button click
        if (e.target.classList.contains('btn-chat-resume')) {
            const resumeModal = document.getElementById('resume-modal');
            if (resumeModal) {
                resumeModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
        
        // Chip click
        if (e.target.classList.contains('chip')) {
            handleChat(e.target.innerText);
        }
    });

    sendBtn.addEventListener('click', () => handleChat());
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // Initial Message
    setTimeout(() => {
        addMessage(responses.welcome, "ai");
        renderQuickChats();
    }, 1000);
});
