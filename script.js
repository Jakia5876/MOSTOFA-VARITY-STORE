document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Theme Toggling
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark as requested
    
    if (currentTheme === 'dark') {
        htmlElement.classList.add('dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        htmlElement.classList.remove('dark');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        let theme = 'light';
        
        if (htmlElement.classList.contains('dark')) {
            theme = 'dark';
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
        
        localStorage.setItem('theme', theme);
    });

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 4. Parallax Effect logic handled in pure CSS for performance (animations), but let's add subtle mousemove parallax for hero
    const hero = document.getElementById('hero');
    const shapes = document.querySelectorAll('.shape');

    hero.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 90;
        const y = (window.innerHeight - e.pageY * 2) / 90;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 2;
            shape.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
        });
    });
    
    hero.addEventListener('mouseleave', () => {
        shapes.forEach((shape) => {
            shape.style.transform = `translateX(0px) translateY(0px)`;
        });
    });

    // 5. Product Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50); // slight delay for smooth fade
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300); // Wait for transition
                }
            });
        });
    });

    // 6. Testimonial Slider
    const track = document.querySelector('.testimonial-track');
    const slides = Array.from(track.children);
    const dots = document.querySelectorAll('.dot');
    
    let currentIndex = 0;
    
    function moveToSlide(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentIndex = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            moveToSlide(index);
        });
    });
    
    // Auto slide
    setInterval(() => {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        moveToSlide(nextIndex);
    }, 5000); // 5 sec per slide

    // 7. Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic validation check (html5 handles the 'required' but just in case)
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if(name && email && message) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                try {
                    // Send data to Formspree
                    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, email, message })
                    });
                    
                    if (response.ok) {
                        formSuccess.style.display = 'block';
                        contactForm.reset();
                    } else {
                        alert("Oops! There was a problem submitting your form.");
                    }
                } catch (error) {
                    alert("Oops! There was a problem submitting your form.");
                }

                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            }
        });
    }
    
    // 8. Simple Cart Logic (Micro-interaction)
    const buyBtns = document.querySelectorAll('.btn-buy');
    const cartCountEl = document.querySelector('.cart-count');
    let cartCount = 0;
    
    buyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            cartCount++;
            cartCountEl.innerText = cartCount;
            
            // Visual feedback
            const originalText = btn.innerText;
            btn.innerText = 'Added!';
            btn.style.background = '#2ecc71';
            btn.style.color = 'white';
            btn.style.borderColor = '#2ecc71';
            
            // Pop animation on cart icon
            cartCountEl.style.transform = 'scale(1.5)';
            setTimeout(() => cartCountEl.style.transform = 'scale(1)', 300);
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = 'transparent';
                btn.style.color = 'var(--clr-accent)';
                btn.style.borderColor = 'var(--clr-accent)';
            }, 2000);
        });
    });
});
