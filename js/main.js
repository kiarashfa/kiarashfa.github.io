// ===========================
// CUSTOM CURSOR
// ===========================
const cursor = document.querySelector('.cursor');
let cursorX = 0, cursorY = 0;
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener('mousedown', () => cursor.classList.add('active'));
document.addEventListener('mouseup', () => cursor.classList.remove('active'));


// ===========================
// DROPDOWN MENU & MOBILE NAVIGATION
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================
    // DROPDOWN MENU
    // ===========================
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            // Toggle dropdown on click
            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('open');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('open');
            });
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    });
    
    // Prevent dropdown from closing when clicking inside menu
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
    
    // ===========================
    // MOBILE MENU TOGGLE
    // ===========================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            // Change hamburger icon to X and vice versa
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
});


// ===========================
// PARALLAX SCROLLING
// ===========================
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    // Parallax only for hero elements
    const parallaxFast = document.querySelectorAll('.parallax-fast');
    const parallaxSlow = document.querySelectorAll('.parallax-slow');
    
    parallaxFast.forEach(el => {
        const speed = 0.5;
        const yPos = -(scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
    
    parallaxSlow.forEach(el => {
        const speed = 0.2;
        const yPos = -(scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
});

// ===========================
// SCROLL REVEAL ANIMATION
// ===========================
const revealElements = document.querySelectorAll('.glass-card, .work-card');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementBottom = el.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.92 && elementBottom > 0) {
            el.classList.add('reveal');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// ===========================
// NAVIGATION ACTIVE STATE
// ===========================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage || 
        (currentPage === '' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
    }
});

// ===========================
// GOOGLE SCHOLAR DATA
// ===========================
// Update monthly from Google Scholar profile
const scholarStats = {
    citations: { value: 60, suffix: '+', elementId: 'citations-count' },
    hIndex:    { value: 4,  suffix: '',  elementId: 'h-index' },
    i10Index:  { value: 3,  suffix: '',  elementId: 'i10-index' },
    pubs:      { value: 7,  suffix: '',  elementId: 'publications-count' }
};

let statsAnimated = false;

function animateCount(el, target, suffix, duration) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for a satisfying deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * eased);

        el.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function triggerStatsAnimation() {
    if (statsAnimated) return;

    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;

    const rect = statsGrid.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
        statsAnimated = true;

        // Stagger each counter with a small delay
        let delay = 0;
        for (const key in scholarStats) {
            const stat = scholarStats[key];
            const el = document.getElementById(stat.elementId);
            if (el) {
                // Longer duration for bigger numbers, min 1200ms, max 2000ms
                const duration = Math.min(2000, Math.max(1200, stat.value * 30));
                setTimeout(() => animateCount(el, stat.value, stat.suffix, duration), delay);
                delay += 150;
            }
        }
    }
}

window.addEventListener('scroll', triggerStatsAnimation);
