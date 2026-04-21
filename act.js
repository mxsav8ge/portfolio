document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        modeToggle.checked = true;
    }

    // Toggle theme
    modeToggle.addEventListener('change', () => {
        if (modeToggle.checked) {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Simple reveal animation on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });

    // Skill bar animation on scroll
    const skillBars = document.querySelectorAll('.bar-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pct = entry.target.parentElement.previousElementSibling.querySelector('.pct').innerText;
                entry.target.style.width = pct;
            }
        });
    }, { threshold: 0.2 });
    
    skillBars.forEach(bar => skillObserver.observe(bar));

    // Header scroll background toggle
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Projects Advanced Logic ---
    const projectsContainer = document.getElementById('projects-container');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('project-search');
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');

    // 1. Search Logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            projectCards.forEach(card => {
                const title = card.getAttribute('data-title').toLowerCase();
                const tags = card.getAttribute('data-tags').toLowerCase();
                if (title.includes(term) || tags.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 2. View Toggle Logic
    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => {
            projectsContainer.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            lucide.createIcons(); // Refresh icons if layout shift impacts them
        });

        listBtn.addEventListener('click', () => {
            projectsContainer.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            lucide.createIcons();
        });
    }

    // 3. Pagination (Basic Placeholder Logic)
    const paginationBtns = document.querySelectorAll('.page-num');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            paginationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // In a real app, you'd filter the grid items here
        });
    });

    // --- Interactive Feedback System (Toasts & Form) ---
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');

    // 1. Toast Utility
    const showToast = (title, message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 'alert-circle';
        
        toast.innerHTML = `
            <i data-lucide="${icon}"></i>
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <div class="toast-progress"></div>
        `;

        toastContainer.appendChild(toast);
        lucide.createIcons();

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    };

    // 2. Form Submission Interceptor
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.btn-send');
            
            // Enter loading state
            submitBtn.classList.add('btn-loading');

            // Simulate Network Delay (1.5s)
            setTimeout(() => {
                // Reset State
                submitBtn.classList.remove('btn-loading');
                contactForm.reset();

                // Show Success Toast
                showToast(
                    'Message Sent!',
                    `Thank you for reaching out. I'll get back to you soon!`,
                    'success'
                );
            }, 1500);
        });
    }

    // --- Global Scroll HUD (Progress Bar & Back to Top) ---
    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        // 1. Update Progress Bar
        const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (windowScroll / height) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }

        // 2. Back to Top Visibility
        if (windowScroll > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // 3. Back to Top Click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
