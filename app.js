// Mobile Menu Toggle
document.getElementById('mobile-menu-button')?.addEventListener('click', function () {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
        if (!menu.classList.contains('hidden')) {
            menu.style.animation = 'slideIn 0.3s ease-out';
        }
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function (event) {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');
    if (!menu?.contains(event.target) && !button?.contains(event.target)) {
        if (menu && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
        }
    }
});

// Slideshow functionality
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('bg-white', 'opacity-100');
        dots[i].classList.add('opacity-50');
    }

    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add('active');
    }

    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('bg-white', 'opacity-100');
        dots[slideIndex - 1].classList.remove('opacity-50');
    }
}

// Auto slideshow
let slideInterval = setInterval(() => {
    plusSlides(1);
}, 5000);

// Pause slideshow on hover
const heroSection = document.querySelector('.hero-slide').parentElement;
heroSection.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

heroSection.addEventListener('mouseleave', () => {
    slideInterval = setInterval(() => {
        plusSlides(1);
    }, 5000);
});

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const speed = 200; // Lower = faster

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const increment = target / speed;
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    });
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');

            // Animate counters when statistics section is visible
            if (entry.target.querySelector('[data-count]')) {
                setTimeout(animateCounters, 500);
            }
        }
    });
}, { threshold: 0.1 });

// Observe elements
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Cart functionality
let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const service = this.getAttribute('data-service');
        const existingItem = cart.find(item => item.service === service);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                service: service,
                quantity: 1
            });
        }

        updateCart();

        // Animate cart button
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');

    if (!cartItems || !subtotalElement || !totalElement) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 dark:text-gray-400 italic">Chưa chọn dịch vụ nào</p>';
        subtotalElement.textContent = 'Liên hệ';
        totalElement.textContent = 'Liên hệ';
        return;
    }

    let cartHTML = '<div class="space-y-4">';

    cart.forEach((item, index) => {
        cartHTML += `
                <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                    <div>
                        <p class="font-medium text-gray-800 dark:text-white">${item.service}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Liên hệ x ${item.quantity}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="changeQuantity(${index}, -1)" class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">-</button>
                        <span class="font-medium min-w-[20px] text-center">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">+</button>
                        <button onclick="removeItem(${index})" class="text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:underline text-sm">Xoá</button>
                    </div>
                </div>
                `;
    });

    cartHTML += '</div>';
    cartItems.innerHTML = cartHTML;

    subtotalElement.textContent = 'Liên hệ';
    totalElement.textContent = 'Liên hệ';

    // Animate total
    totalElement.classList.add('scale-125');
    setTimeout(() => {
        totalElement.classList.remove('scale-125');
    }, 300);
}

function changeQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCart();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Booking form steps
let currentStep = 1;
const steps = document.querySelectorAll('.booking-step');
const progressSteps = document.querySelectorAll('.progress-step');

document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateSteps();
        }
    });
});

document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', () => {
        currentStep--;
        updateSteps();
    });
});

function validateStep(step) {
    const currentStepElement = document.getElementById(`step-${step}`);
    const inputs = currentStepElement.querySelectorAll('[required]');

    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
            setTimeout(() => {
                input.classList.remove('border-red-500');
            }, 2000);
        }
    });

    return isValid;
}

function updateSteps() {
    // Hide all steps
    steps.forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }

    // Update progress steps
    progressSteps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
}

// Form submission
document.getElementById('booking-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Show success message
    alert('Đặt xe thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');

    // Reset form
    this.reset();
    cart = [];
    currentStep = 1;
    updateSteps();
    updateCart();

    // Show tracking widget
    setTimeout(() => {
        document.getElementById('tracking-widget').classList.remove('hidden');
        document.getElementById('show-tracking').classList.add('hidden');
    }, 1000);
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.fa-moon');
const sunIcon = themeToggle.querySelector('.fa-sun');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {
        themeIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
        localStorage.setItem('theme', 'light');
    }
});

// Check saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
}

// Back to top button
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.remove('opacity-0');
    } else {
        backToTop.classList.add('opacity-0');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Tracking widget
document.getElementById('show-tracking').addEventListener('click', () => {
    document.getElementById('tracking-widget').classList.remove('hidden');
    document.getElementById('show-tracking').classList.add('hidden');
});

document.getElementById('close-tracking').addEventListener('click', () => {
    document.getElementById('tracking-widget').classList.add('hidden');
    document.getElementById('show-tracking').classList.remove('hidden');
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize animations on load
document.addEventListener('DOMContentLoaded', () => {
    // Animate floating buttons
    setTimeout(() => {
        const floatBtns = document.querySelectorAll('.floating-btn');
        floatBtns.forEach((btn, index) => {
            setTimeout(() => {
                btn.classList.add('float-animation');
            }, index * 100);
        });
    }, 1000);

    // Set min date for booking
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().slice(0, 16);
    document.getElementById('date').min = minDate;

    // Set default date to tomorrow at 8:00 AM
    tomorrow.setHours(8, 0, 0, 0);
    document.getElementById('date').value = tomorrow.toISOString().slice(0, 16);
});