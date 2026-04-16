/* ==========================================
   SCRIPT.JS — SANKET BRAHMBHATT PORTFOLIO
   QA Manual Tester Portfolio
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================
       1. LOADER
       ========================================== */
    const loader        = document.getElementById('loader');
    const loaderBar     = document.getElementById('loaderBar');
    const loaderPercent = document.getElementById('loaderPercent');
    let   loadProgress  = 0;

    document.body.style.overflow = 'hidden';

    const loaderInterval = setInterval(() => {
        loadProgress += Math.random() * 12 + 3;

        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loaderInterval);

            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                initRevealAnimations();
                animateCounters();
            }, 600);
        }

        if (loaderBar)     loaderBar.style.width      = loadProgress + '%';
        if (loaderPercent) loaderPercent.textContent  = Math.floor(loadProgress) + '%';

    }, 120);

    /* ==========================================
       2. CUSTOM CURSOR (Desktop only)
       ========================================== */
    const cursor     = document.getElementById('cursor');
    const follower   = document.getElementById('cursorFollower');
    const cursorText = document.getElementById('cursorText');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    if (window.matchMedia('(pointer: fine)').matches && cursor && follower) {

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
            if (cursorText) {
                cursorText.style.left = mouseX + 'px';
                cursorText.style.top  = mouseY + 'px';
            }
        });

        (function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            follower.style.transform = `translate(${followerX - 17}px, ${followerY - 17}px)`;
            requestAnimationFrame(animateFollower);
        })();

        document.addEventListener('mousedown', () => cursor.classList.add('click'));
        document.addEventListener('mouseup',   () => cursor.classList.remove('click'));

        /* Hover states */
        document.querySelectorAll(
            'a, button, .btn, .skill-card, .portfolio-card, .filter-btn, .skill-tab, .contact-card, .education-card, .timeline-card'
        ).forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
        });

        /* Text hover states */
        document.querySelectorAll('.hero-name, .section-title').forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('hover-text');
                if (cursorText) {
                    cursorText.classList.add('visible');
                    cursorText.textContent = 'EXPLORE';
                }
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('hover-text');
                if (cursorText) cursorText.classList.remove('visible');
            });
        });
    }

    /* ==========================================
       3. PARTICLE CANVAS
       ========================================== */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeCanvas, 200);
        });

        class Particle {
            constructor() { this.reset(); }

            reset() {
                this.x       = Math.random() * canvas.width;
                this.y       = Math.random() * canvas.height;
                this.size    = Math.random() * 1.5 + 0.5;
                this.speedX  = (Math.random() - 0.5) * 0.4;
                this.speedY  = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.4 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (
                    this.x < 0 || this.x > canvas.width ||
                    this.y < 0 || this.y > canvas.height
                ) { this.reset(); }
            }

            draw() {
                const rgb = getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-rgb').trim() || '0,240,255';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${this.opacity})`;
                ctx.fill();
            }
        }

        const count = window.innerWidth < 768 ? 25 : 55;
        for (let i = 0; i < count; i++) particles.push(new Particle());

        function drawConnections() {
            const rgb = getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-rgb').trim() || '0,240,255';

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx   = particles[i].x - particles[j].x;
                    const dy   = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${rgb}, ${0.04 * (1 - dist / 130)})`;
                        ctx.lineWidth   = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ==========================================
       4. THEME SWITCHER
       ========================================== */
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;

            if (theme === 'cyber') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', theme);
            }

            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showToast('Theme changed!', 'fas fa-palette');
        });
    });

    /* ==========================================
       5. NAVIGATION
       ========================================== */
    const navbar     = document.getElementById('navbar');
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('active');
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    if (hamburger) {
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
        });
    }

    /* ==========================================
       6. SCROLL EVENTS
       ========================================== */
    function onScroll() {
        const scrollY   = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress  = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

        if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);

        const progressBar = document.getElementById('pageProgress');
        if (progressBar) progressBar.style.width = progress + '%';

        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.classList.toggle('visible', scrollY > 500);
            const circle = document.getElementById('backToTopCircle');
            if (circle) {
                const circ   = 2 * Math.PI * 48;
                const offset = circ - (progress / 100) * circ;
                circle.style.strokeDasharray  = circ;
                circle.style.strokeDashoffset = offset;
            }
        }

        const floatingCV = document.getElementById('floatingCVBtn');
        if (floatingCV) floatingCV.classList.toggle('visible', scrollY > 600);

        const whatsappBtn = document.getElementById('whatsappBtn');
        if (whatsappBtn) whatsappBtn.classList.toggle('visible', scrollY > 300);

        updateActiveNavLink();
        updateSectionCounter();
        updateTimelineFill();
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 250) current = section.id;
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === current);
        });
    }

    function updateSectionCounter() {
        const counter  = document.querySelector('.counter-current');
        if (!counter) return;
        const sections = document.querySelectorAll('section[id]');
        let index = 1;
        sections.forEach((section, i) => {
            if (window.scrollY >= section.offsetTop - 300) index = i + 1;
        });
        counter.textContent = String(Math.min(index, sections.length)).padStart(2, '0');
    }

    function updateTimelineFill() {
        const fill    = document.getElementById('timelineFill');
        const section = document.querySelector('.experience');
        if (!fill || !section) return;

        const rect    = section.getBoundingClientRect();
        const height  = section.offsetHeight;
        const visible = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / height));
        fill.style.height = (visible * 100) + '%';

        document.querySelectorAll('.timeline-dot').forEach(dot => {
            const dotRect = dot.getBoundingClientRect();
            if (dotRect.top < window.innerHeight * 0.75) {
                dot.classList.add('active');
            }
        });
    }

    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================
       7. SMOOTH SCROLL
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href   = this.getAttribute('href');
            const target = href !== '#' ? document.querySelector(href) : null;
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ==========================================
       8. TYPING EFFECT
       ========================================== */
    const typingEl = document.getElementById('typingText');
    const phrases  = [
        'Bug-Free Applications',
        'Quality Software Products',
        'Reliable User Experiences',
        'Smooth App Performance',
        'Defect-Free Releases',
        'Production-Ready Solutions',
        'Flawless Mobile Apps',
        'Error-Free Web Products'
    ];
    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;

    function typeEffect() {
        if (!typingEl) return;
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 45 : 90;

        if (!isDeleting && charIndex === current.length) {
            delay      = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting  = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay       = 400;
        }
        setTimeout(typeEffect, delay);
    }
    typeEffect();

    /* ==========================================
       9. SCROLL REVEAL ANIMATIONS
       ========================================== */
    function initRevealAnimations() {
        const selectors = [
            '.reveal-up', '.reveal-left', '.reveal-right', '.reveal-text',
            '.section-title', '.hero-greeting', '.name-first', '.name-last',
            '.hero-title-wrapper', '.typing-wrapper', '.hero-buttons',
            '.hero-stats', '.about-image-wrapper', '.about-text-wrapper',
            '.contact-info', '.contact-form-wrapper', '.showreel-wrapper',
            '.skill-card', '.skill-tabs', '.timeline-item', '.portfolio-item',
            '.education-card', '.education-column'
        ];

        const elements = document.querySelectorAll(selectors.join(', '));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => entry.target.classList.add('visible'), delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        elements.forEach(el => observer.observe(el));

        /* Skill bars */
        const skillBarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.skill-bar-fill').forEach(fill => {
                        setTimeout(() => {
                            fill.style.width = (fill.dataset.width || 0) + '%';
                        }, 400);
                    });
                    skillBarObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const skillSection = document.querySelector('.skills');
        if (skillSection) skillBarObserver.observe(skillSection);
    }

    /* ==========================================
       10. COUNTER ANIMATION
       ========================================== */
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el     = entry.target;
                    const target = parseInt(el.dataset.count);
                    let current  = 0;
                    const step   = target / 70;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = Math.floor(current);
                    }, 25);

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    /* ==========================================
       11. PHILOSOPHY SLIDER
       ========================================== */
    const slides    = document.querySelectorAll('.philosophy-slide');
    const philoDots = document.querySelectorAll('.philosophy-dots .dot');
    let currentSlide = 0;
    let slideTimer;

    function goToSlide(index) {
        slides.forEach(s    => s.classList.remove('active'));
        philoDots.forEach(d => d.classList.remove('active'));
        if (slides[index])    slides[index].classList.add('active');
        if (philoDots[index]) philoDots[index].classList.add('active');
        currentSlide = index;
    }

    function startPhiloSlider() {
        slideTimer = setInterval(() => {
            goToSlide((currentSlide + 1) % slides.length);
        }, 5000);
    }

    philoDots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideTimer);
            goToSlide(parseInt(dot.dataset.slide));
            startPhiloSlider();
        });
    });

    if (slides.length > 0) startPhiloSlider();

    /* ==========================================
       12. CV MODAL
       ========================================== */
    const cvModal        = document.getElementById('cvModal');
    const cvModalClose   = document.getElementById('cvModalClose');
    const cvModalOverlay = document.getElementById('cvModalOverlay');
    const cvGenerating   = document.getElementById('cvGenerating');
    const cvSuccess      = document.getElementById('cvSuccess');

    const cvTriggerIds = [
        'navDownloadCV', 'heroDownloadCV', 'aboutDownloadCV',
        'mobileDownloadCV', 'footerDownloadCV', 'floatingCVBtn', 'contactDownloadCV'
    ];

    cvTriggerIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openCVModal();
            });
        }
    });

    function openCVModal() {
        if (!cvModal) return;
        if (cvGenerating) cvGenerating.classList.remove('active');
        if (cvSuccess)    cvSuccess.classList.remove('active');
        cvModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (hamburger)  hamburger.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
    }

    function closeCVModal() {
        if (!cvModal) return;
        cvModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cvModalClose)   cvModalClose.addEventListener('click', closeCVModal);
    if (cvModalOverlay) cvModalOverlay.addEventListener('click', closeCVModal);

    ['downloadPDF', 'downloadDOC'].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            if (btn.getAttribute('href') === '#') {
                e.preventDefault();
                if (cvGenerating) cvGenerating.classList.add('active');

                setTimeout(() => {
                    if (cvGenerating) cvGenerating.classList.remove('active');
                    if (cvSuccess)    cvSuccess.classList.add('active');
                    showToast('CV downloaded successfully!', 'fas fa-check-circle');

                    setTimeout(() => {
                        if (cvSuccess) cvSuccess.classList.remove('active');
                        closeCVModal();
                    }, 2000);
                }, 2000);
            }
        });
    });

    /* ==========================================
       13. PORTFOLIO FILTER
       ========================================== */
    const filterBtns     = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            portfolioItems.forEach(item => {
                const cat  = item.dataset.filter;
                const show = filter === 'all' || cat === filter;

                if (show) {
                    item.style.display   = '';
                    item.style.opacity   = '';
                    item.style.transform = '';
                    setTimeout(() => item.classList.add('visible'), 10);
                } else {
                    item.style.opacity   = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => { item.style.display = 'none'; }, 400);
                }
            });
        });
    });

    /* ==========================================
       14. SKILL CATEGORY TABS
       ========================================== */
    const skillTabs  = document.querySelectorAll('.skill-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;

            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            skillCards.forEach(card => {
                const cardCat = card.dataset.category;
                const show    = category === 'all' || cardCat === category;

                if (show) {
                    card.style.display   = '';
                    card.style.opacity   = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity   = '';
                        card.style.transform = '';
                        card.classList.add('visible');
                    }, 50);
                } else {
                    card.style.opacity   = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => { card.style.display = 'none'; }, 350);
                }
            });
        });
    });

    /* ==========================================
       15. LIGHTBOX
       ========================================== */
    const lightbox        = document.getElementById('lightbox');
    const lightboxImage   = document.getElementById('lightboxImage');
    const lightboxInfo    = document.getElementById('lightboxInfo');
    const lightboxOverlay = lightbox ? lightbox.querySelector('.lightbox-overlay') : null;
    const lightboxClose   = lightbox ? lightbox.querySelector('.lightbox-close')   : null;
    const lightboxPrev    = lightbox ? lightbox.querySelector('.lightbox-prev')    : null;
    const lightboxNext    = lightbox ? lightbox.querySelector('.lightbox-next')    : null;

    /* Build project data from DOM */
    const projectData = [];

    document.querySelectorAll('.portfolio-item').forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay-content');
        if (!overlay) return;

        const icon = item.querySelector('.portfolio-placeholder i');

        projectData.push({
            title    : overlay.querySelector('.portfolio-title')?.textContent    || '',
            desc     : overlay.querySelector('.portfolio-desc')?.textContent     || '',
            category : overlay.querySelector('.portfolio-category')?.textContent || '',
            icon     : icon ? icon.className : 'fas fa-bug',
            tags     : Array.from(item.querySelectorAll('.portfolio-tag')).map(t => t.textContent)
        });
    });

    let currentLightboxIndex = 0;

    function openLightbox(index) {
        if (!lightbox || projectData.length === 0) return;
        currentLightboxIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const data = projectData[currentLightboxIndex];
        if (!data) return;

        /* Update image placeholder */
        const placeholder = lightboxImage ? lightboxImage.querySelector('.lightbox-placeholder') : null;
        if (placeholder) {
            placeholder.innerHTML = `<i class="${data.icon}"></i><span>${data.category}</span>`;
        }

        /* Update info */
        if (lightboxInfo) {
            const tagsHTML = data.tags.map(t => `<span>${t}</span>`).join('');
            lightboxInfo.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.desc}</p>
                <div class="lightbox-tags">${tagsHTML}</div>
            `;
        }
    }

    /* View buttons */
    document.querySelectorAll('.portfolio-view-btn').forEach((btn, i) => {
        btn.addEventListener('click', () => openLightbox(i));
    });

    if (lightboxClose)   lightboxClose.addEventListener('click',   closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            currentLightboxIndex = (currentLightboxIndex - 1 + projectData.length) % projectData.length;
            updateLightboxContent();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentLightboxIndex = (currentLightboxIndex + 1) % projectData.length;
            updateLightboxContent();
        });
    }

    /* Keyboard navigation */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCVModal();
            closeLightbox();
        }
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft')  lightboxPrev && lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext && lightboxNext.click();
        }
    });

    /* Touch swipe for lightbox */
    let lbTouchStartX = 0;
    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            lbTouchStartX = e.touches[0].clientX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            const diff = lbTouchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) lightboxNext && lightboxNext.click();
                else          lightboxPrev && lightboxPrev.click();
            }
        }, { passive: true });
    }

    /* ==========================================
       16. MAGNETIC BUTTONS (Desktop only)
       ========================================== */
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x    = e.clientX - rect.left - rect.width  / 2;
                const y    = e.clientY - rect.top  - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* ==========================================
       17. TILT CARDS (Desktop only)
       ========================================== */
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect   = card.getBoundingClientRect();
                const x      = (e.clientX - rect.left) / rect.width;
                const y      = (e.clientY - rect.top)  / rect.height;
                const rotX   = (0.5 - y) * 12;
                const rotY   = (x - 0.5) * 12;
                card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ==========================================
       18. MUSIC PLAYER TOGGLE
       ========================================== */
    const musicPlayer = document.getElementById('musicPlayer');
    let isMusicPlaying = false;

    if (musicPlayer) {
        musicPlayer.addEventListener('click', () => {
            isMusicPlaying = !isMusicPlaying;
            musicPlayer.classList.toggle('playing', isMusicPlaying);
            showToast(
                isMusicPlaying ? 'Ambient sound enabled' : 'Sound disabled',
                isMusicPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute'
            );
        });
    }

    /* ==========================================
       19. TOAST NOTIFICATION
       ========================================== */
    function showToast(message, iconClass) {
        const toast   = document.getElementById('toast');
        const msgEl   = document.getElementById('toastMessage');
        const iconEl  = toast ? toast.querySelector('.toast-icon') : null;

        if (!toast || !msgEl) return;

        msgEl.textContent = message;

        if (iconEl && iconClass) {
            iconEl.innerHTML = `<i class="${iconClass}"></i>`;
        }

        /* Remove old progress if any */
        const oldProgress = toast.querySelector('.toast-progress');
        if (oldProgress) {
            oldProgress.remove();
        }

        /* Add fresh progress bar */
        const progress = document.createElement('div');
        progress.classList.add('toast-progress');
        toast.appendChild(progress);

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    /* ==========================================
       20. CONTACT FORM
       ========================================== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = contactForm.querySelector('#name')?.value.trim();
            const email   = contactForm.querySelector('#email')?.value.trim();
            const message = contactForm.querySelector('#message')?.value.trim();

            if (!name || !email || !message) {
                showToast('Please fill all required fields.', 'fas fa-exclamation-circle');
                return;
            }

            /* Simulate sending */
            const submitBtn = contactForm.querySelector('.btn-submit');
            if (submitBtn) {
                const originalText = submitBtn.querySelector('.btn-text')?.textContent;
                const btnText      = submitBtn.querySelector('.btn-text');
                if (btnText) btnText.textContent = 'SENDING...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    showToast('Message sent! I\'ll reply within 24 hours.', 'fas fa-paper-plane');
                    contactForm.reset();
                    if (btnText)    btnText.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                showToast('Message sent! I\'ll reply within 24 hours.', 'fas fa-paper-plane');
                contactForm.reset();
            }
        });
    }

    /* ==========================================
       21. INITIAL SCROLL TRIGGER
       ========================================== */
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 150);

}); /* END DOMContentLoaded */

    /* ==========================================
       22. GOOGLE ANALYTICS EVENT TRACKING
       ========================================== */
    function trackEvent(category, action, label) {
        if (typeof gtag === 'function') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    /* Track section views */
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackEvent('Section', 'view', entry.target.id);
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        sectionObserver.observe(section);
    });

    /* Track button clicks */
    document.querySelectorAll('.btn, .nav-link, .mobile-link, .social-icon, .footer-socials a').forEach(btn => {
        btn.addEventListener('click', () => {
            const label = btn.textContent.trim() || btn.getAttribute('aria-label') || 'unknown';
            trackEvent('Click', 'button_click', label);
        });
    });

    /* ==========================================
       23. REAL CV DOWNLOAD WITH TRACKING
       ========================================== */
    const pdfBtn = document.getElementById('downloadPDF');

    if (pdfBtn) {
        /* Remove any old listeners */
        const newPdfBtn = pdfBtn.cloneNode(true);
        pdfBtn.parentNode.replaceChild(newPdfBtn, pdfBtn);

        newPdfBtn.addEventListener('click', (e) => {
            const href = newPdfBtn.getAttribute('href');
            const hasRealFile = href && href !== '#' && !href.startsWith('javascript');

            if (hasRealFile) {
                /* ✅ Real PDF file exists — let browser download */
                trackEvent('CV', 'download', 'PDF');

                /* Save download count */
                const count = parseInt(localStorage.getItem('sb_cv_downloads') || '0') + 1;
                localStorage.setItem('sb_cv_downloads', count);

                /* Show success animation */
                setTimeout(() => {
                    if (cvSuccess) cvSuccess.classList.add('active');
                    showToast('CV downloaded successfully!', 'fas fa-download');

                    setTimeout(() => {
                        if (cvSuccess) cvSuccess.classList.remove('active');
                        closeCVModal();
                    }, 2000);
                }, 500);

            } else {
                /* ❌ No file yet — show simulation */
                e.preventDefault();

                if (cvGenerating) cvGenerating.classList.add('active');

                setTimeout(() => {
                    if (cvGenerating) cvGenerating.classList.remove('active');
                    if (cvSuccess)    cvSuccess.classList.add('active');

                    showToast('CV file not uploaded yet. Add your PDF to assets/ folder.', 'fas fa-exclamation-circle');

                    setTimeout(() => {
                        if (cvSuccess) cvSuccess.classList.remove('active');
                        closeCVModal();
                    }, 2500);
                }, 2000);
            }
        });
    }

    /* Remove DOC button handler since we removed it */
    const docBtn = document.getElementById('downloadDOC');
    if (docBtn) docBtn.remove();

    /* ==========================================
       24. EMAILJS CONTACT FORM
       ========================================== */
    /*
     * To enable EmailJS:
     * 1. Go to https://www.emailjs.com/ and create free account
     * 2. Create an Email Service (Gmail/Outlook)
     * 3. Create an Email Template with variables: {{name}}, {{email}}, {{subject}}, {{message}}
     * 4. Replace the IDs below with your own
     */

    const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';      // Replace with your key
    const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';      // Replace with your service ID
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';     // Replace with your template ID

    /* Initialize EmailJS */
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    /* Override contact form submit */
    const contactFormEl = document.getElementById('contactForm');
    const formStatus    = document.getElementById('formStatus');
    const submitBtnEl   = document.getElementById('submitBtn');

    if (contactFormEl) {
        contactFormEl.removeEventListener('submit', contactFormEl._handler);

        contactFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameVal    = contactFormEl.querySelector('#name')?.value.trim();
            const emailVal   = contactFormEl.querySelector('#email')?.value.trim();
            const subjectVal = contactFormEl.querySelector('#subject')?.value.trim();
            const messageVal = contactFormEl.querySelector('#message')?.value.trim();

            /* Validation */
            if (!nameVal || !emailVal || !messageVal) {
                showFormStatus('Please fill all required fields.', 'error');
                showToast('Please fill all required fields.', 'fas fa-exclamation-circle');
                return;
            }

            /* Email validation */
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                showFormStatus('Please enter a valid email address.', 'error');
                return;
            }

            /* Show sending state */
            const btnText = submitBtnEl?.querySelector('.btn-text');
            const btnIcon = submitBtnEl?.querySelector('.btn-icon');
            if (btnText) btnText.textContent = 'SENDING...';
            if (btnIcon) btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            if (submitBtnEl) submitBtnEl.disabled = true;

            showFormStatus('Sending your message...', 'sending');

            try {
                /* Check if EmailJS is configured */
                if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                        name:    nameVal,
                        email:   emailVal,
                        subject: subjectVal || 'Portfolio Contact',
                        message: messageVal
                    });
                } else {
                    /* Simulate sending if EmailJS not configured */
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }

                showFormStatus('Message sent successfully! I\'ll reply within 24 hours.', 'success');
                showToast('Message sent! I\'ll reply within 24 hours.', 'fas fa-paper-plane');
                contactFormEl.reset();
                trackEvent('Contact', 'form_submit', 'success');

            } catch (error) {
                console.error('EmailJS Error:', error);
                showFormStatus('Failed to send. Please try email directly.', 'error');
                showToast('Failed to send. Please try email directly.', 'fas fa-exclamation-triangle');
                trackEvent('Contact', 'form_submit', 'error');
            }

            /* Reset button */
            if (btnText) btnText.textContent = 'SEND MESSAGE';
            if (btnIcon) btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
            if (submitBtnEl) submitBtnEl.disabled = false;
        });
    }

    function showFormStatus(message, type) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className   = 'form-status';
        formStatus.classList.add('form-status-' + type, 'visible');

        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                formStatus.classList.remove('visible');
            }, 5000);
        }
    }

    /* ==========================================
       25. KEYBOARD SHORTCUTS
       ========================================== */
    const shortcutsModal = document.getElementById('shortcutsModal');
    const shortcutsClose = document.getElementById('shortcutsClose');
    const keyboardHint   = document.getElementById('keyboardHint');

    function scrollToSection(id) {
        const el = document.querySelector(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    document.addEventListener('keydown', (e) => {
        /* Don't trigger when typing in inputs */
        const tag = document.activeElement?.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

        /* Don't trigger with Ctrl/Alt/Meta */
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        switch (e.key.toLowerCase()) {
            case '?':
                e.preventDefault();
                if (shortcutsModal) shortcutsModal.classList.toggle('active');
                break;
            case 'h':
                scrollToSection('#home');
                break;
            case 'a':
                scrollToSection('#about');
                break;
            case 'e':
                scrollToSection('#experience');
                break;
            case 's':
                scrollToSection('#skills');
                break;
            case 'p':
                scrollToSection('#projects');
                break;
            case 'c':
                scrollToSection('#contact');
                break;
            case 'd':
                openCVModal();
                trackEvent('Shortcut', 'keyboard', 'download_cv');
                break;
            case 't':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'w':
                const waBtn = document.getElementById('whatsappBtn');
                if (waBtn) waBtn.click();
                break;
            case '1':
                document.querySelector('[data-theme="cyber"]')?.click();
                break;
            case '2':
                document.querySelector('[data-theme="neon"]')?.click();
                break;
            case '3':
                document.querySelector('[data-theme="matrix"]')?.click();
                break;
            case '4':
                document.querySelector('[data-theme="gold"]')?.click();
                break;
            case 'escape':
                if (shortcutsModal) shortcutsModal.classList.remove('active');
                closeCVModal();
                closeLightbox();
                break;
        }
    });

    if (shortcutsClose) {
        shortcutsClose.addEventListener('click', () => {
            shortcutsModal.classList.remove('active');
        });
    }

    if (shortcutsModal) {
        shortcutsModal.querySelector('.shortcuts-overlay')?.addEventListener('click', () => {
            shortcutsModal.classList.remove('active');
        });
    }

    /* Hide keyboard hint after 5 seconds */
    if (keyboardHint) {
        setTimeout(() => {
            keyboardHint.classList.add('visible');
            setTimeout(() => {
                keyboardHint.classList.remove('visible');
            }, 5000);
        }, 3000);
    }

    /* ==========================================
       26. VISITOR COUNTER (localStorage based)
       ========================================== */
    function initVisitorCounter() {
        const counterEl = document.getElementById('visitorCount');
        if (!counterEl) return;

        let visits = parseInt(localStorage.getItem('sb_visit_count') || '0');

        /* Check if this is a new session */
        if (!sessionStorage.getItem('sb_session_active')) {
            visits++;
            localStorage.setItem('sb_visit_count', visits);
            sessionStorage.setItem('sb_session_active', 'true');
        }

        counterEl.textContent = visits;

        /* Show counter after scroll */
        const visitorEl = document.getElementById('visitorCounter');
        if (visitorEl) {
            window.addEventListener('scroll', () => {
                visitorEl.classList.toggle('visible', window.scrollY > 200);
            }, { passive: true });
        }
    }
    initVisitorCounter();

    /* ==========================================
       27. PAGE LOAD SPEED
       ========================================== */
    function showLoadSpeed() {
        const loadSpeedEl    = document.getElementById('loadSpeed');
        const loadSpeedValue = document.getElementById('loadSpeedValue');

        if (!loadSpeedEl || !loadSpeedValue) return;

        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                const loadTime = ((perfData.loadEventEnd - perfData.startTime) / 1000).toFixed(1);
                loadSpeedValue.textContent = loadTime + 's';

                setTimeout(() => {
                    loadSpeedEl.classList.add('visible');
                    setTimeout(() => {
                        loadSpeedEl.classList.remove('visible');
                    }, 4000);
                }, 2000);
            }
        });
    }
    showLoadSpeed();

    /* ==========================================
       28. EASTER EGG (Konami Code)
       ========================================== */
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                const easterEgg = document.getElementById('easterEgg');
                if (easterEgg) {
                    easterEgg.classList.add('active');
                    trackEvent('Easter Egg', 'triggered', 'konami_code');
                }
            }
        } else {
            konamiIndex = 0;
        }
    });

    const easterEggClose = document.getElementById('easterEggClose');
    if (easterEggClose) {
        easterEggClose.addEventListener('click', () => {
            document.getElementById('easterEgg')?.classList.remove('active');
        });
    }

    /* ==========================================
       29. AUTO GREETING BASED ON TIME
       ========================================== */
    function updateGreeting() {
        const greetingEl = document.querySelector('.greeting-text');
        if (!greetingEl) return;

        const hour = new Date().getHours();
        let greeting = 'HELLO, I AM';

        if (hour >= 5 && hour < 12)       greeting = 'GOOD MORNING, I AM';
        else if (hour >= 12 && hour < 17)  greeting = 'GOOD AFTERNOON, I AM';
        else if (hour >= 17 && hour < 21)  greeting = 'GOOD EVENING, I AM';
        else                               greeting = 'HELLO NIGHT OWL, I AM';

        greetingEl.textContent = greeting;
    }
    updateGreeting();

    /* ==========================================
       30. TRACK TIME ON PAGE
       ========================================== */
    let pageStartTime = Date.now();

    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
        trackEvent('Engagement', 'time_on_page', timeSpent + ' seconds');
    });