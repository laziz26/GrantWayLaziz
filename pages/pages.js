'use strict';

/**
 * ============================================
 * PAGES.JS - Sahifalar uchun maxsus JavaScript
 * Matematika sahifasi funksiyalari
 * ============================================
 */

/**
 * ============================================
 * MATH COUNTER: Statistikani animatsiya qilish
 * ============================================
 */
class MathCounterManager {
    constructor() {
        this.counterElements = document.querySelectorAll('.math-statistic-item__number');
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
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = parseInt(element.getAttribute('data-duration'), 10) || 2000;
        const startTime = performance.now();
        const startValue = 0;
        
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
 * MATH ACCORDION: Bilasizmi faktlar
 * ============================================
 */
class MathAccordionManager {
    constructor() {
        this.triggers = document.querySelectorAll('.math-fact-item__trigger');
        this.init();
    }
    
    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', this.handleTriggerClick.bind(this));
        });
    }
    
    handleTriggerClick(e) {
        const trigger = e.currentTarget;
        const item = trigger.closest('.math-fact-item');
        const content = item.querySelector('.math-fact-item__content');
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
        
        const icon = trigger.querySelector('.math-fact-item__icon');
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, color 0.4s ease';
            icon.style.transform = 'scale(1.2) rotate(-15deg)';
            icon.style.color = 'var(--color-secondary-light)';
        }
    }
    
    closeItem(trigger, content) {
        trigger.setAttribute('aria-expanded', 'false');
        if (content) {
            content.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0px';
        }
        
        const icon = trigger.querySelector('.math-fact-item__icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.color = '';
        }
    }
}

/**
 * ============================================
 * FORMULA COPY: Formulalarni nusxalash
 * ============================================
 */
class FormulaCopyManager {
    constructor() {
        this.copyButtons = document.querySelectorAll('.formula-card__copy');
        this.init();
    }
    
    init() {
        this.copyButtons.forEach(button => {
            button.addEventListener('click', this.handleCopy.bind(this));
        });
    }
    
    handleCopy(e) {
        const button = e.currentTarget;
        const formula = button.getAttribute('data-formula');
        
        if (!formula) return;
        
        // Clipboard API orqali nusxalash
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(formula)
                .then(() => {
                    this.showCopiedFeedback(button);
                })
                .catch(() => {
                    this.fallbackCopy(formula, button);
                });
        } else {
            this.fallbackCopy(formula, button);
        }
    }
    
    fallbackCopy(text, button) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.showCopiedFeedback(button);
        } catch (err) {
            console.error('Nusxalash amalga oshmadi:', err);
        }
        
        document.body.removeChild(textarea);
    }
    
    showCopiedFeedback(button) {
        button.classList.add('formula-card__copy--copied');
        
        const tooltip = button.querySelector('.formula-card__copy-tooltip');
        if (tooltip) {
            const originalText = tooltip.textContent;
            tooltip.textContent = 'Nusxalandi ✓';
            
            setTimeout(() => {
                tooltip.textContent = originalText;
            }, 2000);
        }
        
        setTimeout(() => {
            button.classList.remove('formula-card__copy--copied');
        }, 2000);
    }
}

/**
 * ============================================
 * TOPIC CARDS: Mavzu kartalari interaktivligi
 * ============================================
 */
class TopicCardManager {
    constructor() {
        this.cards = document.querySelectorAll('.topic-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            
            const button = card.querySelector('.topic-card__button');
            if (button) {
                button.addEventListener('click', this.handleButtonClick.bind(this));
            }
        });
    }
    
    handleCardHover(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.topic-card__icon-wrapper');
        const button = card.querySelector('.topic-card__button');
        
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1.1) rotate(-5deg)';
            icon.style.background = 'rgba(74, 108, 247, 0.15)';
        }
        
        if (button) {
            button.style.transition = 'transform 0.3s ease';
            button.style.transform = 'scale(1.02)';
        }
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.topic-card__icon-wrapper');
        const button = card.querySelector('.topic-card__button');
        
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.background = '';
        }
        
        if (button) {
            button.style.transition = 'transform 0.3s ease';
            button.style.transform = 'scale(1)';
        }
    }
    
    handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const button = e.currentTarget;
        const card = button.closest('.topic-card');
        const topic = card.getAttribute('data-topic') || 'mavzu';
        
        // Ripple effekti
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple-effect 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        console.log(`📚 Mavzu boshlash: ${topic}`);
        
        // Page transition orqali test sahifasiga o'tish
        if (window.GrantWay && window.GrantWay.pageTransition) {
            window.GrantWay.pageTransition.triggerTransition('open', () => {
                window.location.href = '../testlar.html';
            });
        } else {
            window.location.href = '../testlar.html';
        }
    }
}

/**
 * ============================================
 * INITIALIZATION: Barcha managerlarni ishga tushirish
 * ============================================
 */
