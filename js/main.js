(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // AOS initialization
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Sticky Navbar with transparency
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.sticky-navbar').addClass('navbar-scrolled');
        } else {
            $('.sticky-navbar').removeClass('navbar-scrolled');
        }
    });

    // Back to top button with show/hide
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').addClass('show');
        } else {
            $('.back-to-top').removeClass('show');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    // Smooth scroll for all anchor links
    $('a[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 70
                }, 800);
                return false;
            }
        }
    });

    // Animated Counters with Intersection Observer
    const counters = document.querySelectorAll('.counter-value');
    const speed = 2000; // animation duration

    const startCounting = (counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target') || +counter.innerText;
            const count = +counter.innerText;
            const increment = target / speed * 15; // adjust for smoothness

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.innerText;
                counter.setAttribute('data-target', target);
                counter.innerText = '0';
                startCounting(counter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));

    // Contact Form Validation & AJAX Submission
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Real-time validation
            let isValid = true;
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            if (!isValid) return;

            // Disable button and show loading
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';

            // Submit via AJAX
            const formData = new FormData(form);
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    // Show success modal
                    const modalHtml = `
                        <div class="modal fade" id="successModal" tabindex="-1">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header bg-success text-white">
                                        <h5 class="modal-title">Thank You!</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div class="modal-body">
                                        Your application request has been sent. We'll email you the forms shortly.
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    $('body').append(modalHtml);
                    $('#successModal').modal('show');
                    form.reset();
                    $('#successModal').on('hidden.bs.modal', function () { $(this).remove(); });
                } else {
                    alert('Oops! Something went wrong. Please try again.');
                }
            } catch (error) {
                alert('Network error. Please check your connection.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Request Application';
            }
        });

        // Real-time validation on blur
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', function () {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                } else {
                    this.classList.add('is-invalid');
                }
            });
        });
    }

    // Countdown Timer
    function updateCountdown() {
        const now = new Date();
        let nextDeadline;
        const currentYear = now.getFullYear();

        // Registration periods: Jan 1 - Feb 28 and Jun 1 - Jul 31
        // Deadline: Feb 28 and Jul 31
        const febDeadline = new Date(currentYear, 1, 28); // Feb 28
        const julDeadline = new Date(currentYear, 6, 31); // Jul 31

        if (now < febDeadline) {
            nextDeadline = febDeadline;
        } else if (now < julDeadline) {
            nextDeadline = julDeadline;
        } else {
            // Next year's Feb deadline
            nextDeadline = new Date(currentYear + 1, 1, 28);
        }

        const diff = nextDeadline - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('countdown').innerText = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    if (document.getElementById('countdown')) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

})(jQuery);