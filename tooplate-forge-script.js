/* JavaScript Document

Tooplate 2158 Forge Reality

https://www.tooplate.com/view/2158-forge-reality

*/

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Navigation background on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        nav.style.background = 'linear-gradient(180deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.8) 100%)';
    }
});

// Parallax effect for hero backgrounds
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroBackgrounds = document.querySelector('.hero-backgrounds');
    if (heroBackgrounds) {
        heroBackgrounds.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks2 = document.querySelector('.nav-links');

menuToggle.addEventListener('click', function() {
    navLinks2.classList.toggle('active');
    this.classList.toggle('active');
});

// Pricing Toggle Functionality
const pricingToggle = document.getElementById('pricing-toggle');
const monthlyLabel = document.getElementById('monthly-label');
const yearlyLabel = document.getElementById('yearly-label');
const priceAmounts = document.querySelectorAll('.price-amount');
const pricePeriods = document.querySelectorAll('.price-period');

if (pricingToggle) {
    pricingToggle.addEventListener('click', function() {
        this.classList.toggle('yearly');
        
        if (this.classList.contains('yearly')) {
            // Switch to yearly pricing
            monthlyLabel.classList.remove('active');
            yearlyLabel.classList.add('active');
            
            priceAmounts.forEach(price => {
                const monthlyPrice = parseInt(price.getAttribute('data-monthly'));
                const yearlyPrice = Math.round(monthlyPrice * 12 * 0.80); // 20% discount
                price.textContent = yearlyPrice.toLocaleString();
            });
            
            pricePeriods.forEach(period => {
                period.textContent = '/year';
            });
        } else {
            // Switch to monthly pricing
            monthlyLabel.classList.add('active');
            yearlyLabel.classList.remove('active');
            
            priceAmounts.forEach(price => {
                const monthlyPrice = price.getAttribute('data-monthly');
                price.textContent = monthlyPrice;
            });
            
            pricePeriods.forEach(period => {
                period.textContent = '/month';
            });
        }
    });
}

// Remove loading bar after page load
window.addEventListener('load', function() {
    setTimeout(() => {
        document.querySelector('.loading-bar').style.display = 'none';
    }, 2000);
});

// Form submission