document.addEventListener('DOMContentLoaded', () => {
    // Math Counter
    const mathCounter = new MathCounterManager();
    
    // Math Accordion
    const mathAccordion = new MathAccordionManager();
    
    // Formula Copy
    const formulaCopy = new FormulaCopyManager();
    
    // Topic Cards
    const topicCards = new TopicCardManager();
    
    console.log('📐 Matematika sahifasi muvaffaqiyatli yuklandi!');
});

/**
 * ============================================
 * RIPPLE EFFECT: Global ripple animatsiyasi
 * ============================================
 */
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-effect {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

/**
 * ============================================
 * PAGE TRANSITION: Bosh sahifa bilan bog'lash
 * ============================================
 */
// Page transition manager-ni global qilish
if (window.GrantWay) {
    window.GrantWay.pageTransition = {
        triggerTransition: function(direction, callback) {
            const element = document.querySelector('.page-transition');
            if (!element) {
                if (callback) callback();
                return;
            }
            
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
    };
}
/**
 * ============================================
 * HISTORY COUNTER: Tarix statistikasi
 * ============================================
 */
class HistoryCounterManager {
    constructor() {
        this.counterElements = document.querySelectorAll('.history-statistic-item__number');
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
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = parseInt(element.getAttribute('data-duration'), 10) || 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
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
 * HISTORY ACCORDION: Tarix faktlari
 * ============================================
 */
class HistoryAccordionManager {
    constructor() {
        this.triggers = document.querySelectorAll('.history-fact-item__trigger');
        this.init();
    }
    
    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', this.handleTriggerClick.bind(this));
        });
    }
    
    handleTriggerClick(e) {
        const trigger = e.currentTarget;
        const item = trigger.closest('.history-fact-item');
        const content = item.querySelector('.history-fact-item__content');
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        
        if (!isExpanded) {
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
        
        const icon = trigger.querySelector('.history-fact-item__icon');
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, color 0.4s ease';
            icon.style.transform = 'scale(1.2) rotate(-15deg)';
            icon.style.color = 'var(--color-accent-light)';
        }
    }
    
    closeItem(trigger, content) {
        trigger.setAttribute('aria-expanded', 'false');
        if (content) {
            content.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0px';
        }
        
        const icon = trigger.querySelector('.history-fact-item__icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.color = '';
        }
    }
}

/**
 * ============================================
 * HISTORY TOPIC CARDS: Tarix mavzu kartalari
 * ============================================
 */
class HistoryTopicCardManager {
    constructor() {
        this.cards = document.querySelectorAll('.history-topic-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            
            const button = card.querySelector('.history-topic-card__button');
            if (button) {
                button.addEventListener('click', this.handleButtonClick.bind(this));
            }
        });
    }
    
    handleCardHover(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.history-topic-card__icon-wrapper');
        const button = card.querySelector('.history-topic-card__button');
        
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1.1) rotate(-5deg)';
            icon.style.background = 'rgba(212, 168, 32, 0.15)';
        }
        
        if (button) {
            button.style.transition = 'transform 0.3s ease';
            button.style.transform = 'scale(1.02)';
        }
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.history-topic-card__icon-wrapper');
        const button = card.querySelector('.history-topic-card__button');
        
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.background = '';
        }
        
        if (button) {
            button.style.transition = 'transform 0.3s ease';
            button.style.transform = 'scale(1)';
        }
    }
    
    handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const button = e.currentTarget;
        const card = button.closest('.history-topic-card');
        const topic = card.getAttribute('data-topic') || 'tarix-mavzu';
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple-effect 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        console.log(`📚 Tarix mavzusi boshlash: ${topic}`);
        
        if (window.GrantWay && window.GrantWay.pageTransition) {
            window.GrantWay.pageTransition.triggerTransition('open', () => {
                window.location.href = '../testlar.html';
            });
        } else {
            window.location.href = '../testlar.html';
        }
    }
}

// Initialize History specific managers
document.addEventListener('DOMContentLoaded', () => {
    // Tarix Counter
    const historyCounter = new HistoryCounterManager();
    
    // Tarix Accordion
    const historyAccordion = new HistoryAccordionManager();
    
    // Tarix Topic Cards
    const historyTopicCards = new HistoryTopicCardManager();
    
    console.log('📜 Tarix sahifasi muvaffaqiyatli yuklandi!');
});
/**
 * ============================================
 * LANGUAGE COUNTER: Ona tili statistikasi
 * ============================================
 */
