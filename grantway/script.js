'use strict';

/**
 * ============================================
 * GRANTWAY - Asosiy JavaScript
 * Professional darajadagi kod
 * ============================================
 */

/**
 * ============================================
 * CONFIGURATION: Konfiguratsiya
 * ============================================
 */
const CONFIG = {
    // Intersection Observer
    observerThreshold: 0.1,
    observerRootMargin: '0px 0px -50px 0px',
    
    // Animatsiya sozlamalari
    animationDelay: 150,
    animationStagger: 100,
    
    // Counter sozlamalari
    counterDuration: 2000,
    counterStepDelay: 16,
};

/**
 * ============================================
 * DATA: Muqim sanalar
 * ============================================
 */
const examData = {
    // Fanlar bo'yicha ma'lumotlar
    subjects: {
        matematika: {
            name: 'Matematika',
            icon: 'matematika',
            color: '#4a6cf7',
            facts: [
                'Al-Xorazmiy "Algebra" asari bilan matematikaga algebra atamasini kiritgan.',
                'Matematika soʻzi yunoncha "mathema" (bilim) soʻzidan olingan.',
                'Dunyodagi eng qadimiy matematik matnlar Misr va Mesopotamiyada topilgan.'
            ]
        },
        tarix: {
            name: 'Tarix',
            icon: 'tarix',
            color: '#d4a820',
            facts: [
                'O\'zbekiston hududida 3000 yil avval yozma adabiyot paydo bo\'lgan.',
                'Avesto kitobi eng qadimiy manbalardan biri hisoblanadi.',
                'Samarqand dunyodagi eng qadimiy shaharlardan biri (2750 yil).'
            ]
        },
        'ona-tili': {
            name: 'Ona tili',
            icon: 'ona-tili',
            color: '#2ecc71',
            facts: [
                'O\'zbek tili 33 ta harfga ega.',
                '1993-yilda lotin alifbosiga o\'tilgan.',
                'O\'zbek tili turkiy tillar oilasiga mansub.'
            ]
        },
        kimyo: {
            name: 'Kimyo',
            icon: 'kimyo',
            color: '#e74c3c',
            facts: [
                'Abu Ali Ibn Sino 1000 dan ortiq dori vositalarining kimyoviy tarkibini o\'rgangan.',
                'Kimyo soʻzi arabcha "al-kimiya" soʻzidan olingan.',
                'O\'zbekiston kimyo sanoati 100 dan ortiq mahsulot ishlab chiqaradi.'
            ]
        },
        ingliz: {
            name: 'Ingliz tili',
            icon: 'ingliz',
            color: '#e67e22',
            facts: [
                'Ingliz tili dunyoda 1.5 milliard odam tomonidan qo\'llaniladi.',
                'Ingliz tili 58 ta davlatda rasmiy til hisoblanadi.',
                'Ingliz tili internet tilining 52% ini tashkil qiladi.'
            ]
        }
    },
    
    // Statistika
    statistics: {
        years: 10,
        questions: 500,
        users: 1200,
        grants: 100
    },
    
    // Fanlar ro'yxati (tartib uchun)
    subjectList: ['matematika', 'tarix', 'ona-tili', 'kimyo', 'ingliz']
};

/**
 * ============================================
 * DOM REFERENCES: DOM elementlariga havolalar
 * ============================================
 */
const DOM = {
    // Header
    header: document.querySelector('.header'),
    burger: document.querySelector('.header__burger'),
    mobile: document.querySelector('.header__mobile'),
    mobileLinks: document.querySelectorAll('.header__mobile-link'),
    
    // Hero
    hero: document.querySelector('.hero'),
    heroParallax: document.querySelector('.hero__parallax'),
    
    // Statistics
    statisticNumbers: document.querySelectorAll('.statistic-item__number'),
    
    // Accordion
    factTriggers: document.querySelectorAll('.fact-item__trigger'),
    factContents: document.querySelectorAll('.fact-item__content'),
    
    // CTA
    ctaButtons: document.querySelectorAll('.cta-button'),
    
    // Subject cards
    subjectCards: document.querySelectorAll('.subject-card'),
    
    // All sections for observer
    sections: document.querySelectorAll('section'),
};

