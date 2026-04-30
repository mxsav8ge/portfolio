document.addEventListener('DOMContentLoaded', () => {
    const launcher = document.getElementById('ai-chat-launcher');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-chat');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatQuickSuggestions = document.getElementById('chat-quick-suggestions');

    const chatTranslations = {
        en: {
            welcome: "Hi there! 👋 I'm your AI assistant. Ask me anything about MC.Dev's portfolio!",
            placeholder: "Ask me about skills, resume...",
            resume_btn: "View My Resume",
            quick_chats: ["Who are you?", "Skills", "Contact"],
            error: "Im so sorry i still cant understand that, please ask another question or ask about my resume, about me, my skills and contanct",
            responses: {
                hi: "I'm a 2nd year Bachelor of Science in Information Technology (BSIT) student with a deep passion for web design and development. What can i help you? feel free to ask my contacts, resume, experience, skills, education",
                praise: "Thank you! If you have more questions about me feel free to ask, like about me, contacts, skills, education, or experience.",
                thanks: "You're welcome! If you have more questions, feel free to ask.",
                skills: "I specialize in UI/UX Design, Front-End Development (HTML/CSS/JS), and Responsive Design. I'm also proficient in Figma and React!",
                projects: "You can view my latest work in the Projects section, including DynMovies, Ismeye Gallery, and Xoxo Social.",
                contact: "Feel free to reach out via the contact form below or email me at micajoylabis@gmail.com. I'd love to hear from you!",
                about: "I'm Mica Joy Labis, also known as MC.Dev. I'm a front-end designer focused on creating intuitive and beautiful digital experiences.",
                resume: "I'm a BSIT student at Opol Community College with experience in freelance front-end development and UI/UX design."
            }
        },
        bi: {
            welcome: "Halo! 👋 Ako ang imong AI assistant. Pangutana bisan unsa bahin sa portfolio ni MC.Dev!",
            placeholder: "Pangutana bahin sa kahanas, resume...",
            resume_btn: "Tan-awa ang Resume",
            quick_chats: ["Kinsa ka?", "Kahanas", "Kontak"],
            error: "Pasensya na, wala ko kasabot niana. Palihog pangutana pag-usab bahin sa akong resume, mahitungod kanako, akong kahanas, o kontak.",
            responses: {
                hi: "Usa ako ka 2nd year nga estudyante sa BSIT nga adunay lawom nga kadasig sa web design ug development. Unsay akong ikatabang? Mahimo kang mangutana bahin sa akong kontak, resume, kasinatian, kahanas, o edukasyon.",
                praise: "Salamat kaayo! Kung naa pa kay mga pangutana bahin kanako, ayaw pagpanuko sa pagpangutana, sama sa mahitungod kanako, kontak, kahanas, edukasyon, o kasinatian.",
                thanks: "Walay sapayan! Kung naa pa kay mga pangutana, ayaw pagpanuko sa pagpangutana.",
                skills: "Nag-specialize ko sa UI/UX Design, Front-End Development (HTML/CSS/JS), ug Responsive Design. Hanas usab ko sa Figma ug React!",
                projects: "Mahimo nimong tan-awon ang akong pinakabag-o nga trabaho sa seksyon sa mga Proyekto, lakip ang DynMovies, Ismeye Gallery, ug Xoxo Social.",
                contact: "Mobati nga gawasnon sa pagkontak kanako pinaagi sa contact form sa ubos o email kanako sa micajoylabis@gmail.com. Ganahan ko makadungog gikan kanimo!",
                about: "Ako si Mica Joy Labis, nailhan usab nga MC.Dev. Usa ako ka front-end designer nga naka-focus sa paghimo og intuitive ug nindot nga mga digital experience.",
                resume: "Usa ako ka estudyante sa BSIT sa Opol Community College nga adunay kasinatian sa freelance front-end development ug UI/UX design."
            }
        }
    };

    const getCurrentLang = () => localStorage.getItem('language') || 'en';

    const renderQuickChats = () => {
        const lang = getCurrentLang();
        const chips = chatTranslations[lang].quick_chats;
        chatQuickSuggestions.innerHTML = chips.map(chip => `<button class="chip">${chip}</button>`).join('');
    };

    // Toggle Chat Window
    launcher.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
            const lang = getCurrentLang();
            chatInput.placeholder = chatTranslations[lang].placeholder;
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

    const handleChat = async (directText = null) => {
        const text = directText || chatInput.value.trim();
        if (!text) return;

        const lang = getCurrentLang();
        const t = chatTranslations[lang];

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

            if (input.includes('hello') || input.includes('hi') || input.includes('halo') || input.includes('kumusta') || input.includes('who are you') || input.includes('kinsa ka')) {
                response = `${t.responses.hi} <br><br> <button class="btn-chat-resume">${t.resume_btn}</button>`;
            } else if (input.includes('nice') || input.includes('good job') || input.includes('goodjob') || input.includes('great') || input.includes('amazing') || input.includes('pinupuri') || input.includes('wow')) {
                response = t.responses.praise;
            } else if (input.includes('thank you') || input.includes('thanks') || input.includes('salamat')) {
                response = t.responses.thanks;
            } else if (input.includes('skill') || input.includes('kahanas')) {
                response = t.responses.skills;
            } else if (input.includes('project') || input.includes('proyekto')) {
                response = t.responses.projects;
            } else if (input.includes('contact') || input.includes('email') || input.includes('kontak')) {
                response = t.responses.contact;
            } else if (input.includes('about') || input.includes('mahitungod')) {
                response = t.responses.about;
            } else if (input.includes('resume') || input.includes('experience') || input.includes('education') || input.includes('kasinatian')) {
                response = `${t.responses.resume} <br><br> <button class="btn-chat-resume">${t.resume_btn}</button>`;
            } else {
                response = t.error;
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
        const lang = getCurrentLang();
        addMessage(chatTranslations[lang].welcome, "ai");
        renderQuickChats();
    }, 1000);
});