class LanguageCounterManager {
    constructor() {
        this.counterElements = document.querySelectorAll('.language-statistic-item__number');
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
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = parseInt(element.getAttribute('data-duration'), 10) || 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
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
 * LANGUAGE ACCORDION: Ona tili faktlari
 * ============================================
 */
class LanguageAccordionManager {
    constructor() {
        this.triggers = document.querySelectorAll('.language-fact-item__trigger');
        this.init();
    }
    
    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', this.handleTriggerClick.bind(this));
        });
    }
    
    handleTriggerClick(e) {
        const trigger = e.currentTarget;
        const item = trigger.closest('.language-fact-item');
        const content = item.querySelector('.language-fact-item__content');
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        
        if (!isExpanded) {
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
        
        const icon = trigger.querySelector('.language-fact-item__icon');
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, color 0.4s ease';
            icon.style.transform = 'scale(1.2) rotate(-15deg)';
            icon.style.color = '#27ae60';
        }
    }
    
    closeItem(trigger, content) {
        trigger.setAttribute('aria-expanded', 'false');
        if (content) {
            content.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0px';
        }
        
        const icon = trigger.querySelector('.language-fact-item__icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.color = '';
        }
    }
}

/**
 * ============================================
 * LANGUAGE TOPIC CARDS: Ona tili mavzu kartalari
 * ============================================
 */
class LanguageTopicCardManager {
    constructor() {
        this.cards = document.querySelectorAll('.language-topic-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            
            const button = card.querySelector('.language-topic-card__button');
            if (button) {
                button.addEventListener('click', this.handleButtonClick.bind(this));
            }
        });
    }
    
    handleCardHover(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.language-topic-card__icon-wrapper');
        const button = card.querySelector('.language-topic-card__button');
        
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1.1) rotate(-5deg)';
            icon.style.background = 'rgba(46, 204, 113, 0.15)';
        }
        
        if (button) {
            button.style.transition = 'transform 0.3s ease';
            button.style.transform = 'scale(1.02)';
        }
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.language-topic-card__icon-wrapper');
        const button = card.querySelector('.language-topic-card__button');
        
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.background = '';
        }
        
        if (button) {
            button.style.transition = 'transform 0.3s ease';
            button.style.transform = 'scale(1)';
        }
    }
    
    handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const button = e.currentTarget;
        const card = button.closest('.language-topic-card');
        const topic = card.getAttribute('data-topic') || 'ona-tili-mavzu';
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple-effect 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        console.log(`📚 Ona tili mavzusi boshlash: ${topic}`);
        
        if (window.GrantWay && window.GrantWay.pageTransition) {
            window.GrantWay.pageTransition.triggerTransition('open', () => {
                window.location.href = '../testlar.html';
            });
        } else {
            window.location.href = '../testlar.html';
        }
    }
}

// Initialize Language specific managers
document.addEventListener('DOMContentLoaded', () => {
    // Ona tili Counter
    const languageCounter = new LanguageCounterManager();
    
    // Ona tili Accordion
    const languageAccordion = new LanguageAccordionManager();
    
    // Ona tili Topic Cards
    const languageTopicCards = new LanguageTopicCardManager();
    
    console.log('📝 Ona tili sahifasi muvaffaqiyatli yuklandi!');
});
/**
 * ============================================
 * CHEMISTRY COUNTER: Kimyo statistikasi
 * ============================================
 */
class ChemistryCounterManager {
    constructor() {
        this.counterElements = document.querySelectorAll('.chemistry-statistic-item__number');
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
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = parseInt(element.getAttribute('data-duration'), 10) || 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
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
 * CHEMISTRY ACCORDION: Kimyo faktlari
 * ============================================
 */
class ChemistryAccordionManager {
    constructor() {
        this.triggers = document.querySelectorAll('.chemistry-fact-item__trigger');
        this.init();
    }
    
    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', this.handleTriggerClick.bind(this));
        });
    }
    
    handleTriggerClick(e) {
        const trigger = e.currentTarget;
        const item = trigger.closest('.chemistry-fact-item');
        const content = item.querySelector('.chemistry-fact-item__content');
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        
        if (!isExpanded) {
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
        
        const icon = trigger.querySelector('.chemistry-fact-item__icon');
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, color 0.4s ease';
            icon.style.transform = 'scale(1.2) rotate(-15deg)';
            icon.style.color = '#c0392b';
        }
    }
    
    closeItem(trigger, content) {
        trigger.setAttribute('aria-expanded', 'false');
        if (content) {
            content.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0px';
        }
        
        const icon = trigger.querySelector('.chemistry-fact-item__icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.color = '';
        }
    }
}

/**
 * ============================================
 * CHEMISTRY FORMULA COPY: Formulalarni nusxalash
 * ============================================
 */
class ChemistryFormulaCopyManager {
    constructor() {
        this.copyButtons = document.querySelectorAll('.chemistry-formula-card__copy');
        this.init();
    }
    
    init() {
        this.copyButtons.forEach(button => {
            button.addEventListener('click', this.handleCopy.bind(this));
        });
    }
    
