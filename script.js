/* ==========================================
   SCRIPT.JS — SANKET BRAHMBHATT PORTFOLIO
   QA Manual Tester Portfolio
   ========================================== */

(function () {
    'use strict';

    /* ==========================================
       UTILITY: Google Analytics Event Tracking
       ========================================== */
    function trackEvent(category, action, label) {
        if (typeof gtag === 'function') {
            gtag('event', action, {
                event_category: category,
                event_label: String(label)
            });
        }
    }

    /* ==========================================
       UTILITY: Toast Notification
       ========================================== */
    function showToast(message, iconClass) {
        const toast = document.getElementById('toast');
        const msgEl = document.getElementById('toastMessage');
        const iconEl = toast ? toast.querySelector('.toast-icon') : null;

        if (!toast || !msgEl) return;

        msgEl.textContent = message;
        if (iconEl && iconClass) {
            iconEl.innerHTML = '<i class="' + iconClass + '"></i>';
        }

        const oldProgress = toast.querySelector('.toast-progress');
        if (oldProgress) oldProgress.remove();

        const progress = document.createElement('div');
        progress.classList.add('toast-progress');
        toast.appendChild(progress);

        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    /* ==========================================
       UTILITY: Scroll to Section
       ========================================== */
    function scrollToSection(id) {
        const el = document.querySelector(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    /* ==========================================
       UTILITY: Confetti Effect
       ========================================== */
    function launchConfetti() {
        const confettiCanvas = document.getElementById('confettiCanvas');
        if (!confettiCanvas) return;

        const ctx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#00f0ff', '#7b2ff7', '#ff2d75', '#ffd700', '#00ff41'];

        for (let i = 0; i < 150; i++) {
            pieces.push({
                x: Math.random() * confettiCanvas.width,
                y: -20 - Math.random() * 200,
                w: Math.random() * 8 + 4,
                h: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 3,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                opacity: 1
            });
        }

        let frame = 0;
        const maxFrames = 180;

        function animate() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            pieces.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotSpeed;
                p.speedY += 0.05;
                if (frame > maxFrames - 60) p.opacity -= 0.02;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            frame++;
            if (frame < maxFrames) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            }
        }
        animate();
    }

    /* ==========================================
       MAIN: DOMContentLoaded
       ========================================== */
    document.addEventListener('DOMContentLoaded', () => {

        /* ==========================================
           1. LOADER
           ========================================== */
        const loader = document.getElementById('loader');
        const loaderBar = document.getElementById('loaderBar');
        const loaderPercent = document.getElementById('loaderPercent');
        let loadProgress = 0;

        document.body.style.overflow = 'hidden';

        const loaderInterval = setInterval(() => {
            loadProgress += Math.random() * 12 + 3;

            if (loadProgress >= 100) {
                loadProgress = 100;
                clearInterval(loaderInterval);
                setTimeout(() => {
                    if (loader) loader.classList.add('hidden');
                    document.body.style.overflow = '';
                    initRevealAnimations();
                    animateCounters();
                }, 600);
            }

            if (loaderBar) loaderBar.style.width = loadProgress + '%';
            if (loaderPercent) loaderPercent.textContent = Math.floor(loadProgress) + '%';
        }, 120);

        /* ==========================================
           2. CUSTOM CURSOR (Desktop only)
           ========================================== */
        const cursor = document.getElementById('cursor');
        const follower = document.getElementById('cursorFollower');
        const cursorText = document.getElementById('cursorText');
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        if (window.matchMedia('(pointer: fine)').matches && cursor && follower) {
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                cursor.style.transform = 'translate(' + (mouseX - 4) + 'px, ' + (mouseY - 4) + 'px)';
                if (cursorText) {
                    cursorText.style.left = mouseX + 'px';
                    cursorText.style.top = mouseY + 'px';
                }
            });

            (function animateFollower() {
                followerX += (mouseX - followerX) * 0.1;
                followerY += (mouseY - followerY) * 0.1;
                follower.style.transform = 'translate(' + (followerX - 17) + 'px, ' + (followerY - 17) + 'px)';
                requestAnimationFrame(animateFollower);
            })();

            document.addEventListener('mousedown', () => cursor.classList.add('click'));
            document.addEventListener('mouseup', () => cursor.classList.remove('click'));

            document.querySelectorAll(
                'a, button, .btn, .skill-card, .portfolio-card, .filter-btn, .skill-tab, .contact-card, .education-card, .timeline-card'
            ).forEach(el => {
                el.addEventListener('mouseenter', () => follower.classList.add('hover'));
                el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
            });

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
            let cachedRGB = '0, 240, 255';

            function updateCachedRGB() {
                cachedRGB = getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-rgb').trim() || '0, 240, 255';
            }
            updateCachedRGB();

            function resizeCanvas() {
                canvas.width = window.innerWidth;
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
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 1.5 + 0.5;
                    this.speedX = (Math.random() - 0.5) * 0.4;
                    this.speedY = (Math.random() - 0.5) * 0.4;
                    this.opacity = Math.random() * 0.4 + 0.1;
                }
                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if (this.x < 0 || this.x > canvas.width ||
                        this.y < 0 || this.y > canvas.height) {
                        this.reset();
                    }
                }
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(' + cachedRGB + ', ' + this.opacity + ')';
                    ctx.fill();
                }
            }

            const count = window.innerWidth < 768 ? 25 : 55;
            for (let i = 0; i < count; i++) particles.push(new Particle());

            function drawConnections() {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 130) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = 'rgba(' + cachedRGB + ', ' + (0.04 * (1 - dist / 130)) + ')';
                            ctx.lineWidth = 0.5;
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

            window._updateParticleRGB = updateCachedRGB;
        }

        /* ==========================================
           4. THEME SWITCHER
           ========================================== */
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);

                document.querySelectorAll('.theme-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-checked', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');

                if (typeof window._updateParticleRGB === 'function') {
                    setTimeout(window._updateParticleRGB, 50);
                }

                showToast('Theme changed!', 'fas fa-palette');
                trackEvent('Theme', 'change', theme);
            });
        });

        /* ==========================================
           5. NAVIGATION
           ========================================== */
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');

        function toggleMobileMenu() {
            if (!hamburger || !mobileMenu) return;
            const isOpen = mobileMenu.classList.contains('active');
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(!isOpen));
            mobileMenu.setAttribute('aria-hidden', String(isOpen));
            document.body.style.overflow = isOpen ? '' : 'hidden';
        }

        function closeMobileMenu() {
            if (!hamburger || !mobileMenu) return;
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
            hamburger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMobileMenu();
                }
            });
        }

        if (mobileMenu) {
            mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }

        /* ==========================================
           6. SCROLL EVENTS (batched)
           ========================================== */
        let scrollTicking = false;

        function onScroll() {
            if (scrollTicking) return;
            scrollTicking = true;

            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

                if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);

                const progressBar = document.getElementById('pageProgress');
                if (progressBar) progressBar.style.width = progress + '%';

                const backToTop = document.getElementById('backToTop');
                if (backToTop) {
                    backToTop.classList.toggle('visible', scrollY > 500);
                    const circle = document.getElementById('backToTopCircle');
                    if (circle) {
                        const circ = 2 * Math.PI * 48;
                        const offset = circ - (progress / 100) * circ;
                        circle.style.strokeDasharray = circ;
                        circle.style.strokeDashoffset = offset;
                    }
                }

                const floatingCV = document.getElementById('floatingCVBtn');
                if (floatingCV) floatingCV.classList.toggle('visible', scrollY > 600);

                const whatsappBtn = document.getElementById('whatsappBtn');
                if (whatsappBtn) whatsappBtn.classList.toggle('visible', scrollY > 300);

                const bugGameTrigger = document.getElementById('bugGameTrigger');
                if (bugGameTrigger) bugGameTrigger.classList.toggle('visible', scrollY > 800);

                const shareWidget = document.getElementById('shareWidget');
                if (shareWidget) {
                    const visible = scrollY > 400;
                    shareWidget.style.opacity = visible ? '1' : '0';
                    shareWidget.style.visibility = visible ? 'visible' : 'hidden';
                }

                const visitorEl = document.getElementById('visitorCounter');
                if (visitorEl) visitorEl.classList.toggle('visible', scrollY > 200);

                const clickToCall = document.getElementById('clickToCall');
                if (clickToCall && clickToCall.style.display === 'flex') {
                    const callVisible = scrollY > 400;
                    clickToCall.style.opacity = callVisible ? '1' : '0';
                    clickToCall.style.visibility = callVisible ? 'visible' : 'hidden';
                }

                updateActiveNavLink();
                updateSectionCounter();
                updateTimelineFill();

                scrollTicking = false;
            });
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
            const counter = document.querySelector('.counter-current');
            if (!counter) return;
            const sections = document.querySelectorAll('section[id]');
            let index = 1;
            sections.forEach((section, i) => {
                if (window.scrollY >= section.offsetTop - 300) index = i + 1;
            });
            counter.textContent = String(Math.min(index, sections.length)).padStart(2, '0');
        }

        function updateTimelineFill() {
            const fill = document.getElementById('timelineFill');
            const section = document.querySelector('.experience');
            if (!fill || !section) return;

            const rect = section.getBoundingClientRect();
            const height = section.offsetHeight;
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
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
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
        const phrases = [
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
        let charIndex = 0;
        let isDeleting = false;

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
                delay = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 400;
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
                '.contact-info', '.contact-form-wrapper',
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
                        const el = entry.target;
                        const target = parseInt(el.dataset.count);
                        if (isNaN(target)) return;

                        let current = 0;
                        const step = target / 70;

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
        const slides = document.querySelectorAll('.philosophy-slide');
        const philoDots = document.querySelectorAll('.philosophy-dots .dot');
        let currentSlide = 0;
        let slideTimer;

        function goToSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            philoDots.forEach(d => {
                d.classList.remove('active');
                d.setAttribute('aria-selected', 'false');
            });
            if (slides[index]) slides[index].classList.add('active');
            if (philoDots[index]) {
                philoDots[index].classList.add('active');
                philoDots[index].setAttribute('aria-selected', 'true');
            }
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
        const cvModal = document.getElementById('cvModal');
        const cvModalClose = document.getElementById('cvModalClose');
        const cvModalOverlay = document.getElementById('cvModalOverlay');
        const cvGenerating = document.getElementById('cvGenerating');
        const cvSuccess = document.getElementById('cvSuccess');

        function openCVModal() {
            if (!cvModal) return;
            if (cvGenerating) cvGenerating.classList.remove('active');
            if (cvSuccess) cvSuccess.classList.remove('active');
            cvModal.classList.add('active');
            cvModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            closeMobileMenu();
        }

        function closeCVModal() {
            if (!cvModal) return;
            cvModal.classList.remove('active');
            cvModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

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

        if (cvModalClose) cvModalClose.addEventListener('click', closeCVModal);
        if (cvModalOverlay) cvModalOverlay.addEventListener('click', closeCVModal);

        const downloadPDFBtn = document.getElementById('downloadPDF');
        if (downloadPDFBtn) {
            downloadPDFBtn.addEventListener('click', (e) => {
                const href = downloadPDFBtn.getAttribute('href');
                const hasRealFile = href && href !== '#' && !href.startsWith('javascript');

                if (hasRealFile) {
                    trackEvent('CV', 'download', 'PDF');
                    const count = parseInt(localStorage.getItem('sb_cv_downloads') || '0') + 1;
                    localStorage.setItem('sb_cv_downloads', count);

                    setTimeout(() => {
                        if (cvSuccess) cvSuccess.classList.add('active');
                        showToast('CV downloaded successfully!', 'fas fa-download');
                        setTimeout(() => {
                            if (cvSuccess) cvSuccess.classList.remove('active');
                            closeCVModal();
                        }, 2000);
                    }, 500);
                } else {
                    e.preventDefault();
                    if (cvGenerating) cvGenerating.classList.add('active');
                    setTimeout(() => {
                        if (cvGenerating) cvGenerating.classList.remove('active');
                        if (cvSuccess) cvSuccess.classList.add('active');
                        showToast('CV file not uploaded yet. Add your PDF to assets/ folder.', 'fas fa-exclamation-circle');
                        setTimeout(() => {
                            if (cvSuccess) cvSuccess.classList.remove('active');
                            closeCVModal();
                        }, 2500);
                    }, 2000);
                }
            });
        }

        /* ==========================================
           13. PORTFOLIO FILTER
           ========================================== */
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                portfolioItems.forEach(item => {
                    const cat = item.dataset.filter;
                    const show = filter === 'all' || cat === filter;

                    if (show) {
                        item.style.display = '';
                        requestAnimationFrame(() => {
                            item.style.opacity = '';
                            item.style.transform = '';
                            item.classList.add('visible');
                        });
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => { item.style.display = 'none'; }, 400);
                    }
                });
            });
        });

        /* ==========================================
           14. SKILL CATEGORY TABS
           ========================================== */
        const skillTabs = document.querySelectorAll('.skill-tab');
        const skillCards = document.querySelectorAll('.skill-card');

        skillTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;

                skillTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');

                skillCards.forEach(card => {
                    const cardCat = card.dataset.category;
                    const show = category === 'all' || cardCat === category;

                    if (show) {
                        card.style.display = '';
                        requestAnimationFrame(() => {
                            card.style.opacity = '';
                            card.style.transform = '';
                            card.classList.add('visible');
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => { card.style.display = 'none'; }, 350);
                    }
                });
            });
        });

        /* ==========================================
           15. LIGHTBOX
           ========================================== */
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxInfo = document.getElementById('lightboxInfo');
        const lightboxOverlay = lightbox ? lightbox.querySelector('.lightbox-overlay') : null;
        const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
        const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
        const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;

        const projectData = [];
        document.querySelectorAll('.portfolio-item').forEach(item => {
            const overlay = item.querySelector('.portfolio-overlay-content');
            if (!overlay) return;
            const icon = item.querySelector('.portfolio-placeholder i');
            projectData.push({
                title: overlay.querySelector('.portfolio-title')?.textContent || '',
                desc: overlay.querySelector('.portfolio-desc')?.textContent || '',
                category: overlay.querySelector('.portfolio-category')?.textContent || '',
                icon: icon ? icon.className : 'fas fa-bug',
                tags: Array.from(item.querySelectorAll('.portfolio-tag')).map(t => t.textContent)
            });
        });

        let currentLightboxIndex = 0;

        function openLightbox(index) {
            if (!lightbox || projectData.length === 0) return;
            currentLightboxIndex = index;
            updateLightboxContent();
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            if (!lightbox) return;
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function updateLightboxContent() {
            const data = projectData[currentLightboxIndex];
            if (!data) return;

            const placeholder = lightboxImage ? lightboxImage.querySelector('.lightbox-placeholder') : null;
            if (placeholder) {
                placeholder.innerHTML = '<i class="' + data.icon + '"></i><span>' + data.category + '</span>';
            }

            if (lightboxInfo) {
                const tagsHTML = data.tags.map(t => '<span>' + t + '</span>').join('');
                lightboxInfo.innerHTML =
                    '<h3>' + data.title + '</h3>' +
                    '<p>' + data.desc + '</p>' +
                    '<div class="lightbox-tags">' + tagsHTML + '</div>';
            }
        }

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
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

        let lbTouchStartX = 0;
        if (lightbox) {
            lightbox.addEventListener('touchstart', (e) => {
                lbTouchStartX = e.touches[0].clientX;
            }, { passive: true });
            lightbox.addEventListener('touchend', (e) => {
                const diff = lbTouchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) lightboxNext?.click();
                    else lightboxPrev?.click();
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
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
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
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    const rotX = (0.5 - y) * 12;
                    const rotY = (x - 0.5) * 12;
                    card.style.transform = 'perspective(1000px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.02)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });
        }

        /* ==========================================
           18. CONTACT FORM
           ========================================== */
        const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
        const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
        const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }

        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');

        function showFormStatus(message, type) {
            if (!formStatus) return;
            formStatus.textContent = message;
            formStatus.className = 'form-status form-status-' + type + ' visible';
            if (type === 'success') launchConfetti();
            if (type === 'success' || type === 'error') {
                setTimeout(() => formStatus.classList.remove('visible'), 5000);
            }
        }

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const nameVal = contactForm.querySelector('#name')?.value.trim();
                const emailVal = contactForm.querySelector('#email')?.value.trim();
                const subjectVal = contactForm.querySelector('#subject')?.value.trim();
                const messageVal = contactForm.querySelector('#message')?.value.trim();

                if (!nameVal || !emailVal || !messageVal) {
                    showFormStatus('Please fill all required fields.', 'error');
                    showToast('Please fill all required fields.', 'fas fa-exclamation-circle');
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailVal)) {
                    showFormStatus('Please enter a valid email address.', 'error');
                    return;
                }

                const btnText = submitBtn?.querySelector('.btn-text');
                const btnIcon = submitBtn?.querySelector('.btn-icon');
                if (btnText) btnText.textContent = 'SENDING...';
                if (btnIcon) btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                if (submitBtn) submitBtn.disabled = true;

                showFormStatus('Sending your message...', 'sending');

                try {
                    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                            name: nameVal,
                            email: emailVal,
                            subject: subjectVal || 'Portfolio Contact',
                            message: messageVal
                        });
                    } else {
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    }

                    showFormStatus('Message sent successfully! I\'ll reply within 24 hours.', 'success');
                    showToast('Message sent! I\'ll reply within 24 hours.', 'fas fa-paper-plane');
                    contactForm.reset();
                    clearFormDraft();
                    trackEvent('Contact', 'form_submit', 'success');
                } catch (error) {
                    console.error('EmailJS Error:', error);
                    showFormStatus('Failed to send. Please try email directly.', 'error');
                    showToast('Failed to send. Please try email directly.', 'fas fa-exclamation-triangle');
                    trackEvent('Contact', 'form_submit', 'error');
                }

                if (btnText) btnText.textContent = 'SEND MESSAGE';
                if (btnIcon) btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
                if (submitBtn) submitBtn.disabled = false;
            });
        }

        /* ==========================================
           19. AUTO-SAVE FORM DRAFT
           ========================================== */
        const formFields = ['name', 'email', 'subject', 'message'];
        let autoSaveTimer;

        function loadFormDraft() {
            formFields.forEach(field => {
                const el = document.getElementById(field);
                const saved = localStorage.getItem('sb_form_' + field);
                if (el && saved) {
                    el.value = saved;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        }

        function saveFormDraft() {
            formFields.forEach(field => {
                const el = document.getElementById(field);
                if (el && el.value.trim()) {
                    localStorage.setItem('sb_form_' + field, el.value);
                }
            });
        }

        function clearFormDraft() {
            formFields.forEach(field => localStorage.removeItem('sb_form_' + field));
        }

        loadFormDraft();

        formFields.forEach(field => {
            const el = document.getElementById(field);
            if (el) {
                el.addEventListener('input', () => {
                    clearTimeout(autoSaveTimer);
                    autoSaveTimer = setTimeout(() => {
                        saveFormDraft();
                        showAutoSaveIndicator();
                    }, 1000);
                });
            }
        });

        function showAutoSaveIndicator() {
            let indicator = document.querySelector('.form-autosave');
            if (!indicator && contactForm) {
                indicator = document.createElement('div');
                indicator.classList.add('form-autosave');
                indicator.innerHTML = '<i class="fas fa-save"></i> <span>Draft auto-saved</span>';
                const btn = contactForm.querySelector('.btn-submit');
                if (btn) contactForm.insertBefore(indicator, btn);
            }
            if (indicator) {
                indicator.classList.add('visible', 'saved');
                setTimeout(() => indicator.classList.remove('visible'), 2000);
            }
        }

        /* ==========================================
           20. TESTIMONIALS SLIDER
           ========================================== */
        const testimonialTrack = document.getElementById('testimonialTrack');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const testimonialDotsContainer = document.getElementById('testimonialDots');
        const tPrevBtn = document.querySelector('.testimonial-prev');
        const tNextBtn = document.querySelector('.testimonial-next');
        let currentTestimonial = 0;
        let testimonialTimer;

        if (testimonialDotsContainer && testimonialCards.length > 0) {
            testimonialCards.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('t-dot');
                if (i === 0) dot.classList.add('active');
                dot.dataset.index = i;
                dot.setAttribute('aria-label', 'Show review ' + (i + 1));
                dot.addEventListener('click', () => {
                    goToTestimonial(i);
                    resetTestimonialTimer();
                });
                testimonialDotsContainer.appendChild(dot);
            });
        }

        function goToTestimonial(index) {
            if (!testimonialTrack) return;
            currentTestimonial = index;
            testimonialTrack.style.transform = 'translateX(-' + (index * 100) + '%)';
            document.querySelectorAll('.t-dot').forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        }

        function nextTestimonial() {
            goToTestimonial((currentTestimonial + 1) % testimonialCards.length);
        }

        function prevTestimonial() {
            goToTestimonial((currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length);
        }

        function resetTestimonialTimer() {
            clearInterval(testimonialTimer);
            testimonialTimer = setInterval(nextTestimonial, 6000);
        }

        if (tPrevBtn) tPrevBtn.addEventListener('click', () => { prevTestimonial(); resetTestimonialTimer(); });
        if (tNextBtn) tNextBtn.addEventListener('click', () => { nextTestimonial(); resetTestimonialTimer(); });
        if (testimonialCards.length > 0) testimonialTimer = setInterval(nextTestimonial, 6000);

        let tTouchStartX = 0;
        if (testimonialTrack) {
            testimonialTrack.addEventListener('touchstart', e => {
                tTouchStartX = e.touches[0].clientX;
            }, { passive: true });
            testimonialTrack.addEventListener('touchend', e => {
                const diff = tTouchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? nextTestimonial() : prevTestimonial();
                    resetTestimonialTimer();
                }
            }, { passive: true });
        }

        /* ==========================================
           21. LEARNING PROGRESS RINGS
           ========================================== */
        const learningObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.learning-ring-fill').forEach(ring => {
                        const progress = parseInt(ring.dataset.progress) || 0;
                        const circumference = 2 * Math.PI * 45;
                        const offset = circumference - (progress / 100) * circumference;
                        setTimeout(() => { ring.style.strokeDashoffset = offset; }, 300);
                    });
                    learningObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const learningSection = document.querySelector('.learning');
        if (learningSection) learningObserver.observe(learningSection);

        /* ==========================================
           22. FUN FACTS COUNTER ANIMATION
           ========================================== */
        const funFactsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.fun-fact-number').forEach(el => {
                        const target = parseInt(el.dataset.count);
                        if (isNaN(target)) return;
                        let current = 0;
                        const step = target / 80;
                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) { current = target; clearInterval(timer); }
                            el.textContent = Math.floor(current);
                        }, 20);
                    });
                    funFactsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const funFactsEl = document.querySelector('.fun-facts');
        if (funFactsEl) funFactsObserver.observe(funFactsEl);

        /* ==========================================
           23. PROJECT DETAIL MODAL
           ========================================== */
        const projectDetailModal = document.getElementById('projectDetailModal');
        const projectDetailClose = document.getElementById('projectDetailClose');
        const projectDetailOverlay = document.getElementById('projectDetailOverlay');

        const projectDetailsData = [
            {
                icon: 'fas fa-graduation-cap',
                category: 'E-Learning Platform',
                title: 'E-Learning Platform Testing',
                overview: 'Comprehensive quality assurance testing for a full-featured e-learning platform with video courses, progress tracking, and certification system.',
                tasks: [
                    'Tested user registration, login, and profile management',
                    'Validated course enrollment and video playback functionality',
                    'Tested progress tracking and certificate generation',
                    'Performed cross-browser testing (Chrome, Firefox, Safari, Edge)',
                    'Tested responsive design on iOS and Android devices',
                    'Validated payment gateway integration for premium courses',
                    'Performed load testing scenarios for concurrent users'
                ],
                findings: [
                    'Video playback failed on Safari when switching quality',
                    'Progress was not saved when user closed browser mid-lesson',
                    'Certificate PDF generation crashed for names with special characters',
                    'Mobile layout broke on tablets in landscape mode',
                    'Payment confirmation email delayed by 10+ minutes'
                ],
                tools: ['Jira', 'ClickUp', 'Chrome DevTools', 'BrowserStack'],
                stats: { testCases: 350, bugs: 85, critical: 12 }
            },
            {
                icon: 'fas fa-broadcast-tower',
                category: 'Telecom Application',
                title: 'Telecom Service Application Testing',
                overview: 'End-to-end testing of a telecom service application handling mobile recharge, plan management, billing, and customer support features.',
                tasks: [
                    'Tested mobile recharge flow for prepaid and postpaid',
                    'Validated plan selection, comparison, and upgrade features',
                    'Tested billing system accuracy and invoice generation',
                    'Verified user login with OTP and biometric authentication',
                    'Tested customer support chat and ticket system',
                    'Validated data accuracy across multiple service regions',
                    'Performed regression testing after each sprint'
                ],
                findings: [
                    'Recharge failed silently for amounts above ₹5000',
                    'Plan comparison showed incorrect data speeds',
                    'Billing invoice had wrong GST calculations for some states',
                    'OTP timer did not reset on resend click',
                    'Chat support disconnected after 2 minutes of inactivity'
                ],
                tools: ['Jira', 'Swagger', 'Postman', 'Android Studio'],
                stats: { testCases: 420, bugs: 110, critical: 15 }
            },
            {
                icon: 'fas fa-chart-line',
                category: 'Forex Trading Application',
                title: 'Forex Trading Platform Testing',
                overview: 'Critical testing of a forex trading application handling real-time trades, payment gateways (UPI & Crypto), and financial transactions requiring highest accuracy.',
                tasks: [
                    'Tested complete trading flow from order to execution',
                    'Validated real-time chart analysis and price updates',
                    'Tested UPI payment gateway integration',
                    'Tested cryptocurrency payment and withdrawal flow',
                    'Validated deposit and withdrawal process with multiple currencies',
                    'Performed security testing on transaction endpoints',
                    'Tested concurrent trading scenarios under load',
                    'Validated KYC document upload and verification flow'
                ],
                findings: [
                    'CRITICAL: Payment deducted but trade not executed in slow network',
                    'CRITICAL: Withdrawal allowed exceeding available balance',
                    'CRITICAL: Real-time prices had 5-second delay causing wrong trades',
                    'UPI payment showed success but amount not credited',
                    'Crypto withdrawal stuck in "processing" for 24+ hours',
                    'Chart data inconsistent between mobile and web platforms',
                    'KYC verification allowed expired documents'
                ],
                tools: ['Jira', 'Swagger', 'Charles Proxy', 'Chrome DevTools', 'Postman'],
                stats: { testCases: 580, bugs: 165, critical: 28 }
            }
        ];

        document.querySelectorAll('.portfolio-view-btn').forEach((btn, i) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openProjectDetail(i);
            });
        });

        function openProjectDetail(index) {
            const data = projectDetailsData[index];
            if (!data || !projectDetailModal) return;

            const header = document.getElementById('projectDetailHeader');
            const body = document.getElementById('projectDetailBody');

            if (header) {
                header.innerHTML =
                    '<div class="project-detail-icon"><i class="' + data.icon + '"></i></div>' +
                    '<div>' +
                    '<span class="project-detail-category">' + data.category + '</span>' +
                    '<h3 class="project-detail-title" id="projectDetailTitle">' + data.title + '</h3>' +
                    '</div>';
            }

            if (body) {
                const tasksHTML = data.tasks.map(t => '<li>' + t + '</li>').join('');
                const findingsHTML = data.findings.map(f => '<li>' + f + '</li>').join('');
                const toolsHTML = data.tools.map(t => '<span>' + t + '</span>').join('');

                body.innerHTML =
                    '<div class="project-detail-section">' +
                    '<h4><i class="fas fa-info-circle"></i> Overview</h4>' +
                    '<p>' + data.overview + '</p>' +
                    '</div>' +
                    '<div class="project-detail-section">' +
                    '<h4><i class="fas fa-tasks"></i> Testing Activities</h4>' +
                    '<ul class="project-tasks">' + tasksHTML + '</ul>' +
                    '</div>' +
                    '<div class="project-detail-section">' +
                    '<h4><i class="fas fa-bug"></i> Key Findings</h4>' +
                    '<ul class="project-findings">' + findingsHTML + '</ul>' +
                    '</div>' +
                    '<div class="project-detail-section">' +
                    '<h4><i class="fas fa-tools"></i> Tools Used</h4>' +
                    '<div class="project-tools">' + toolsHTML + '</div>' +
                    '</div>' +
                    '<div class="project-detail-stats">' +
                    '<div class="project-stat"><span class="project-stat-num">' + data.stats.testCases + '</span><span class="project-stat-label">Test Cases</span></div>' +
                    '<div class="project-stat"><span class="project-stat-num">' + data.stats.bugs + '</span><span class="project-stat-label">Bugs Found</span></div>' +
                    '<div class="project-stat"><span class="project-stat-num">' + data.stats.critical + '</span><span class="project-stat-label">Critical</span></div>' +
                    '</div>';
            }

            projectDetailModal.classList.add('active');
            projectDetailModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            trackEvent('Project', 'view_detail', data.title);
        }

        function closeProjectDetail() {
            if (!projectDetailModal) return;
            projectDetailModal.classList.remove('active');
            projectDetailModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        if (projectDetailClose) projectDetailClose.addEventListener('click', closeProjectDetail);
        if (projectDetailOverlay) projectDetailOverlay.addEventListener('click', closeProjectDetail);

        /* ==========================================
           24. SHARE WIDGET
           ========================================== */
        const shareToggle = document.getElementById('shareToggle');
        const shareButtons = document.getElementById('shareButtons');
        const portfolioURL = window.location.href;
        const shareText = 'Check out this amazing QA Tester portfolio by Sanket Brahmbhatt!';

        if (shareToggle && shareButtons) {
            shareToggle.addEventListener('click', () => {
                const isActive = shareToggle.classList.toggle('active');
                shareButtons.classList.toggle('active');
                shareToggle.setAttribute('aria-expanded', String(isActive));
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.share-widget')) {
                    shareToggle.classList.remove('active');
                    shareButtons.classList.remove('active');
                    shareToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        const shareCopy = document.getElementById('shareCopy');
        if (shareCopy) {
            shareCopy.addEventListener('click', () => {
                navigator.clipboard.writeText(portfolioURL).then(() => {
                    showToast('Portfolio link copied!', 'fas fa-link');
                    trackEvent('Share', 'click', 'Copy Link');
                }).catch(() => {
                    showToast('Failed to copy link', 'fas fa-exclamation-circle');
                });
            });
        }

        /* ==========================================
           25. QR CODE
           ========================================== */
        (function () {
    const qrModal          = document.getElementById('qrModal');
    const qrClose          = document.getElementById('qrClose');
    const qrOverlay        = document.getElementById('qrOverlay');
    const qrCanvas         = document.getElementById('qrCanvas');
    const qrUrlEl          = document.getElementById('qrUrl');
    const shareQRBtn       = document.getElementById('shareQR');
    const qrDownload       = document.getElementById('qrDownload');
    const qrSwitchCV       = document.getElementById('qrSwitchCV');
    const qrSwitchText     = document.getElementById('qrSwitchText');
    const qrModeLabel      = document.getElementById('qrModeLabel');
    const qrModeLabelText  = document.getElementById('qrModeLabelText');
    const qrModalTitleText = document.getElementById('qrModalTitleText');

    const PORTFOLIO_URL = window.location.href;
    const CV_PATH = 'assets/Sanket_Brahmbhatt_CV.pdf';
    const CV_URL = new URL(CV_PATH, window.location.href).href;

    console.log('Portfolio URL:', PORTFOLIO_URL);
    console.log('CV URL:', CV_URL);

    let currentMode = 'portfolio';
    let qrInstance = null;

    function generateQR(url) {
        if (!qrCanvas) return;

        const RENDER_SIZE = 380;

        if (qrInstance) {
            qrInstance.value = url;
            qrInstance.size = RENDER_SIZE;
        } else {
            qrInstance = new QRious({
                element: qrCanvas,
                value: url,
                size: RENDER_SIZE,
                level: 'H',
                background: '#ffffff',
                foreground: '#0d0d0d',
                padding: 16
            });
        }

        if (qrUrlEl) {
            qrUrlEl.textContent = url;
        }
    }

    function updateModeUI() {
        const isCV = currentMode === 'cv';

        if (qrModalTitleText) {
            qrModalTitleText.textContent = isCV ? 'SCAN TO GET CV' : 'SCAN PORTFOLIO';
        }

        if (qrModeLabelText) {
            qrModeLabelText.textContent = isCV ? 'CV / RESUME MODE' : 'PORTFOLIO MODE';
        }

        if (qrModeLabel) {
            const icon = qrModeLabel.querySelector('i');
            if (icon) {
                icon.className = isCV ? 'fas fa-file-pdf' : 'fas fa-globe';
            }
        }

        if (qrSwitchText) {
            qrSwitchText.textContent = isCV ? 'SCAN PORTFOLIO QR' : 'SCAN CV QR';
        }

        if (qrSwitchCV) {
            qrSwitchCV.classList.toggle('btn-filled', isCV);
        }
    }

    function openQRModal() {
        if (!qrModal) return;
        currentMode = 'portfolio';
        qrModal.classList.add('active');
        qrModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        generateQR(PORTFOLIO_URL);
        updateModeUI();
    }

    function closeQRModal() {
        if (!qrModal) return;
        qrModal.classList.remove('active');
        qrModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function downloadQRImage() {
        if (!qrCanvas) return;
        const label = currentMode === 'cv' ? 'Sanket_CV_QR' : 'Sanket_Portfolio_QR';
        const link = document.createElement('a');
        link.download = label + '.png';
        link.href = qrCanvas.toDataURL('image/png');
        link.click();
    }

    function switchMode() {
    currentMode = currentMode === 'portfolio' ? 'cv' : 'portfolio';
    generateQR(currentMode === 'cv' ? CV_URL : PORTFOLIO_URL);
    updateModeUI();
}

    if (shareQRBtn) shareQRBtn.addEventListener('click', openQRModal);
    if (qrClose) qrClose.addEventListener('click', closeQRModal);
    if (qrOverlay) qrOverlay.addEventListener('click', closeQRModal);
    if (qrDownload) qrDownload.addEventListener('click', downloadQRImage);
    if (qrSwitchCV) qrSwitchCV.addEventListener('click', switchMode);

    window.closeQRModal = closeQRModal;
})();

        /* ==========================================
           26. CALENDLY MODAL
           ========================================== */
        const calendlyModal = document.getElementById('calendlyModal');
        const calendlyClose = document.getElementById('calendlyClose');
        const calendlyOverlay = document.getElementById('calendlyOverlay');
        const calendlyTrigger = document.getElementById('calendlyTrigger');

        function closeCalendly() {
            if (calendlyModal) {
                calendlyModal.classList.remove('active');
                calendlyModal.setAttribute('aria-hidden', 'true');
            }
        }

        if (calendlyTrigger) {
            calendlyTrigger.addEventListener('click', () => {
                if (calendlyModal) {
                    calendlyModal.classList.add('active');
                    calendlyModal.setAttribute('aria-hidden', 'false');
                    trackEvent('Calendly', 'open', 'modal');
                }
            });
        }

        if (calendlyClose) calendlyClose.addEventListener('click', closeCalendly);
        if (calendlyOverlay) calendlyOverlay.addEventListener('click', closeCalendly);

        /* ==========================================
           27. BUG CATCHING GAME
           ========================================== */
        const bugGameModal    = document.getElementById('bugGameModal');
        const bugGameClose    = document.getElementById('bugGameClose');
        const bugGameOverlay  = document.getElementById('bugGameOverlay');
        const bugGameArea     = document.getElementById('bugGameArea');
        const bugGameStart    = document.getElementById('bugGameStart');
        const bugGameOver     = document.getElementById('bugGameOver');
        const bugStartBtn     = document.getElementById('bugStartBtn');
        const bugRestartBtn   = document.getElementById('bugRestartBtn');
        const bugScoreEl      = document.getElementById('bugScore');
        const bugTimerEl      = document.getElementById('bugTimer');
        const bugHighScoreEl  = document.getElementById('bugHighScore');
        const bugFinalScore   = document.getElementById('bugFinalScore');
        const bugRating       = document.getElementById('bugRating');

        let bugScore = 0;
        let bugTimeLeft = 30;
        let bugInterval = null;
        let bugSpawnInterval = null;
        let bugHighScore = parseInt(localStorage.getItem('sb_bug_high_score') || '0');

        if (bugHighScoreEl) bugHighScoreEl.textContent = bugHighScore;

        function openBugGame() {
            if (bugGameModal) {
                bugGameModal.classList.add('active');
                bugGameModal.setAttribute('aria-hidden', 'false');
                resetBugGame();
                trackEvent('Game', 'open', 'bug_catcher');
            }
        }

        function closeBugGame() {
            if (bugGameModal) {
                bugGameModal.classList.remove('active');
                bugGameModal.setAttribute('aria-hidden', 'true');
            }
            stopBugGame();
        }

        function resetBugGame() {
            bugScore = 0;
            bugTimeLeft = 30;
            if (bugScoreEl) bugScoreEl.textContent = '0';
            if (bugTimerEl) bugTimerEl.textContent = '30';
            if (bugGameStart) bugGameStart.classList.remove('hidden');
            if (bugGameOver) bugGameOver.classList.remove('active');
            document.querySelectorAll('.game-bug').forEach(b => b.remove());
        }

        function startBugGame() {
            if (bugGameStart) bugGameStart.classList.add('hidden');
            if (bugGameOver) bugGameOver.classList.remove('active');

            bugScore = 0;
            bugTimeLeft = 30;
            if (bugScoreEl) bugScoreEl.textContent = '0';

            bugInterval = setInterval(() => {
                bugTimeLeft--;
                if (bugTimerEl) bugTimerEl.textContent = bugTimeLeft;
                if (bugTimeLeft <= 0) endBugGame();
            }, 1000);

            spawnBug();
            bugSpawnInterval = setInterval(spawnBug, 800);
        }

        function spawnBug() {
            if (!bugGameArea) return;
            const bug = document.createElement('div');
            bug.classList.add('game-bug');

            const bugEmojis = ['🐛', '🐞', '🪲', '🦗', '🕷️', '🐜'];
            bug.textContent = bugEmojis[Math.floor(Math.random() * bugEmojis.length)];

            const areaRect = bugGameArea.getBoundingClientRect();
            bug.style.left = Math.random() * (areaRect.width - 40) + 'px';
            bug.style.top  = Math.random() * (areaRect.height - 40) + 'px';

            bug.addEventListener('click', () => {
                bug.classList.add('caught');
                bugScore++;
                if (bugScoreEl) bugScoreEl.textContent = bugScore;
                setTimeout(() => bug.remove(), 300);
            });

            bugGameArea.appendChild(bug);

            setTimeout(() => {
                if (bug.parentNode && !bug.classList.contains('caught')) {
                    bug.style.opacity = '0';
                    setTimeout(() => bug.remove(), 200);
                }
            }, 1500 + Math.random() * 1000);
        }

        function endBugGame() {
            stopBugGame();
            if (bugFinalScore) bugFinalScore.textContent = bugScore;
            if (bugGameOver) bugGameOver.classList.add('active');

            let rating = '';
            if (bugScore >= 25)      rating = '⭐⭐⭐⭐⭐ QA Master!';
            else if (bugScore >= 20) rating = '⭐⭐⭐⭐ Bug Hunter!';
            else if (bugScore >= 15) rating = '⭐⭐⭐ Good Tester!';
            else if (bugScore >= 10) rating = '⭐⭐ Keep Testing!';
            else                     rating = '⭐ Rookie Tester';

            if (bugRating) bugRating.textContent = rating;

            if (bugScore > bugHighScore) {
                bugHighScore = bugScore;
                localStorage.setItem('sb_bug_high_score', bugHighScore);
                if (bugHighScoreEl) bugHighScoreEl.textContent = bugHighScore;
                showToast('New high score: ' + bugScore + '!', 'fas fa-trophy');
                launchConfetti();
            }

            trackEvent('Game', 'score', bugScore.toString());
            document.querySelectorAll('.game-bug').forEach(b => b.remove());
        }

        function stopBugGame() {
            clearInterval(bugInterval);
            clearInterval(bugSpawnInterval);
            bugInterval = null;
            bugSpawnInterval = null;
        }

        const bugGameTrigger = document.getElementById('bugGameTrigger');
        if (bugGameTrigger) bugGameTrigger.addEventListener('click', openBugGame);
        if (bugGameClose)   bugGameClose.addEventListener('click', closeBugGame);
        if (bugGameOverlay) bugGameOverlay.addEventListener('click', closeBugGame);
        if (bugStartBtn)    bugStartBtn.addEventListener('click', startBugGame);
        if (bugRestartBtn)  bugRestartBtn.addEventListener('click', () => { resetBugGame(); startBugGame(); });

        /* ==========================================
           28. COOKIE CONSENT
           ========================================== */
        const cookieBanner  = document.getElementById('cookieBanner');
        const cookieAccept  = document.getElementById('cookieAccept');
        const cookieDecline = document.getElementById('cookieDecline');

        if (!localStorage.getItem('sb_cookie_consent') && cookieBanner) {
            setTimeout(() => cookieBanner.classList.add('visible'), 3000);
        }

        if (cookieAccept) {
            cookieAccept.addEventListener('click', () => {
                localStorage.setItem('sb_cookie_consent', 'accepted');
                if (cookieBanner) cookieBanner.classList.remove('visible');
                showToast('Cookies accepted!', 'fas fa-cookie-bite');
                trackEvent('Cookie', 'consent', 'accepted');
            });
        }

        if (cookieDecline) {
            cookieDecline.addEventListener('click', () => {
                localStorage.setItem('sb_cookie_consent', 'declined');
                if (cookieBanner) cookieBanner.classList.remove('visible');
                showToast('Cookies declined', 'fas fa-cookie-bite');
            });
        }

        /* ==========================================
           29. KEYBOARD SHORTCUTS
           ========================================== */
        const shortcutsModal = document.getElementById('shortcutsModal');
        const shortcutsClose = document.getElementById('shortcutsClose');
        const keyboardHint   = document.getElementById('keyboardHint');

        document.addEventListener('keydown', (e) => {
            const tag = document.activeElement?.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            switch (e.key.toLowerCase()) {
                case 'escape':
                    closeCVModal();
                    closeLightbox();
                    closeProjectDetail();
                    if (typeof window.closeQRModal === 'function') window.closeQRModal();
                    closeCalendly();
                    closeBugGame();
                    if (shortcutsModal) {
                        shortcutsModal.classList.remove('active');
                        shortcutsModal.setAttribute('aria-hidden', 'true');
                    }
                    break;
                case '?':
                    e.preventDefault();
                    if (shortcutsModal) {
                        const isActive = shortcutsModal.classList.toggle('active');
                        shortcutsModal.setAttribute('aria-hidden', String(!isActive));
                    }
                    break;
                case 'h': scrollToSection('#home'); break;
                case 'a': scrollToSection('#about'); break;
                case 'e': scrollToSection('#experience'); break;
                case 's': scrollToSection('#skills'); break;
                case 'p': scrollToSection('#projects'); break;
                case 'c': scrollToSection('#contact'); break;
                case 'd':
                    openCVModal();
                    trackEvent('Shortcut', 'keyboard', 'download_cv');
                    break;
                case 't':
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;
                case 'w':
                    document.getElementById('whatsappBtn')?.click();
                    break;
                case '1': document.querySelector('[data-theme="cyber"]')?.click(); break;
                case '2': document.querySelector('[data-theme="neon"]')?.click(); break;
                case '3': document.querySelector('[data-theme="matrix"]')?.click(); break;
                case '4': document.querySelector('[data-theme="gold"]')?.click(); break;
            }
        });

        /* Arrow keys for lightbox */
        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.classList.contains('active')) {
                if (e.key === 'ArrowLeft') lightboxPrev?.click();
                if (e.key === 'ArrowRight') lightboxNext?.click();
            }
        });

        if (shortcutsClose) {
            shortcutsClose.addEventListener('click', () => {
                shortcutsModal.classList.remove('active');
                shortcutsModal.setAttribute('aria-hidden', 'true');
            });
        }

        if (shortcutsModal) {
            shortcutsModal.querySelector('.shortcuts-overlay')?.addEventListener('click', () => {
                shortcutsModal.classList.remove('active');
                shortcutsModal.setAttribute('aria-hidden', 'true');
            });
        }

        if (keyboardHint) {
            setTimeout(() => {
                keyboardHint.classList.add('visible');
                setTimeout(() => keyboardHint.classList.remove('visible'), 5000);
            }, 3000);
        }

        /* ==========================================
           30. EASTER EGG (Konami Code)
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
                        easterEgg.setAttribute('aria-hidden', 'false');
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
                const ee = document.getElementById('easterEgg');
                if (ee) {
                    ee.classList.remove('active');
                    ee.setAttribute('aria-hidden', 'true');
                }
            });
        }

        /* ==========================================
           31. AUTO GREETING BASED ON TIME
           ========================================== */
        (function updateGreeting() {
            const greetingEl = document.getElementById('greetingText');
            if (!greetingEl) return;
            const hour = new Date().getHours();
            let greeting = 'HELLO, I AM';
            if (hour >= 5 && hour < 12)       greeting = 'GOOD MORNING, I AM';
            else if (hour >= 12 && hour < 17)  greeting = 'GOOD AFTERNOON, I AM';
            else if (hour >= 17 && hour < 21)  greeting = 'GOOD EVENING, I AM';
            else                               greeting = 'HELLO NIGHT OWL, I AM';
            greetingEl.textContent = greeting;
        })();

        /* ==========================================
           32. VISITOR COUNTER
           ========================================== */
        (function initVisitorCounter() {
            const counterEl = document.getElementById('visitorCount');
            if (!counterEl) return;
            let visits = parseInt(localStorage.getItem('sb_visit_count') || '0');
            if (!sessionStorage.getItem('sb_session_active')) {
                visits++;
                localStorage.setItem('sb_visit_count', visits);
                sessionStorage.setItem('sb_session_active', 'true');
            }
            counterEl.textContent = visits;
        })();

        /* ==========================================
           33. PAGE LOAD SPEED & PERFORMANCE SCORE
           ========================================== */
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (!perfData) return;

            const loadSpeedEl    = document.getElementById('loadSpeed');
            const loadSpeedValue = document.getElementById('loadSpeedValue');
            if (loadSpeedEl && loadSpeedValue) {
                const loadTime = ((perfData.loadEventEnd - perfData.startTime) / 1000).toFixed(1);
                loadSpeedValue.textContent = loadTime + 's';
                setTimeout(() => {
                    loadSpeedEl.classList.add('visible');
                    setTimeout(() => loadSpeedEl.classList.remove('visible'), 4000);
                }, 2000);
            }

            const perfScoreEl  = document.getElementById('perfScore');
            const perfValue    = document.getElementById('perfValue');
            const perfRingFill = document.getElementById('perfRingFill');

            if (perfScoreEl && perfValue && perfRingFill) {
                setTimeout(() => {
                    const loadTimeMs = perfData.loadEventEnd - perfData.startTime;
                    let score = 95;
                    if (loadTimeMs > 5000)      score = 40;
                    else if (loadTimeMs > 3000) score = 60;
                    else if (loadTimeMs > 2000) score = 75;
                    else if (loadTimeMs > 1000) score = 85;

                    perfValue.textContent = score;

                    const circumference = 2 * Math.PI * 26;
                    const offset = circumference - (score / 100) * circumference;
                    perfRingFill.style.strokeDashoffset = offset;

                    if (score >= 80)      perfRingFill.style.stroke = '#00ff41';
                    else if (score >= 60) perfRingFill.style.stroke = '#ffd700';
                    else                  perfRingFill.style.stroke = '#ff2d75';

                    perfScoreEl.classList.add('visible');
                }, 2500);
            }
        });

        /* ==========================================
           34. ONLINE/OFFLINE INDICATOR
           ========================================== */
        const networkStatus = document.getElementById('networkStatus');
        const networkText   = document.getElementById('networkText');

        function showNetworkStatus(isOnline) {
            if (!networkStatus) return;
            networkStatus.className = 'network-status ' + (isOnline ? 'online' : 'offline');
            if (networkText) networkText.textContent = isOnline ? 'Back Online' : 'You\'re Offline';
            const icon = networkStatus.querySelector('i');
            if (icon) icon.className = isOnline ? 'fas fa-wifi' : 'fas fa-exclamation-triangle';
            networkStatus.classList.add('visible');
            setTimeout(() => networkStatus.classList.remove('visible'), 3000);
        }

        window.addEventListener('online',  () => showNetworkStatus(true));
        window.addEventListener('offline', () => showNetworkStatus(false));

        /* ==========================================
           35. CLICK TO CALL (Mobile only)
           ========================================== */
        const clickToCall = document.getElementById('clickToCall');
        if (clickToCall && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
            clickToCall.style.display     = 'flex';
            clickToCall.style.opacity     = '0';
            clickToCall.style.visibility  = 'hidden';
            clickToCall.style.transition  = 'all 0.3s';
            clickToCall.addEventListener('click', () => {
                trackEvent('Contact', 'click_to_call', 'mobile');
            });
        }

        /* ==========================================
           36. ANALYTICS
           ========================================== */
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

        document.querySelectorAll('.btn, .nav-link, .mobile-link, .social-icon, .footer-socials a').forEach(btn => {
            btn.addEventListener('click', () => {
                const label = btn.textContent.trim() || btn.getAttribute('aria-label') || 'unknown';
                trackEvent('Click', 'button_click', label);
            });
        });

        const pageStartTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
            trackEvent('Engagement', 'time_on_page', timeSpent + ' seconds');
        });

        /* ==========================================
           37. INITIAL SCROLL TRIGGER
           ========================================== */
        setTimeout(() => window.dispatchEvent(new Event('scroll')), 150);

    }); /* END DOMContentLoaded */

})(); /* END IIFE */