/**
 * ============================================
 * UTILITY FUNCTIONS: Yordamchi funksiyalar
 * ============================================
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function isElementInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const thresholdHeight = windowHeight * threshold;
    return rect.top <= windowHeight - thresholdHeight && rect.bottom >= thresholdHeight;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * ============================================
 * HEADER: Scroll va Burger funksiyalari
 * ============================================
 */
class HeaderManager {
    constructor() {
        this.lastScrollY = window.scrollY;
        this.isMenuOpen = false;
        this.init();
    }
    
    init() {
        this.handleScroll = this.handleScroll.bind(this);
        this.handleBurger = this.handleBurger.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        window.addEventListener('scroll', throttle(this.handleScroll, 50), { passive: true });
        window.addEventListener('resize', debounce(this.handleResize, 150), { passive: true });
        
        if (DOM.burger) {
            DOM.burger.addEventListener('click', this.handleBurger);
        }
        
        DOM.mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.closeMenu();
                }
            });
        });
        
        // Dastlabki holat
        this.handleScroll();
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        const header = DOM.header;
        
        if (!header) return;
        
        if (currentScrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    handleBurger(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isMenuOpen = true;
        DOM.burger.classList.add('header__burger--active');
        DOM.mobile.classList.add('header__mobile--open');
        DOM.burger.setAttribute('aria-expanded', 'true');
        DOM.mobile.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        DOM.burger.classList.remove('header__burger--active');
        DOM.mobile.classList.remove('header__mobile--open');
        DOM.burger.setAttribute('aria-expanded', 'false');
        DOM.mobile.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }
    
    handleResize() {
        if (window.innerWidth >= 768 && this.isMenuOpen) {
            this.closeMenu();
        }
    }
}

/**
 * ============================================
 * HERO: Parallax va animatsiyalar
 * ============================================
 */
class HeroManager {
    constructor() {
        this.parallaxElement = DOM.heroParallax;
        this.init();
    }
    
    init() {
        if (this.parallaxElement) {
            window.addEventListener('scroll', throttle(this.handleParallax.bind(this), 16), { passive: true });
        }
    }
    
    handleParallax() {
        const scrollY = window.scrollY;
        const hero = DOM.hero;
        if (!hero) return;
        
        const heroHeight = hero.offsetHeight;
        const progress = Math.min(scrollY / heroHeight, 1);
        
        if (this.parallaxElement) {
            const translateY = progress * 30;
            this.parallaxElement.style.transform = `translateY(${translateY}px) scale(${1 + progress * 0.02})`;
        }
        
        // Hero kontenti uchun parallax
        const content = hero.querySelector('.hero__content');
        if (content) {
            const contentTranslate = progress * 20;
            content.style.transform = `translateY(${contentTranslate}px)`;
            content.style.opacity = 1 - progress * 0.3;
        }
    }
}

/**
 * ============================================
 * STATISTICS: Animated Counter
 * ============================================
 */
class CounterManager {
    constructor() {
        this.counterElements = DOM.statisticNumbers;
        this.observedElements = new Map();
        this.animationRunning = new Set();
        this.init();
    }
    