    handleCopy(e) {
        const button = e.currentTarget;
        const formula = button.getAttribute('data-formula');
        
        if (!formula) return;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(formula)
                .then(() => {
                    this.showCopiedFeedback(button);
                })
                .catch(() => {
                    this.fallbackCopy(formula, button);
                });
        } else {
            this.fallbackCopy(formula, button);
        }
    }
    
    fallbackCopy(text, button) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.showCopiedFeedback(button);
        } catch (err) {
            console.error('Nusxalash amalga oshmadi:', err);
        }
        
        document.body.removeChild(textarea);
    }
    
    showCopiedFeedback(button) {
        const originalHtml = button.innerHTML;
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 10L8 14L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        `;
        button.style.color = 'var(--color-accent)';
        
        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.style.color = '';
        }, 2000);
    }
}

/**
 * ============================================
 * CHEMISTRY TOPIC CARDS: Kimyo mavzu kartalari
 * ============================================
 */
class ChemistryTopicCardManager {
    constructor() {
        this.cards = document.querySelectorAll('.chemistry-topic-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            
            const button = card.querySelector('.chemistry-topic-card__button');
            if (button) {
                button.addEventListener('click', this.handleButtonClick.bind(this));
            }
        });
    }
    
    handleCardHover(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.chemistry-topic-card__icon-wrapper');
        const button = card.querySelector('.chemistry-topic-card__button');
        
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1.1) rotate(-5deg)';
            icon.style.background = 'rgba(231, 76, 60, 0.15)';
        }
        
        if (button) {
            button.style.transition = 'transform 0.3s ease';
            button.style.transform = 'scale(1.02)';
        }
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.chemistry-topic-card__icon-wrapper');
        const button = card.querySelector('.chemistry-topic-card__button');
        
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.background = '';
        }
        
        if (button) {
            button.style.transition = 'transform 0.3s ease';
            button.style.transform = 'scale(1)';
        }
    }
    
    handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const button = e.currentTarget;
        const card = button.closest('.chemistry-topic-card');
        const topic = card.getAttribute('data-topic') || 'kimyo-mavzu';
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple-effect 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        console.log(`📚 Kimyo mavzusi boshlash: ${topic}`);
        
        if (window.GrantWay && window.GrantWay.pageTransition) {
            window.GrantWay.pageTransition.triggerTransition('open', () => {
                window.location.href = '../testlar.html';
            });
        } else {
            window.location.href = '../testlar.html';
        }
    }
}

// Initialize Chemistry specific managers
document.addEventListener('DOMContentLoaded', () => {
    // Kimyo Counter
    const chemistryCounter = new ChemistryCounterManager();
    
    // Kimyo Accordion
    const chemistryAccordion = new ChemistryAccordionManager();
    
    // Kimyo Formula Copy
    const chemistryFormulaCopy = new ChemistryFormulaCopyManager();
    
    // Kimyo Topic Cards
    const chemistryTopicCards = new ChemistryTopicCardManager();
    
    console.log('⚗️ Kimyo sahifasi muvaffaqiyatli yuklandi!');
});
/**
 * ============================================
 * ENGLISH COUNTER: Ingliz tili statistikasi
 * ============================================
 */
class EnglishCounterManager {
    constructor() {
        this.counterElements = document.querySelectorAll('.english-statistic-item__number');
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
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = parseInt(element.getAttribute('data-duration'), 10) || 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
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
 * ENGLISH ACCORDION: Ingliz tili faktlari
 * ============================================
 */
class EnglishAccordionManager {
    constructor() {
        this.triggers = document.querySelectorAll('.english-fact-item__trigger');
        this.init();
    }
    
    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', this.handleTriggerClick.bind(this));
        });
    }
    
    handleTriggerClick(e) {
        const trigger = e.currentTarget;
        const item = trigger.closest('.english-fact-item');
        const content = item.querySelector('.english-fact-item__content');
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        
        if (!isExpanded) {
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
        
        const icon = trigger.querySelector('.english-fact-item__icon');
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, color 0.4s ease';
            icon.style.transform = 'scale(1.2) rotate(-15deg)';
            icon.style.color = '#d35400';
        }
    }
    
    closeItem(trigger, content) {
        trigger.setAttribute('aria-expanded', 'false');
        if (content) {
            content.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0px';
        }
        
        const icon = trigger.querySelector('.english-fact-item__icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.color = '';
        }
    }
}

/**
 * ============================================
 * ENGLISH TOPIC CARDS: Ingliz tili mavzu kartalari
 * ============================================
 */
class EnglishTopicCardManager {
    constructor() {
        this.cards = document.querySelectorAll('.english-topic-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            
            const button = card.querySelector('.english-topic-card__button');
            if (button) {
                button.addEventListener('click', this.handleButtonClick.bind(this));
            }
        });
    }
    
    handleCardHover(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.english-topic-card__icon-wrapper');
        const button = card.querySelector('.english-topic-card__button');
        
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1.1) rotate(-5deg)';
            icon.style.background = 'rgba(230, 126, 34, 0.15)';
        }
        
        if (button) {
            button.style.transition = 'transform 0.3s ease';
            button.style.transform = 'scale(1.02)';
        }
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.english-topic-card__icon-wrapper');
        const button = card.querySelector('.english-topic-card__button');
        
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, background 0.4s ease';
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.background = '';
        }
        
        if (button) {
            button.style.transition = 'transform 0.3s ease';
            button.style.transform = 'scale(1)';
        }
    }
    
    handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const button = e.currentTarget;
        const card = button.closest('.english-topic-card');
        const topic = card.getAttribute('data-topic') || 'ingliz-mavzu';
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple-effect 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        console.log(`📚 Ingliz tili mavzusi boshlash: ${topic}`);
        
        if (window.GrantWay && window.GrantWay.pageTransition) {
            window.GrantWay.pageTransition.triggerTransition('open', () => {
                window.location.href = '../testlar.html';
            });
        } else {
            window.location.href = '../testlar.html';
        }
    }
}

// Initialize English specific managers
document.addEventListener('DOMContentLoaded', () => {
    // Ingliz tili Counter
    const englishCounter = new EnglishCounterManager();
    
    // Ingliz tili Accordion
    const englishAccordion = new EnglishAccordionManager();
    
    // Ingliz tili Topic Cards
    const englishTopicCards = new EnglishTopicCardManager();
    
    console.log('📖 Ingliz tili sahifasi muvaffaqiyatli yuklandi!');
});
/**
 * ============================================
 * TESTS STATS COUNTER: Test statistikasi
 * ============================================
 */
class TestsStatsManager {
    constructor() {
        this.counterElements = document.querySelectorAll('.tests-stats-item__number');
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
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = parseInt(element.getAttribute('data-duration'), 10) || 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
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
 * TESTS FILTER: Fanlar bo'yicha filtr
 * ============================================
 */
class TestsFilterManager {
    constructor() {
        this.tabs = document.querySelectorAll('.tests-filter__tab');
        this.cards = document.querySelectorAll('.test-card');
        this.searchInput = document.querySelector('.tests-filter__input');
        this.init();
    }
    
    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', this.handleTabClick.bind(this));
        });
        
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.handleSearch.bind(this));
        }
    }
    
    handleTabClick(e) {
        const tab = e.currentTarget;
        const filter = tab.getAttribute('data-filter');
        
        // Tablarni yangilash
        this.tabs.forEach(t => {
            t.classList.remove('tests-filter__tab--active');
            t.setAttribute('aria-selected', 'false');
        });
        
        tab.classList.add('tests-filter__tab--active');
        tab.setAttribute('aria-selected', 'true');
        
        // Kartalarni filtr qilish
        this.filterCards(filter);
    }
    
    handleSearch(e) {
        const query = e.currentTarget.value.toLowerCase().trim();
        const activeTab = document.querySelector('.tests-filter__tab--active');
        const filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
        
        this.filterCards(filter, query);
    }
    
    filterCards(filter, query = '') {
        this.cards.forEach(card => {
            const subject = card.getAttribute('data-subject');
            const title = card.querySelector('.test-card__title')?.textContent?.toLowerCase() || '';
            const description = card.querySelector('.test-card__description')?.textContent?.toLowerCase() || '';
            
            const matchFilter = filter === 'all' || subject === filter;
            const matchSearch = !query || title.includes(query) || description.includes(query);
            
            if (matchFilter && matchSearch) {
                card.style.display = '';
                card.style.animation = 'fade-up 0.4s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

/**
 * ============================================
 * TESTS LOADMORE: Ko'proq testlar
 * ============================================
 */
class TestsLoadmoreManager {
    constructor() {
        this.button = document.querySelector('.tests-loadmore__button');
        this.hiddenCards = [];
        this.currentIndex = 0;
        this.batchSize = 6;
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        // Barcha kartalarni olish va boshlang'ich holatni saqlash
        this.hiddenCards = Array.from(document.querySelectorAll('.test-card'));
        this.currentIndex = this.batchSize;
        
        // Dastlab faqat birinchi partiyani ko'rsatish
        this.hiddenCards.forEach((card, index) => {
            if (index >= this.batchSize) {
                card.style.display = 'none';
            }
        });
        
        // Yuklash tugmasi
        this.button.addEventListener('click', this.loadMore.bind(this));
        
        // Agar barcha kartalar ko'rsatilgan bo'lsa, tugmani yashirish
        this.updateButtonVisibility();
    }
    
    loadMore() {
        const nextBatch = this.hiddenCards.slice(this.currentIndex, this.currentIndex + this.batchSize);
        
        nextBatch.forEach(card => {
            card.style.display = '';
            card.style.animation = 'fade-up 0.4s ease forwards';
        });
        
        this.currentIndex += this.batchSize;
        this.updateButtonVisibility();
    }
    
    updateButtonVisibility() {
        if (this.currentIndex >= this.hiddenCards.length) {
            this.button.style.display = 'none';
        } else {
            this.button.style.display = 'inline-flex';
            const remaining = this.hiddenCards.length - this.currentIndex;
            this.button.querySelector('span').textContent = `Yana ${remaining} ta testni yuklash`;
        }
    }
}

/**
 * ============================================
 * TESTS CARD: Test kartalari interaktivligi
 * ============================================
 */
class TestsCardManager {
    constructor() {
        this.cards = document.querySelectorAll('.test-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            const button = card.querySelector('.test-card__button');
            if (button) {
                button.addEventListener('click', this.handleButtonClick.bind(this));
            }
        });
    }
    
    handleButtonClick(e) {
        e.stopPropagation();
        
        const button = e.currentTarget;
        const card = button.closest('.test-card');
        const title = card.querySelector('.test-card__title')?.textContent || 'Test';
        
        // Ripple effekti
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple-effect 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        console.log(`📝 Test boshlash: ${title}`);
        
        // Page transition orqali test sahifasiga o'tish
        if (window.GrantWay && window.GrantWay.pageTransition) {
            window.GrantWay.pageTransition.triggerTransition('open', () => {
                window.location.href = '#';
            });
        }
    }
}

// Initialize Tests specific managers
document.addEventListener('DOMContentLoaded', () => {
    // Test statistikasi Counter
    const testsStats = new TestsStatsManager();
    
    // Test filtri
    const testsFilter = new TestsFilterManager();
    
    // Test yuklash
    const testsLoadmore = new TestsLoadmoreManager();
    
    // Test kartalari
    const testsCard = new TestsCardManager();
    
    console.log('📝 Testlar sahifasi muvaffaqiyatli yuklandi!');
});
/**
 * ============================================
 * NEWS FILTER: Yangiliklar filtri
 * ============================================
 */
class NewsFilterManager {
    constructor() {
        this.tabs = document.querySelectorAll('.news-filter__tab');
        this.cards = document.querySelectorAll('.news-card');
        this.init();
    }
    
    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', this.handleTabClick.bind(this));
        });
    }
    
    handleTabClick(e) {
        const tab = e.currentTarget;
        const filter = tab.getAttribute('data-filter');
        
        // Tablarni yangilash
        this.tabs.forEach(t => {
            t.classList.remove('news-filter__tab--active');
            t.setAttribute('aria-selected', 'false');
        });
        
        tab.classList.add('news-filter__tab--active');
        tab.setAttribute('aria-selected', 'true');
        
        // Yangiliklarni filtr qilish
        this.filterCards(filter);
    }
    
    filterCards(filter) {
        this.cards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = '';
                card.style.animation = 'fade-up 0.4s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

/**
 * ============================================
 * NEWS LOADMORE: Ko'proq yangiliklar
 * ============================================
 */
class NewsLoadmoreManager {
    constructor() {
        this.button = document.querySelector('.news-loadmore__button');
        this.hiddenCards = [];
        this.currentIndex = 0;
        this.batchSize = 6;
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        // Barcha kartalarni olish va boshlang'ich holatni saqlash
        this.hiddenCards = Array.from(document.querySelectorAll('.news-card'));
        this.currentIndex = this.batchSize;
        
        // Dastlab faqat birinchi partiyani ko'rsatish
        this.hiddenCards.forEach((card, index) => {
            if (index >= this.batchSize) {
                card.style.display = 'none';
            }
        });
        
        // Yuklash tugmasi
        this.button.addEventListener('click', this.loadMore.bind(this));
        
        // Agar barcha kartalar ko'rsatilgan bo'lsa, tugmani yashirish
        this.updateButtonVisibility();
    }
    
    loadMore() {
        const nextBatch = this.hiddenCards.slice(this.currentIndex, this.currentIndex + this.batchSize);
        
        nextBatch.forEach(card => {
            card.style.display = '';
            card.style.animation = 'fade-up 0.4s ease forwards';
        });
        
        this.currentIndex += this.batchSize;
        this.updateButtonVisibility();
    }
    
    updateButtonVisibility() {
        if (this.currentIndex >= this.hiddenCards.length) {
            this.button.style.display = 'none';
        } else {
            this.button.style.display = 'inline-flex';
            const remaining = this.hiddenCards.length - this.currentIndex;
            this.button.querySelector('span').textContent = `Yana ${remaining} ta yangilikni yuklash`;
        }
    }
}

/**
 * ============================================
 * NEWS SUBSCRIBE: Obuna bo'lish formasi
 * ============================================
 */
class NewsSubscribeManager {
    constructor() {
        this.form = document.querySelector('.news-subscribe__form');
        this.input = document.querySelector('.news-subscribe__input');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const email = this.input.value.trim();
        
        if (!email || !this.isValidEmail(email)) {
            this.showMessage('Iltimos, to\'g\'ri email manzil kiriting', 'error');
            return;
        }
        
        // Simulyatsiya qilingan obuna
        const button = this.form.querySelector('button');
        const originalText = button.textContent;
        
        button.disabled = true;
        button.innerHTML = '<span class="cta-button__text">Yuborilmoqda...</span>';
        
        setTimeout(() => {
            this.showMessage('✅ Obuna muvaffaqiyatli amalga oshirildi!', 'success');
            this.input.value = '';
            
            button.disabled = false;
            button.innerHTML = originalText;
        }, 1500);
    }
    
    isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }
    
    showMessage(text, type) {
        // Eski xabarni o'chirish
        const existing = this.form.querySelector('.news-subscribe__message');
        if (existing) existing.remove();
        
        const message = document.createElement('div');
        message.className = 'news-subscribe__message';
        message.style.cssText = `
            margin-top: var(--spacing-3);
            padding: var(--spacing-2) var(--spacing-4);
            border-radius: var(--radius-full);
            font-size: var(--font-size-sm);
            text-align: center;
        `;
        
        if (type === 'success') {
            message.style.background = 'rgba(46, 204, 113, 0.15)';
            message.style.color = '#2ecc71';
        } else {
            message.style.background = 'rgba(231, 76, 60, 0.15)';
            message.style.color = '#e74c3c';
        }
        
        message.textContent = text;
        this.form.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.style.opacity = '0';
                message.style.transition = 'opacity 0.4s ease';
                setTimeout(() => {
                    if (message.parentNode) message.remove();
                }, 400);
            }
        }, 3000);
    }
}

/**
 * ============================================
 * NEWS CARD: Yangilik kartalari interaktivligi
 * ============================================
 */
class NewsCardManager {
    constructor() {
        this.cards = document.querySelectorAll('.news-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            const link = card.querySelector('.news-card__link');
            if (link) {
                link.addEventListener('click', this.handleLinkClick.bind(this));
            }
            
            // Hover effekti uchun
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
        });
    }
    
    handleLinkClick(e) {
        e.preventDefault();
        
        const link = e.currentTarget;
        const card = link.closest('.news-card');
        const title = card.querySelector('.news-card__title')?.textContent || 'Yangilik';
        
        console.log(`📰 Yangilik o'qish: ${title}`);
        
        // Page transition orqali ochish
        if (window.GrantWay && window.GrantWay.pageTransition) {
            window.GrantWay.pageTransition.triggerTransition('open', () => {
                window.location.href = '#';
            });
        }
    }
    
    handleCardHover(e) {
        const card = e.currentTarget;
        const image = card.querySelector('.news-card__image');
        const link = card.querySelector('.news-card__link span');
        
        if (image) {
            image.style.transition = 'transform 0.6s ease';
        }
        
        if (link) {
            link.style.transition = 'transform 0.3s ease';
            link.style.transform = 'translateX(4px)';
        }
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        const image = card.querySelector('.news-card__image');
        const link = card.querySelector('.news-card__link span');
        
        if (image) {
            image.style.transform = 'scale(1)';
        }
        
        if (link) {
            link.style.transform = 'translateX(0)';
        }
    }
}

