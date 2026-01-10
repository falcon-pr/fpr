/**
 * Falcon Plant Resources - Animation Logic
 * Powered by Anime.js
 * Implements 10+ interactive animations for enhanced UX.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. PRELOADER (Idea 9)
    // Pulse the logo
    anime({
        targets: '.preloader-logo',
        scale: [0.9, 1.1],
        opacity: [0.8, 1],
        duration: 800,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
    });

    // Animate progress bar
    anime({
        targets: '.loading-progress',
        width: '100%',
        duration: 1500,
        easing: 'easeInOutQuad',
        complete: function() {
            // Fade out preloader
            anime({
                targets: '#preloader',
                opacity: 0,
                translateY: -50,
                duration: 800,
                easing: 'easeOutExpo',
                complete: function() {
                    const preloader = document.querySelector('#preloader');
                    if (preloader) preloader.style.display = 'none';
                    // Trigger Hero Animations after preloader is done
                    animateHero();
                }
            });
        }
    });

    // 2. HERO ANIMATIONS
    function animateHero() {
        // Typewriter Effect for Title (Idea 1) - implied as part of user selection context or standard
        // But specifically asked for Scroll Indicator (Idea 5) and others.
        // Let's add the Typewriter effect anyway as it was discussed, or just fade in.
        // The user selected "5,8,9,11,12,13,14,15,16,19,20".
        // Idea 1 (Typewriter) was NOT in the user's specific selection list "5,8,9,11,12,13,14,15,16,19,20",
        // so I will skip Typewriter to respect the explicit choice, but ensure the title appears.

        anime({
            targets: '.hero h1, .hero-company h1, .service-hero h1, .service-hero-content h1',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000,
            easing: 'easeOutCubic'
        });

        // 3. SCROLL INDICATOR (Idea 5)
        anime({
            targets: '.scroll-indicator',
            translateY: [0, 10],
            direction: 'alternate',
            loop: true,
            duration: 800,
            easing: 'easeInOutSine'
        });
    }

    // 4. RIPPLE EFFECT (Idea 8)
    const buttons = document.querySelectorAll('.btn, .nav-menu li a');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Only for visual effect, let links work normally
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;

            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // Append to button (make sure button is relative/overflow hidden)
            // .btn already has this. Nav links might need it.
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 5. SECTION TITLES LINE DRAWING (Idea 11)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate Line
                const line = entry.target.querySelector('.title-line');
                if (line) {
                    anime({
                        targets: line,
                        width: ['0px', '80px'],
                        duration: 800,
                        easing: 'easeOutCubic'
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title').forEach(title => {
        sectionObserver.observe(title);
    });

    // 6. SERVICE CARDS STAGGER - Top Tier Animation
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Reset initial state for animation
                    anime.set('.service-card', {
                        opacity: 0,
                        translateY: 50,
                        scale: 0.8,
                        rotateX: 10
                    });

                    anime({
                        targets: '.service-card',
                        opacity: [0, 1],
                        translateY: [50, 0],
                        scale: [0.8, 1],
                        rotateX: [10, 0],
                        delay: anime.stagger(200),
                        duration: 1200,
                        easing: 'easeOutElastic(1, .6)' // Nice bounce
                    });
                    gridObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        gridObserver.observe(servicesGrid);
    }

    // 7. SERVICE CARD HOVER - 3D TILT & LEVITATION (Top of the Top)
    document.querySelectorAll('.service-card').forEach(card => {
        const bg = card.querySelector('.service-card-bg');

        // Disable native transition for smoother anime.js control during interaction
        card.style.transition = 'none';

        // Mouse Move (3D Tilt)
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Disable on mobile

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            anime({
                targets: card,
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                duration: 100, // Very fast for responsiveness
                easing: 'linear'
            });

            // BG Parallax Effect
            if (bg) {
                const moveX = ((x - centerX) / centerX) * -10;
                const moveY = ((y - centerY) / centerY) * -10;

                anime({
                    targets: bg,
                    scale: 1.15, // Zoom in
                    translateX: moveX,
                    translateY: moveY,
                    duration: 100,
                    easing: 'linear'
                });
            }
        });

        // Mouse Leave (Reset)
        card.addEventListener('mouseleave', () => {
            // Restore smooth transition for reset
             anime({
                targets: card,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                translateY: 0,
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                duration: 800,
                easing: 'easeOutElastic(1, .5)'
            });

            if (bg) {
                anime({
                    targets: bg,
                    scale: 1,
                    translateX: 0,
                    translateY: 0,
                    duration: 800,
                    easing: 'easeOutQuad'
                });
            }
        });
    });

    // 8. ABOUT TABS ELASTIC TRANSITION (Idea 14)
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Override existing click listeners if needed, or work with them.
    // The existing script in index.html handles the class toggling.
    // We need to intercept or augment it.
    // Since we are defer loading, we can re-attach.

    tabLinks.forEach(link => {
        // Clone node to remove old listeners? No, that breaks things.
        // Just add a new listener that runs AFTER the class change (or we handle logic here).
        // Let's replace the logic from index.html here for full control.
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default anchor behavior
            e.stopImmediatePropagation(); // Stop the inline script from running if we can, or just overwrite visual state.

            // Remove active class from all links
            tabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const targetId = link.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);

            // Hide all contents with animation?
            // Simple approach: Hide all, Show Target with Elastic Enter
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });

            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');

                // Elastic Entrance
                anime({
                    targets: targetContent,
                    opacity: [0, 1],
                    translateX: [20, 0],
                    duration: 800,
                    easing: 'easeOutElastic(1, .6)'
                });
            }
        });
    });

    // 9. STATS COUNTERS (Idea 16 & Idea 10 - Center Trigger)
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        // Idea 10: Center Trigger for Mobile
        const isMobileStats = window.innerWidth < 768;
        const statsRootMargin = isMobileStats ? '-40% 0px -40% 0px' : '0px';

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = document.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        const originalText = counter.innerText;
                        let targetValue = parseInt(counter.getAttribute('data-target'));
                        let suffix = '';
                        let prefix = '';

                        // If data-target is missing or invalid, parse from text
                        if (isNaN(targetValue)) {
                            // Regex to find the number.
                            // Matches: optional prefix (non-digits), number (digits with optional decimal), any suffix (even with digits like /7)
                            const match = originalText.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
                            if (match) {
                                prefix = match[1];
                                targetValue = parseFloat(match[2]);
                                suffix = match[3];
                            } else {
                                // Fallback: try to just parse float
                                targetValue = parseFloat(originalText);
                                if (!isNaN(targetValue)) {
                                    suffix = originalText.replace(targetValue.toString(), '').trim();
                                }
                            }
                        } else {
                            // If data-target exists, preserve suffix/prefix
                            const match = originalText.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
                            if (match) {
                                prefix = match[1];
                                suffix = match[3];
                            } else {
                                suffix = originalText.includes('%') ? '%' : (originalText.includes('+') ? '+' : '');
                            }
                        }

                        if (isNaN(targetValue)) return;

                        // Use a dummy object to animate the value
                        let dummy = { val: 0 };
                        // Determine decimal places for rounding
                        const isFloat = !Number.isInteger(targetValue);

                        let animeConfig = {
                            targets: dummy,
                            val: targetValue,
                            easing: 'easeOutExpo',
                            duration: 2000,
                            update: function() {
                                // For floats, we might need to fix precision to avoid floating point errors
                                let displayVal = dummy.val;
                                if (isFloat) {
                                    displayVal = parseFloat(dummy.val.toFixed(1));
                                }
                                counter.innerHTML = prefix + displayVal + suffix;
                            }
                        };

                        // Only apply rounding for integers
                        if (!isFloat) {
                            animeConfig.round = 1;
                        }

                        anime(animeConfig);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5, rootMargin: statsRootMargin });
        statsObserver.observe(statsSection);
    }

    // 10. FORM FOCUS LASER (Idea 19)
    const formInputs = document.querySelectorAll('.anime-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            const border = input.nextElementSibling; // .focus-border
            if (border) {
                anime({
                    targets: border,
                    width: '100%',
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
        });

        input.addEventListener('blur', () => {
            const border = input.nextElementSibling;
            if (border && input.value === '') { // Collapse if empty? Or always? standard is always on blur
                anime({
                    targets: border,
                    width: '0%',
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
        });
    });

    // 11. SUBMIT BUTTON TAKEOFF (Idea 20) & FORM SHAKE (Idea 9)
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent actual form submit for demo

            // Idea 9: Form Validation Shake
            // Simple validation: check if inputs are empty
            const form = submitBtn.closest('.contact-form');
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;
            let invalidElements = [];

            inputs.forEach(input => {
                if (input.value.trim() === '') {
                    isValid = false;
                    invalidElements.push(input.parentElement); // Shake the wrapper
                }
            });

            if (!isValid) {
                // Shake Animation
                anime({
                    targets: invalidElements,
                    translateX: [0, -10, 10, -10, 10, 0],
                    duration: 600,
                    easing: 'easeInOutSine'
                });
                return; // Stop execution
            }

            // Animation (Takeoff) if valid
            anime({
                targets: submitBtn,
                scale: [1, 0.1],
                translateX: [0, 200],
                translateY: [0, -200],
                opacity: 0,
                duration: 800,
                easing: 'easeInBack',
                complete: () => {
                    // Reset or show success message
                    submitBtn.style.display = 'none';
                    const successMsg = document.createElement('div');
                    successMsg.innerHTML = '<h3 style="color: var(--primary-red); text-align: center;">Message Sent!</h3>';
                    form.appendChild(successMsg);

                    anime({
                        targets: successMsg,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 600
                    });
                }
            });
        });
    }

    // 12. BACK TO TOP BUTTON (Idea 8)
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        // Show/Hide on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Click Logic - Rocket Launch
        backToTopBtn.addEventListener('click', () => {
            // Animate Scroll to Top
            anime({
                targets: 'html, body',
                scrollTop: 0,
                duration: 1000,
                easing: 'easeInOutCubic'
            });

            // Animate Button Launch
            anime({
                targets: backToTopBtn,
                translateY: -1000,
                opacity: 0,
                duration: 1000,
                easing: 'easeInExpo',
                complete: () => {
                    // Reset Button State
                    backToTopBtn.classList.remove('visible');
                    anime.set(backToTopBtn, {
                        translateY: 0,
                        opacity: 0 // Will be handled by class toggle but safe to reset
                    });
                }
            });
        });
    }

    // 13. SERVICE CARD TOUCH ANIMATION (Idea 4) - Mobile Only
    // Use matchMedia to check if mobile? Or apply to all touch events.
    // The request said "exclusive for smartphone view", but usually safe for all.
    // Let's filter by width to be precise to the request.
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                // Quick scale pulse
                anime({
                    targets: card,
                    scale: [1, 0.95, 1],
                    duration: 200,
                    easing: 'easeInOutQuad'
                });
            });
        });
    }

    // 14. CERTIFICATES ANIMATION (Fabrication Page)
    const certsContainer = document.querySelector('.certs-container');
    if (certsContainer) {
        const certsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger Entrance
                    anime({
                        targets: '.anime-cert',
                        opacity: [0, 1],
                        translateY: [50, 0],
                        scale: [0.8, 1],
                        rotate: {
                            value: [-5, 0], // Slight rotation for effect
                            duration: 1000
                        },
                        delay: anime.stagger(200),
                        duration: 1200,
                        easing: 'easeOutElastic(1, .8)',
                        complete: function() {
                             // Continuous Floating Effect after entrance
                             anime({
                                targets: '.anime-cert img',
                                translateY: [-5, 5],
                                direction: 'alternate',
                                loop: true,
                                duration: 2000,
                                easing: 'easeInOutSine',
                                delay: anime.stagger(300) // Stagger the float too
                             });
                        }
                    });
                    certsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        certsObserver.observe(certsContainer);
    }
});
