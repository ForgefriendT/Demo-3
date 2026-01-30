import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileBtn.classList.toggle('open');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileBtn.classList.remove('open');
            });
        });
    }

    // 2. GSAP Animations (Clean, No Tilt)

    // Hero Sequence
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl.fromTo('.hero-bg-overlay', { opacity: 0 }, { opacity: 1, duration: 1.5 })
        .fromTo('.hero h1', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.5")
        .fromTo('.hero-pre-title', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.8")
        .fromTo('.hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .fromTo('.rating-badge', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });

    // Parallax Hero
    gsap.to('.hero', {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // General Section Reveals
    const revealElements = document.querySelectorAll('.gs-reveal');
    revealElements.forEach(el => {
        gsap.fromTo(el,
            { y: 50, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Staggered Reveals
    const staggerGroups = document.querySelectorAll('.services-menu-grid, .trust-grid, .experience-grid');

    staggerGroups.forEach(group => {
        const children = group.children;
        gsap.fromTo(children,
            { y: 30, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: group,
                    start: "top 80%"
                }
            }
        );
    });

    // 3. Booking Modal Logic
    const bookingModal = document.getElementById('booking-modal');
    const reserveBtns = document.querySelectorAll('#header-book-btn, #mobile-reserve-btn, #hero-reserve-btn, .btn-submit');
    const modalClose = document.querySelector('.modal-close');
    const bookingOptions = document.querySelectorAll('.booking-option');
    const steps = document.querySelectorAll('.booking-step');
    const stepIndicators = document.querySelectorAll('.step');

    const openModal = (e) => {
        if (e) e.preventDefault();
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
        resetBooking();
    };

    const resetBooking = () => {
        steps.forEach((s, i) => {
            s.classList.toggle('active', i === 0);
        });
        stepIndicators.forEach((s, i) => {
            s.classList.toggle('active', i === 0);
        });
    };

    reserveBtns.forEach(btn => btn.addEventListener('click', openModal));
    modalClose.addEventListener('click', closeModal);
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal();
    });

    // Step Transition
    bookingOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            steps[0].classList.remove('active');
            steps[1].classList.add('active');
            stepIndicators[1].classList.add('active');
            populateTimeSlots();
        });
    });

    const populateTimeSlots = () => {
        const grid = document.getElementById('time-grid');
        grid.innerHTML = '';
        const times = ['10:00 AM', '11:00 AM', '12:30 PM', '2:00 PM', '4:00 PM', '5:30 PM'];
        times.forEach(t => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.innerText = t;
            slot.onclick = () => {
                steps[1].classList.remove('active');
                steps[2].classList.add('active');
                stepIndicators[2].classList.add('active');
            };
            grid.appendChild(slot);
        });
    };

    // 4. Enhanced Scroll Animations
    const staggerItems = document.querySelectorAll('.services-menu-grid > *, .why-grid > *, .gallery-grid > *');

    gsap.fromTo(staggerItems,
        { y: 40, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: staggerItems[0],
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Fade in text elements
    gsap.utils.toArray('h2, .section-header p').forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 30,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 90%"
            }
        });
    });
});