// Initialize News specific managers
document.addEventListener('DOMContentLoaded', () => {
    // Yangiliklar filtri
    const newsFilter = new NewsFilterManager();
    
    // Yangiliklar yuklash
    const newsLoadmore = new NewsLoadmoreManager();
    
    // Obuna formasi
    const newsSubscribe = new NewsSubscribeManager();
    
    // Yangilik kartalari
    const newsCard = new NewsCardManager();
    
    console.log('📰 Yangiliklar sahifasi muvaffaqiyatli yuklandi!');
});
/**
 * ============================================
 * CONTACT FORM: Aloqa formasini boshqarish
 * ============================================
 */
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.fields = {
            name: document.getElementById('contactName'),
            email: document.getElementById('contactEmail'),
            subject: document.getElementById('contactSubject'),
            message: document.getElementById('contactMessage')
        };
        this.successMessage = this.form.querySelector('.contact-form__success');
        this.submitButton = this.form.querySelector('.contact-form__submit');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        // Real-time validation
        Object.values(this.fields).forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (field.closest('.contact-form__group--error')) {
                    this.validateField(field);
                }
            });
        });
        
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    validateField(field) {
        const group = field.closest('.contact-form__group');
        const errorElement = group.querySelector('.contact-form__error');
        let isValid = true;
        let errorMessage = '';
        
        if (field === this.fields.name) {
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Ismingizni kiriting';
            } else if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Ism 2 ta harfdan kam bo\'lmasligi kerak';
            }
        } else if (field === this.fields.email) {
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Email manzilni kiriting';
            } else if (!this.isValidEmail(field.value.trim())) {
                isValid = false;
                errorMessage = 'To\'g\'ri email manzil kiriting';
            }
        } else if (field === this.fields.subject) {
            if (!field.value) {
                isValid = false;
                errorMessage = 'Mavzuni tanlang';
            }
        } else if (field === this.fields.message) {
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Xabarni kiriting';
            } else if (field.value.trim().length < 10) {
                isValid = false;
                errorMessage = 'Xabar 10 ta harfdan kam bo\'lmasligi kerak';
            }
        }
        
        if (!isValid) {
            group.classList.add('contact-form__group--error');
            errorElement.textContent = errorMessage;
        } else {
            group.classList.remove('contact-form__group--error');
            errorElement.textContent = '';
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }
    
    validateForm() {
        let allValid = true;
        
        Object.values(this.fields).forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        return allValid;
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validatsiya
        if (!this.validateForm()) {
            // Birinchi xatolikli fieldga fokus
            const firstError = this.form.querySelector('.contact-form__group--error .contact-form__input, .contact-form__group--error .contact-form__select, .contact-form__group--error .contact-form__textarea');
            if (firstError) {
                firstError.focus();
            }
            return;
        }
        
        // Forma ma'lumotlarini yig'ish
        const formData = {
            name: this.fields.name.value.trim(),
            email: this.fields.email.value.trim(),
            subject: this.fields.subject.value,
            message: this.fields.message.value.trim()
        };
        
        console.log('📨 Xabar yuborildi:', formData);
        
        // Yuborish animatsiyasi
        this.submitButton.disabled = true;
        const originalText = this.submitButton.querySelector('.cta-button__text').textContent;
        this.submitButton.querySelector('.cta-button__text').textContent = 'Yuborilmoqda...';
        
        // Simulyatsiya qilingan yuborish
        setTimeout(() => {
            // Muvaffaqiyat
            this.successMessage.style.display = 'flex';
            this.successMessage.style.animation = 'fade-up 0.4s ease forwards';
            
            // Formani tozalash
            this.form.reset();
            
            // Tugmani qayta tiklash
            this.submitButton.disabled = false;
            this.submitButton.querySelector('.cta-button__text').textContent = originalText;
            
            // Barcha error classlarni olib tashlash
            this.form.querySelectorAll('.contact-form__group--error').forEach(el => {
                el.classList.remove('contact-form__group--error');
            });
            
            // 5 soniyadan keyin muvaffaqiyat xabarini yashirish
            setTimeout(() => {
                this.successMessage.style.opacity = '0';
                this.successMessage.style.transition = 'opacity 0.4s ease';
                setTimeout(() => {
                    this.successMessage.style.display = 'none';
                    this.successMessage.style.opacity = '1';
                }, 400);
            }, 5000);
        }, 1800);
    }
}