    init() {
        if (!this.counterElements.length) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        if (!this.animationRunning.has(element)) {
                            this.animateCounter(element);
                            this.animationRunning.add(element);
                        }
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.counterElements.forEach(element => {
            observer.observe(element);
            this.observedElements.set(element, false);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = parseInt(element.getAttribute('data-duration'), 10) || CONFIG.counterDuration;
        const startTime = performance.now();
        const startValue = 0;
        
        // Suffixni saqlab qolish
        const suffix = element.parentElement.querySelector('.statistic-item__suffix');
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutQuart)
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(startValue + (target - startValue) * eased);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
}

/**
 * ============================================
 * ACCORDION: Bilasizmi
 * ============================================
 */
class AccordionManager {
    constructor() {
        this.triggers = DOM.factTriggers;
        this.contents = DOM.factContents;
        this.openItems = new Set();
        this.init();
    }
    
    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', this.handleTriggerClick.bind(this));
        });
    }
    
    handleTriggerClick(e) {
        const trigger = e.currentTarget;
        const item = trigger.closest('.fact-item');
        const content = item.querySelector('.fact-item__content');
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        
        // Faqat bittasi ochiq bo'lsin
        if (!isExpanded) {
            // Barcha ochiqlarni yopish
            this.triggers.forEach(t => {
                if (t !== trigger && t.getAttribute('aria-expanded') === 'true') {
                    this.closeItem(t);
                }
            });
            this.openItem(trigger, content);
        } else {
            this.closeItem(trigger, content);
        }
    }
    
    openItem(trigger, content) {
        trigger.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
        
        // Glow animatsiyasi uchun icon
        const icon = trigger.querySelector('.fact-item__icon');
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, color 0.4s ease';
            icon.style.transform = 'scale(1.2) rotate(-10deg)';
            icon.style.color = 'var(--color-secondary-light)';
        }
    }
    
    closeItem(trigger, content) {
        trigger.setAttribute('aria-expanded', 'false');
        if (content) {
            content.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0px';
        }
        
        const icon = trigger.querySelector('.fact-item__icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.color = '';
        }
    }
}

/**
 * ============================================
 * CTA: Ripple va Glow effektlari
 * ============================================
 */
class CTAManager {
    constructor() {
        this.buttons = DOM.ctaButtons;
        this.init();
    }
    
    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', this.createRipple.bind(this));
        });
    }
    
    createRipple(e) {
        const button = e.currentTarget;
        const ripple = button.querySelector('.cta-button__ripple');
        
        if (!ripple) return;
        
        // Ripple uchun pozitsiya
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Ripple o'lchami
        const size = Math.max(rect.width, rect.height) * 1.5;
        
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Reflow
        void ripple.offsetWidth;
        
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
    }
}

/**
 * ============================================
 * SCROLL REVEAL: Intersection Observer
 * ============================================
 */
class ScrollRevealManager {
    constructor() {
        this.sections = DOM.sections;
        this.cards = DOM.subjectCards;
        this.init();
    }
    
    init() {
        // Sectionlar uchun
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        setTimeout(() => {
                            element.classList.add('revealed');
                        }, index * CONFIG.animationStagger);
                        sectionObserver.unobserve(element);
                    }
                });
            },
            {
                threshold: CONFIG.observerThreshold,
                rootMargin: CONFIG.observerRootMargin
            }
        );
        
        this.sections.forEach(section => {
            section.classList.add('scroll-reveal');
            sectionObserver.observe(section);
        });
        
        // Kartalar uchun
        const cardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const delay = index * CONFIG.animationStagger;
                        setTimeout(() => {
                            element.classList.add('revealed');
                            // Animatsiyadan keyin classni olib tashlash
                            setTimeout(() => {
                                element.classList.remove('scroll-reveal');
                            }, 800);
                        }, delay);
                        cardObserver.unobserve(element);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -30px 0px'
            }
        );
        
        this.cards.forEach(card => {
            card.classList.add('scroll-reveal', 'scroll-reveal--card');
            cardObserver.observe(card);
        });
    }
}

/**
 * ============================================
 * SUBJECT CARDS: Hover va interaktivlik
 * ============================================
 */
class SubjectCardManager {
    constructor() {
        this.cards = DOM.subjectCards;
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
        });
    }
    
    handleCardHover(e) {
        const card = e.currentTarget;
        const floats = card.querySelectorAll('.subject-card__float');
        const icon = card.querySelector('.subject-card__icon-wrapper');
        
        // Float iconlarni animatsiya
        floats.forEach((float, index) => {
            const duration = 1.5 + index * 0.3;
            const translateY = -10 + index * 5;
            float.style.transition = `transform ${duration}s ease`;
            float.style.transform = `translateY(${translateY}px) scale(1.1)`;
            float.style.opacity = '0.12';
        });
        
        // Icon animatsiyasi
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1.1) rotate(-5deg)';
            icon.style.background = 'rgba(74, 108, 247, 0.12)';
        }
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        const floats = card.querySelectorAll('.subject-card__float');
        const icon = card.querySelector('.subject-card__icon-wrapper');
        
        floats.forEach((float) => {
            float.style.transition = 'transform 1s ease, opacity 1s ease';
            float.style.transform = 'translateY(0) scale(1)';
            float.style.opacity = '0.06';
        });
        
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.background = '';
        }
    }
}

