document.addEventListener('DOMContentLoaded', () => {
    // Navigation functionality
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile navigation toggle
    navToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Active navigation link tracking
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNavLink);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) scrollTopBtn.classList.add('visible');
        else scrollTopBtn.classList.remove('visible');
    });
    scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Intersection Observer fade-ins
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Typewriter hero
    function typeWriter() {
        const text = "Building Intelligent Solutions for Tomorrow";
        const titleElement = document.querySelector('.hero-text h1');
        if (!titleElement) return;
        titleElement.innerHTML = '';
        let i = 0;
        (function type() {
            if (i < text.length) {
                titleElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 100);
            }
        })();
    }
    setTimeout(typeWriter, 1000);

    // Contact form
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-msg');
    contactForm?.addEventListener('submit', async e => {
        e.preventDefault();
        formMessage.textContent = '';
        formMessage.className = 'form-message';

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
             subject: formData.get('subject')?.trim(), 
            message: formData.get('message')?.trim(),
        };

        if (!data.name || !data.email || !data.message) {
            return showFormMessage('⚠️ Please fill in all required fields.', 'error');
        }
        if (!isValidEmail(data.email)) {
            return showFormMessage('⚠️ Please enter a valid email address.', 'error');
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok && result.ok) {
                showFormMessage('✅ Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showFormMessage(result.error || '❌ Something went wrong. Try again later.', 'error');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            showFormMessage('❌ Network error. Please check your connection.', 'error');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    function showFormMessage(msg, type) {
        formMessage.textContent = msg;
        formMessage.className = `form-message ${type}`;
        if (type === 'success') {
            setTimeout(() => { formMessage.textContent = ''; formMessage.className = 'form-message'; }, 5000);
        }
    }
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Stats counters
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseFloat(counter.textContent);
            const increment = target / 50;
            let current = 0;
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(2);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target % 1 === 0 ? target : target.toFixed(2);
                }
            };
            updateCounter();
        });
    }
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { animateCounters(); statsObserver.unobserve(statsSection); }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // Parallax floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        floatingElements.forEach((el, i) => {
            el.style.transform = `translateY(${scrolled * -0.5 * (i + 1) * 0.3}px)`;
        });
    });

    // Hover and pulse effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-8px) scale(1.02)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0) scale(1)');
    });
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('click', () => {
            item.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => item.style.animation = '', 600);
        });
    });

    // Dynamic greeting
    const greetingElement = document.querySelector('.hero-text .subtitle');
    if (greetingElement) {
        const hour = new Date().getHours();
        greetingElement.innerHTML = hour < 12 ? '🌅 Good Morning!' : hour < 17 ? '☀️ Good Afternoon!' : '🌙 Good Evening!';
    }

    // Konami code easter egg
    let konamiCode = '';
    const konamiSequence = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';
    document.addEventListener('keydown', e => {
        konamiCode += e.code;
        if (!konamiSequence.includes(konamiCode)) konamiCode = '';
        if (konamiCode === konamiSequence) { activateEasterEgg(); konamiCode = ''; }
    });
    function activateEasterEgg() {
        const colors = ['#9AC1D2', '#CAF1DE', '#ACDDDE', '#14b8a6', '#3b82f6'];
        for (let i = 0; i < 50; i++) createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        const msg = document.createElement('div');
        msg.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            background:linear-gradient(135deg,var(--primary-500),var(--blue-500));color:#fff;
            padding:2rem;border-radius:1rem;font-size:1.25rem;font-weight:600;text-align:center;z-index:1000;
            animation:fadeInOut 3s ease-in-out forwards;`;
        msg.innerHTML = '🎉 You found the secret! <br> Thanks for exploring! 🚀';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    }
    function createConfetti(color) {
        const c = document.createElement('div');
        c.style.cssText = `position:fixed;width:10px;height:10px;background:${color};top:0;left:${Math.random()*100}%;
            border-radius:50%;pointer-events:none;z-index:999;animation:confettiFall 3s linear forwards;`;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 3000);
    }

    // Extra styles (pulse, fadeInOut, confettiFall, form-message, etc.)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {0%{transform:scale(1);}50%{transform:scale(1.1);}100%{transform:scale(1);} }
        @keyframes fadeInOut {0%{opacity:0;transform:translate(-50%,-50%) scale(0.8);}
            20%,80%{opacity:1;transform:translate(-50%,-50%) scale(1);}
            100%{opacity:0;transform:translate(-50%,-50%) scale(0.8);} }
        @keyframes confettiFall {0%{transform:translateY(0) rotate(0deg);opacity:1;}
            100%{transform:translateY(100vh) rotate(360deg);opacity:0;} }
        .form-message {margin-top:1rem;padding:0.75rem 1rem;border-radius:0.5rem;font-weight:500;text-align:center;}
        .form-message.success {background:#d1fae5;color:#065f46;border:1px solid #a7f3d0;}
        .form-message.error {background:#fee2e2;color:#991b1b;border:1px solid #fecaca;}
        .project-card {transition:all 0.3s cubic-bezier(0.4,0,0.2,1);}
    `;
    document.head.appendChild(style);

    // Year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // Loading screen
    function hideLoadingScreen() {
        const loading = document.getElementById('loading-screen');
        if (loading) { loading.style.opacity = '0'; setTimeout(() => loading.style.display = 'none', 500); }
    }
    window.addEventListener('load', () => setTimeout(hideLoadingScreen, 500));

    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { const img = entry.target; img.src = img.dataset.src; img.classList.remove('lazy'); obs.unobserve(img); }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
    }

    // Accessibility skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `position:absolute;top:-40px;left:6px;background:var(--accent-gradient);color:#fff;
        padding:8px;text-decoration:none;border-radius:4px;z-index:1000;transition:top 0.3s;`;
    skipLink.addEventListener('focus', () => skipLink.style.top = '6px');
    skipLink.addEventListener('blur', () => skipLink.style.top = '-40px');
    document.body.insertBefore(skipLink, document.body.firstChild);
    const mainContent = document.querySelector('.hero');
    if (mainContent && !document.getElementById('main')) mainContent.id = 'main';

    // Console message
    console.log(`
    🚀 Welcome to Mahathi Puppala's Portfolio!
    Built with Vanilla JS, Modern CSS3, Love ☕
    GitHub: https://github.com/mahathipuppala26
    LinkedIn: https://www.linkedin.com/in/mahathi-puppala-a37230270
    `);

    // Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW registered:', reg))
                .catch(err => console.log('SW registration failed:', err));
        });
    }
});