/**
 * ============================================
 * CONTACT FAQ ACCORDION: Savol-javoblar
 * ============================================
 */
class ContactFaqManager {
    constructor() {
        this.triggers = document.querySelectorAll('.faq-item__trigger');
        this.init();
    }
    
    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', this.handleTriggerClick.bind(this));
        });
    }
    
    handleTriggerClick(e) {
        const trigger = e.currentTarget;
        const item = trigger.closest('.faq-item');
        const content = item.querySelector('.faq-item__content');
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
        
        const icon = trigger.querySelector('.faq-item__icon');
        if (icon) {
            icon.style.transition = 'transform 0.4s ease, color 0.4s ease';
            icon.style.transform = 'scale(1.2) rotate(-15deg)';
            icon.style.color = 'var(--color-secondary-light)';
        }
    }
    
    closeItem(trigger, content) {
        trigger.setAttribute('aria-expanded', 'false');
        if (content) {
            content.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0px';
        }
        
        const icon = trigger.querySelector('.faq-item__icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.color = '';
        }
    }
}

/**
 * ============================================
 * CONTACT SOCIAL: Ijtimoiy tarmoqlar hover effekti
 * ============================================
 */
class ContactSocialManager {
    constructor() {
        this.links = document.querySelectorAll('.contact-info__social-link');
        this.init();
    }
    
