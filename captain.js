// ============================================
// OPTIMIZED PORTFOLIO SCRIPT
// Single IIFE for better performance
// ============================================

(function() {
    'use strict';
    
    // ========== DOM ELEMENTS CACHE ==========
    let typedTextElement = null;
    let cursorElement = null;
    let modal = null;
    let modalImg = null;
    let toggleBtn = null;
    let navLinks = null;
    
    // ========== CONFIGURATION ==========
    const CONFIG = {
        // Title Manager
        originalTitle: "Mwangi Josphat Karanja | React Full Stack Developer",
        // Typing Effect
        typingSpeed: 100,
        deletingSpeed: 50,
        pauseAfterTyping: 2000,
        pauseBeforeNext: 500,
        startDelay: 500,
        // Toast
        toastAutoClose: 3000,
        maxToasts: 3,
        // DevTools detection interval (reduced frequency)
        devToolsInterval: 2000
    };
    
    // Roles for typing effect
    const ROLES = [
        "React Full Stack Developer",
        "SQL Database Designer",
        "MongoDB Architect",
        "PHP & Django Developer",
        "Mobile App Developer",
        "UI/UX Enthusiast"
    ];
    
    // ========== UTILITY FUNCTIONS ==========
    
    // Debounce function for scroll events
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
    
    // ========== TITLE MANAGER ==========
    function initTitleManager() {
        let isBlurred = false;
        let titleTimeout = null;
        
        document.title = CONFIG.originalTitle;
        
        window.addEventListener('blur', () => {
            isBlurred = true;
            document.title = "👋 Come back! We miss you...";
            
            if (titleTimeout) clearTimeout(titleTimeout);
            titleTimeout = setTimeout(() => {
                if (isBlurred) {
                    document.title = "✨ Mwangi Josphat | Portfolio";
                }
            }, 5000);
        });
        
        window.addEventListener('focus', () => {
            isBlurred = false;
            if (titleTimeout) clearTimeout(titleTimeout);
            document.title = CONFIG.originalTitle;
        });
        
        // Optimized scroll title change with debounce
        const handleScroll = debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 100 && !isBlurred && document.title !== "📜 Scrolling Portfolio...") {
                document.title = "📜 Scrolling Portfolio...";
                setTimeout(() => {
                    if (!isBlurred && document.title === "📜 Scrolling Portfolio...") {
                        document.title = CONFIG.originalTitle;
                    }
                }, 1500);
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    // ========== TYPING EFFECT ==========
    function initTypingEffect() {
        typedTextElement = document.querySelector('.typed-text');
        cursorElement = document.querySelector('.cursor-blink');
        
        if (!typedTextElement) return;
        
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeoutId = null;
        
        function typeEffect() {
            const currentRole = ROLES[roleIndex];
            
            if (isDeleting) {
                typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                timeoutId = setTimeout(typeEffect, CONFIG.deletingSpeed);
            } else {
                typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                timeoutId = setTimeout(typeEffect, CONFIG.typingSpeed);
            }
            
            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(typeEffect, CONFIG.pauseAfterTyping);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % ROLES.length;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(typeEffect, CONFIG.pauseBeforeNext);
            }
        }
        
        setTimeout(typeEffect, CONFIG.startDelay);
    }
    
    // ========== TOAST NOTIFICATION ==========
    let toastTimeoutIds = new Set();
    
    window.showToast = function(title, message, type = 'warning') {
        const existingToasts = document.querySelectorAll('.toast-notification');
        if (existingToasts.length >= CONFIG.maxToasts) {
            existingToasts[0].remove();
        }
        
        const toast = document.createElement('div');
        const iconMap = { warning: '⚠️', error: '🚫', info: 'ℹ️' };
        const icon = iconMap[type] || '🔒';
        
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${escapeHtml(title)}</div>
                <div class="toast-message">${escapeHtml(message)}</div>
            </div>
            <div class="toast-close">✕</div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
        
        const autoCloseId = setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
            toastTimeoutIds.delete(autoCloseId);
        }, CONFIG.toastAutoClose);
        
        toastTimeoutIds.add(autoCloseId);
    };
    
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // ========== SECURITY & PROTECTION ==========
    function initSecurity() {
        let devToolsOpen = false;
        let devToolsInterval = null;
        let consoleInterval = null;
        
        function blockAction(actionName, details = '') {
            window.showToast('⛔ Action Blocked', `${actionName} is not allowed on this site.${details ? ' ' + details : ''}`, 'error');
            return false;
        }
        
        // Right click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            blockAction('Right Click', 'Context menu is disabled.');
            return false;
        });
        
        // Keyboard shortcuts (optimized with Set for faster lookups)
        const blockedKeys = new Set(['F12', 'PrintScreen']);
        const blockedCombos = [
            { ctrl: true, shift: true, key: 'I', code: 73, name: 'Inspect Element' },
            { ctrl: true, shift: true, key: 'J', code: 74, name: 'JavaScript Console' },
            { ctrl: true, shift: true, key: 'C', code: 67, name: 'Element Inspector' },
            { ctrl: true, key: 'U', code: 85, name: 'View Source' },
            { ctrl: true, key: 'S', code: 83, name: 'Save Page' },
            { ctrl: true, key: 'P', code: 80, name: 'Print' },
            { ctrl: true, key: 'C', code: 67, name: 'Copy', isCopy: true },
            { ctrl: true, key: 'X', code: 88, name: 'Cut', isCut: true }
        ];
        
        document.addEventListener('keydown', (e) => {
            // F12
            if (e.key === 'F12' || e.keyCode === 123) {
                e.preventDefault();
                blockAction('Developer Tools', 'F12 shortcut is disabled.');
                return false;
            }
            
            for (const combo of blockedCombos) {
                const ctrlMatch = !combo.ctrl || e.ctrlKey;
                const shiftMatch = !combo.shift || e.shiftKey;
                const keyMatch = (combo.key && (e.key === combo.key || e.key === combo.key.toUpperCase())) || (combo.code && e.keyCode === combo.code);
                
                if (ctrlMatch && shiftMatch && keyMatch) {
                    e.preventDefault();
                    if (combo.isCopy) {
                        window.showToast('📋 Copy Disabled', 'Content copying is protected.', 'info');
                    } else if (combo.isCut) {
                        window.showToast('✂️ Cut Disabled', 'Content cutting is protected.', 'info');
                    } else {
                        blockAction(combo.name, `${combo.name} is disabled.`);
                    }
                    return false;
                }
            }
        });
        
        // DevTools detection (optimized - single interval)
        const detectionElement = new Image();
        Object.defineProperty(detectionElement, 'id', {
            get: function() {
                devToolsOpen = true;
                if (devToolsOpen) {
                    window.showToast('🔍 Developer Tools Detected', 'Please close Developer Tools for optimal viewing experience.', 'warning');
                    console.clear();
                }
                return '';
            }
        });
        
        devToolsInterval = setInterval(() => {
            devToolsOpen = false;
            console.log(detectionElement);
            console.clear();
        }, CONFIG.devToolsInterval);
        
        // Print screen detection
        document.addEventListener('keyup', (e) => {
            if (e.key === 'PrintScreen') {
                navigator.clipboard.writeText('');
                window.showToast('📸 Screenshot Blocked', 'Screenshot functionality is disabled.', 'warning');
            }
        });
        
        // Drag and drop prevention (event delegation for better performance)
        document.addEventListener('dragstart', (e) => {
            if (e.target.closest('img, .project-card, .card')) {
                e.preventDefault();
                return false;
            }
        });
        
        // Copy/Cut/Paste prevention
        const preventActions = ['copy', 'cut', 'paste'];
        preventActions.forEach(action => {
            document.addEventListener(action, (e) => {
                e.preventDefault();
                if (action === 'copy') window.showToast('📋 Copy Disabled', 'Content copying is protected.', 'info');
                else if (action === 'cut') window.showToast('✂️ Cut Disabled', 'Content cutting is protected.', 'info');
                else if (action === 'paste') window.showToast('📋 Paste Restricted', 'Pasting is restricted on this site.', 'info');
                return false;
            });
        });
        
        // Disable text selection on sensitive areas
        const sensitiveSelectors = ['.project-card', '.card', '.skills-content'];
        sensitiveSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.userSelect = 'none';
                el.style.webkitUserSelect = 'none';
            });
        });
        
        // Console warnings
        console.log('%c🔒 Developer Tools Access Restricted', 'color: #f39c12; font-size: 14px; font-weight: bold;');
        console.log('%cThis website has security measures enabled.', 'color: #3498db; font-size: 12px;');
        
        // Iframe detection
        if (window.self !== window.top) {
            window.showToast('🔒 Frame Detection', 'This site cannot be embedded in iframes.', 'warning');
        }
        
        // Cleanup function (call if needed)
        window.cleanupSecurity = function() {
            if (devToolsInterval) clearInterval(devToolsInterval);
            if (consoleInterval) clearInterval(consoleInterval);
        };
    }
    
    // ========== MODAL FUNCTIONS ==========
    window.openModal = function(imageSrc) {
        if (!modal || !modalImg) {
            modal = document.getElementById('imageModal');
            modalImg = document.getElementById('modalImage');
        }
        if (modal && modalImg) {
            modal.style.display = "block";
            modalImg.src = imageSrc;
        }
    };
    
    window.closeModal = function() {
        if (modal) modal.style.display = "none";
    };
    
    // ========== SMOOTH SCROLLING ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    // ========== MOBILE MENU TOGGLE ==========
    function initMobileMenu() {
        toggleBtn = document.querySelector('.toggle-btn');
        navLinks = document.querySelector('.nav-links');
        
        if (toggleBtn && navLinks) {
            toggleBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    }
    
    // ========== MODAL CLICK OUTSIDE ==========
    function initModalOutsideClick() {
        window.onclick = function(event) {
            if (modal && event.target === modal) {
                window.closeModal();
            }
        };
    }
    
    // ========== LAZY LOAD IMAGES (Performance) ==========
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            img.src = dataSrc;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
        }
    }
    
    // ========== INITIALIZE EVERYTHING ON DOM READY ==========
    function init() {
        // Cache DOM elements
        modal = document.getElementById('imageModal');
        modalImg = document.getElementById('modalImage');
        
        // Initialize all modules
        initTitleManager();
        initTypingEffect();
        initSecurity();
        initSmoothScroll();
        initMobileMenu();
        initModalOutsideClick();
        initLazyLoading();
    }
    
    // Start when DOM is ready (faster than window.load)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();