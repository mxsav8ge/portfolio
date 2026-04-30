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


    window.addEventListener('scroll', () => {
        // 1. Update Progress Bar
        const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (windowScroll / height) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }


    });



    // --- "Sentient" Hero (Mouse Parallax Engine) ---
    const hero = document.querySelector('.hero');
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    const lerpAmount = 0.1; // Smoothness factor (lower = smoother/laggier)

    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            // Get mouse position relative to center of screen
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            // Normalize current mouse pos to range [-50, 50]
            mouseX = (clientX - innerWidth / 2) / (innerWidth / 2) * 50;
            mouseY = (clientY - innerHeight / 2) / (innerHeight / 2) * 50;
        });

        const updateParallax = () => {
            // Linear Interpolation (LERP) for buttery smooth motion
            currentX += (mouseX - currentX) * lerpAmount;
            currentY += (mouseY - currentY) * lerpAmount;

            hero.style.setProperty('--mx', `${currentX}px`);
            hero.style.setProperty('--my', `${currentY}px`);

            requestAnimationFrame(updateParallax);
        };

        // Start the animation loop
        updateParallax();
    }
    // --- Mobile Sidebar Toggle Engine ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    }

    // --- Cinematic Looping Arrow Engine ---
    const projsContainer = document.querySelector('.projects-container');
    const cards = document.querySelectorAll('.project-card');
    const prevBtn = document.getElementById('prev-proj');
    const nextBtn = document.getElementById('next-proj');
    let currentIndex = 0;

    if (projsContainer && cards.length > 0) {
        const updateGallery = (index) => {
            const targetCard = cards[index];
            const scrollPos = targetCard.offsetLeft - projsContainer.offsetLeft;
            
            projsContainer.scrollTo({
                left: scrollPos,
                behavior: 'smooth'
            });
        };

        // Next Button with Loop
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % cards.length;
                updateGallery(currentIndex);
            });
        }

        // Prev Button with Loop
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                updateGallery(currentIndex);
            });
        }

        // Scroll Tracker (Sync manual swipe with currentIndex)
        projsContainer.addEventListener('scroll', () => {
            let activeIndex = 0;
            let minDistance = Infinity;

            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft - projsContainer.scrollLeft + (card.offsetWidth / 2);
                const containerCenter = projsContainer.offsetWidth / 2;
                const distance = Math.abs(cardCenter - containerCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    activeIndex = index;
                }
            });
            currentIndex = activeIndex;
        });
    }
    // --- Particle System Engine ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(168, 85, 247, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        animate();
    }

    // Resume Modal Logic
    const resumeBtn = document.getElementById('view-resume-btn');
    const resumeModal = document.getElementById('resume-modal');
    const resumeClose = document.getElementById('resume-modal-close');

    if (resumeBtn && resumeModal) {
        resumeBtn.addEventListener('click', () => {
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        resumeClose.addEventListener('click', () => {
            resumeModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                resumeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
                resumeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Back to Top Logic
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
