// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-toggle');
const sidebar = document.querySelector('.sidebar');

mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 968) {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu after clicking
            if (window.innerWidth <= 968) {
                sidebar.classList.remove('active');
            }
        }
    });
});

// Active navigation highlighting based on scroll position
const sections = document.querySelectorAll('.section');

function setActiveNav() {
    let current = '';
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Update active nav on scroll
window.addEventListener('scroll', setActiveNav);

// Set initial active state
setActiveNav();

// Intersection Observer for section animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate child elements with stagger
            const cards = entry.target.querySelectorAll('.stat-item, .timeline-item, .education-card, .skill-category, .project-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Add initial styles for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.stat-item, .timeline-item, .education-card, .skill-category, .project-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
});

// Animated number counter for stats
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Counter animation on scroll into view
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            
            if (!isNaN(number)) {
                entry.target.textContent = '0';
                setTimeout(() => {
                    animateValue(entry.target, 0, number, 2000);
                    
                    // Add back the suffix
                    setTimeout(() => {
                        if (text.includes('+')) {
                            entry.target.textContent = entry.target.textContent + '+';
                        }
                        if (text.includes('%')) {
                            entry.target.textContent = entry.target.textContent + '%';
                        }
                        if (text.includes('K')) {
                            entry.target.textContent = number / 1000 + 'K+';
                        }
                        if (text.includes('M')) {
                            entry.target.textContent = number / 1000000 + 'M+';
                        }
                    }, 2000);
                }, 300);
            }
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Skill bar animation on scroll
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillBarsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const width = entry.target.getAttribute('data-width');
            setTimeout(() => {
                entry.target.style.width = width + '%';
            }, 200);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach(bar => {
    skillBarsObserver.observe(bar);
});

console.log('✅ Portfolio initialized successfully!');
