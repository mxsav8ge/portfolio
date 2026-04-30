document.addEventListener('DOMContentLoaded', () => {
    const launcher = document.getElementById('ai-chat-launcher');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-chat');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle Chat Window
    launcher.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
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
        msgDiv.textContent = text;
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

    const handleChat = async () => {
        const text = chatInput.value.trim();
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

            if (input.includes('hello') || input.includes('hi')) {
                response = "I'm a 2nd year Bachelor of Science in Information Technology (BSIT) student with a deep passion for web design and development.";
            } else if (input.includes('nice') || input.includes('good job') || input.includes('goodjob') || input.includes('great') || input.includes('amazing') || input.includes('pinupuri') || input.includes('wow')) {
                response = "Thank you! If you have more questions about me feel free to ask, like about me, contacts, skills, education, or experience.";
            } else if (input.includes('skill')) {
                response = "I specialize in UI/UX Design, Front-End Development (HTML/CSS/JS), and Responsive Design. I'm also proficient in Figma and React!";
            } else if (input.includes('project')) {
                response = "You can view my latest work in the Projects section, including DynMovies, Ismeye Gallery, and Xoxo Social.";
            } else if (input.includes('contact') || input.includes('email')) {
                response = "Feel free to reach out via the contact form below or email me at Example@gmail.com. I'd love to hear from you!";
            } else if (input.includes('about') || input.includes('who are you')) {
                response = "I'm Mica Joy Labis, also known as MC.Dev. I'm a front-end designer focused on creating intuitive and beautiful digital experiences.";
            } else if (input.includes('resume') || input.includes('experience') || input.includes('education') || input.includes('attainment')) {
                response = "I'm a BSIT student at Opol Community College with experience in freelance front-end development and UI/UX design. Check out my Education and Experience sections for details!";
            } else {
                response = "Im so sorry i still cant understand that, please ask another question or ask about my resume, about me, my skills and contanct";
            }
            
            addMessage(response, 'ai');
        }, 1500);
    };

    sendBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // Initial Message
    setTimeout(() => {
        addMessage("Hi there! 👋 I'm your AI assistant. Ask me anything about MC.Dev's portfolio!", "ai");
    }, 1000);
});