/**
 * ============================================
 * PAGE TRANSITION: Zipper uslubi
 * ============================================
 */
class PageTransitionManager {
    constructor() {
        this.isTransitioning = false;
        this.transitionElement = null;
        this.init();
    }
    
    init() {
        // Page transition uchun element yaratish
        this.createTransitionElement();
        
        // Barcha ichki linklarni qayta ishlash
        document.querySelectorAll('a[href^="./"]:not([target="_blank"])').forEach(link => {
            link.addEventListener('click', this.handleLinkClick.bind(this));
        });
        
        // Back/Forward uchun
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }
    
    createTransitionElement() {
        const div = document.createElement('div');
        div.className = 'page-transition';
        div.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            pointer-events: none;
            visibility: hidden;
            background: var(--color-primary);
            clip-path: inset(0 50% 0 50%);
            transition: clip-path 0.6s cubic-bezier(0.77, 0, 0.18, 1), visibility 0s 0.6s;
        `;
        
        document.body.appendChild(div);
        this.transitionElement = div;
    }
    
    handleLinkClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        // Anchor linklarni o'tkazib yuborish
        if (href.startsWith('#')) return;
        
        e.preventDefault();
        
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.playTransition('open', () => {
            window.location.href = href;
        });
    }
    
    handlePopState() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.playTransition('close', () => {
            this.isTransitioning = false;
        });
    }
    
    playTransition(direction, callback) {
        const element = this.transitionElement;
        if (!element) return;
        
        if (direction === 'open') {
            element.style.visibility = 'visible';
            element.style.clipPath = 'inset(0 0% 0 0%)';
            element.style.transition = 'clip-path 0.6s cubic-bezier(0.77, 0, 0.18, 1), visibility 0s 0s';
            
            setTimeout(() => {
                if (callback) callback();
            }, 600);
        } else {
            element.style.clipPath = 'inset(0 50% 0 50%)';
            element.style.transition = 'clip-path 0.6s cubic-bezier(0.77, 0, 0.18, 1), visibility 0s 0.6s';
            
            setTimeout(() => {
                element.style.visibility = 'hidden';
                if (callback) callback();
            }, 600);
        }
    }
    
    // Transitionni tashqaridan boshlash uchun
    triggerTransition(direction, callback) {
        this.playTransition(direction, callback);
    }
}

/**
 * ============================================
 * INITIALIZATION: Barcha managerlarni ishga tushirish
 * ============================================
 */
document.addEventListener('DOMContentLoaded', () => {
    // Header
    const headerManager = new HeaderManager();
    
    // Hero
    const heroManager = new HeroManager();
    
    // Statistics Counter
    const counterManager = new CounterManager();
    
    // Accordion
    const accordionManager = new AccordionManager();
    
    // CTA Ripple
    const ctaManager = new CTAManager();
    
    // Scroll Reveal
    const scrollRevealManager = new ScrollRevealManager();
    
    // Subject Cards
    const subjectCardManager = new SubjectCardManager();
    
    // Page Transition
    const pageTransitionManager = new PageTransitionManager();
    
    console.log('🚀 GrantWay platformasi muvaffaqiyatli yuklandi!');
    console.log('📊 Ma\'lumotlar:', examData);
});

/**
 * ============================================
 * EXPOSE: Global foydalanish uchun
 * ============================================
 */
window.GrantWay = {
    data: examData,
    config: CONFIG,
    version: '1.0.0'
};

/**
 * ============================================
 * PERFORMANCE: Lazy Loading
 * ============================================
 */
// Rasmlarni lazy loading
document.addEventListener('DOMContentLoaded', () => {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // Intersection Observer orqali lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});