// Animacje fade-in przy przewijaniu
document.addEventListener('DOMContentLoaded', function() {
    // Funkcja do sprawdzania czy element jest widoczny
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Funkcja do sprawdzania czy element jest częściowo widoczny
    function isElementPartiallyInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= windowHeight &&
            rect.left <= windowWidth
        );
    }

    // Elementy do animacji
    const animatedElements = document.querySelectorAll('.section-title, .ebook-card, .review-card, .about-text, .contact-form');
    
    // Funkcja animacji
    function animateOnScroll() {
        animatedElements.forEach(function(element) {
            if (isElementPartiallyInViewport(element)) {
                element.classList.add('fade-in');
            }
        });
    }

    // Uruchom animację przy ładowaniu strony
    animateOnScroll();

    // Uruchom animację przy przewijaniu
    window.addEventListener('scroll', function() {
        animateOnScroll();
    });

    // Smooth scroll dla linków nawigacyjnych
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Obsługa formularza kontaktowego
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            // Formspree obsługuje wysyłanie formularza, więc nie blokujemy domyślnego zachowania
            // Możemy dodać walidację po stronie klienta, ale nie blokujemy wysyłania
            const emailInput = this.querySelector("input[name=\"email\"]");
            if (emailInput && !isValidEmail(emailInput.value)) {
                e.preventDefault(); // Zablokuj wysyłanie, jeśli email jest nieprawidłowy
                showNotification("Proszę podać prawidłowy adres email.", "error");
            }
            // Formspree zajmie się resztą, w tym przekierowaniem lub wyświetleniem komunikatu
        });
    }

    // Funkcja walidacji email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Funkcja wyświetlania powiadomień
    function showNotification(message, type) {
        // Usuń istniejące powiadomienia
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Stwórz nowe powiadomienie
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style dla powiadomienia
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #4a6741, #8fbc8f)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #d32f2f, #f44336)';
        }
        
        document.body.appendChild(notification);
        
        // Animacja wejścia
        setTimeout(function() {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Automatyczne usunięcie po 5 sekundach
        setTimeout(function() {
            notification.style.transform = 'translateX(100%)';
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Efekt paralaksy dla hero section (opcjonalny)
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Animacja hover dla kart e-booków
    const ebookCards = document.querySelectorAll('.ebook-card');
    ebookCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animacja hover dla kart opinii
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Licznik animowany dla cen (opcjonalny efekt)
    const prices = document.querySelectorAll('.ebook-price');
    prices.forEach(function(price) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animatePrice(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(price);
    });

    function animatePrice(element) {
        const text = element.textContent;
        const number = parseInt(text.match(/\d+/)[0]);
        let current = 0;
        const increment = number / 30;
        const timer = setInterval(function() {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + ' zł';
        }, 50);
    }

    // Dodaj klasy CSS dla animacji, jeśli nie zostały dodane w CSS
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .ebook-card, .review-card {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

// Funkcja do ładowania strony z efektem fade-in
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(function() {
        document.body.style.opacity = '1';
    }, 100);
});