    init() {
        this.links.forEach(link => {
            link.addEventListener('mouseenter', this.handleHover.bind(this));
            link.addEventListener('mouseleave', this.handleLeave.bind(this));
        });
    }
    
    handleHover(e) {
        const link = e.currentTarget;
        const svg = link.querySelector('svg');
        
        if (svg) {
            svg.style.transition = 'transform 0.3s ease';
            svg.style.transform = 'scale(1.1)';
        }
    }
    
    handleLeave(e) {
        const link = e.currentTarget;
        const svg = link.querySelector('svg');
        
        if (svg) {
            svg.style.transform = 'scale(1)';
        }
    }
}

// Initialize Contact specific managers
document.addEventListener('DOMContentLoaded', () => {
    // Aloqa formasi
    const contactForm = new ContactFormManager();
    
    // FAQ Accordion
    const contactFaq = new ContactFaqManager();
    
    // Ijtimoiy tarmoqlar
    const contactSocial = new ContactSocialManager();
    
    console.log('📞 Aloqa sahifasi muvaffaqiyatli yuklandi!');
});


/**
 * ============================================
 * FANLAR STATISTIKA COUNTER
 * ============================================
 */
class FanlarCounterManager {
    constructor() {
        this.counterElements = document.querySelectorAll('.fanlar-statistic-item__number');
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
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = parseInt(element.getAttribute('data-duration'), 10) || 1500;
        const startTime = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const fanlarCounter = new FanlarCounterManager();
    console.log('📚 Fanlar sahifasi muvaffaqiyatli yuklandi!');
});