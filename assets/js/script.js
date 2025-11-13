const topBar = document.getElementById("top-bar");
const navbar = document.getElementById("navbar");
let lastScroll = 0;

function adjustNavbar() {
    const topBarHeight = topBar.offsetHeight;
    navbar.style.top = `${topBarHeight}px`;
}

adjustNavbar();

window.addEventListener("resize", adjustNavbar);

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > lastScroll && currentScroll > 50) {
        topBar.style.top = `-${topBar.offsetHeight}px`; // hide top bar
        navbar.style.top = "0"; // move navbar to very top
    } else {
        topBar.style.top = "0"; // show top bar
        adjustNavbar(); // put navbar just below top bar
    }
    lastScroll = currentScroll;
});


// Swiper
document.addEventListener("DOMContentLoaded", () => {
  // Hero/Main Swiper
  new Swiper(".mySwiper", {
    loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    autoplay: { delay: 4000, disableOnInteraction: false },
    effect: "fade",
    fadeEffect: { crossFade: true },
  });

  // Vivekananda Quotes Swiper
  new Swiper(".vivekanandaSwiper", {
    loop: true,
    effect: "fade",
    fadeEffect: { crossFade: true },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 1200,
    allowTouchMove: false,
  });
});

// Mobile Menu Toggle
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    // Toggle icon
    menuBtn.innerHTML = mobileMenu.classList.contains("hidden")
        ? '<i class="fa-solid fa-bars"></i>'
        : '<i class="fa-solid fa-xmark"></i>';
});

// Mobile Dropdown Toggle
function toggleDropdown(id, btn) {
    const dropdown = document.getElementById(id);
    const icon = btn.querySelector("i");

    if (dropdown.classList.contains("hidden")) {
        dropdown.classList.remove("hidden");
        icon.classList.add("rotate-45"); // rotate plus to X
    } else {
        dropdown.classList.add("hidden");
        icon.classList.remove("rotate-45");
    }
}


const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - percent / 100 * circumference;
    circle.style.strokeDashoffset = offset;
    document.getElementById('loader-percentage').textContent = `${percent}%`;
}

// Smooth loading simulation
let progress = 0;
const interval = setInterval(() => {
    progress += Math.random() * 2;
    if (progress > 100) progress = 100;
    setProgress(Math.floor(progress));
    if (progress >= 100) {
        clearInterval(interval);
        const overlay = document.getElementById('loader-overlay');
        overlay.style.transition = 'opacity 0.5s';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 500);
    }
}, 20);


// Modal popup for VVJM Attention
(function () {
    const MODAL = document.getElementById('vvjm-modal');
    const CARD = document.getElementById('vvjm-card');
    const CLOSE = document.getElementById('vvjm-close');
    const CTA = document.getElementById('vvjm-apply');
    const DONT = document.getElementById('vvjm-dont-show');
    const STORAGE_KEY = 'vvjm_popup_snooze_until';
    const SHOW_DELAY = 2000; // 10 seconds

    // focus-trap utilities
    let lastFocused = null;
    function getFocusable(el) {
        return Array.from(el.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
            .filter(x => x.offsetParent !== null);
    }

    function trapFocus(e) {
        if (!MODAL || MODAL.getAttribute('aria-hidden') === 'true') return;
        const focusables = getFocusable(CARD);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) { // shift+tab
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else { // tab
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    // snooze logic
    function isSnoozed() {
        try {
            const v = localStorage.getItem(STORAGE_KEY);
            if (!v) return false;
            return Date.now() < parseInt(v, 10);
        } catch (e) { return false; }
    }
    function snoozeFor24h() {
        const ms24 = 24 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, String(Date.now() + ms24));
    }

    function openModal() {
        if (!MODAL) return;
        lastFocused = document.activeElement;
        MODAL.setAttribute('aria-hidden', 'false');
        MODAL.classList.remove('hidden');
        MODAL.classList.add('flex');
        // autofocus first control
        const focusables = getFocusable(CARD);
        if (focusables.length) focusables[0].focus();
        document.addEventListener('keydown', onKeyDown);
    }

    function closeModal() {
        if (!MODAL) return;
        MODAL.setAttribute('aria-hidden', 'true');
        MODAL.classList.add('hidden');
        MODAL.classList.remove('flex');
        document.removeEventListener('keydown', onKeyDown);
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') {
            if (DONT && DONT.checked) snoozeFor24h();
            closeModal();
        } else if (e.key === 'Tab') {
            trapFocus(e);
        }
    }

    // close handlers
    if (CLOSE) CLOSE.addEventListener('click', () => {
        if (DONT && DONT.checked) snoozeFor24h();
        closeModal();
    });

    // backdrop click
    MODAL.addEventListener('click', (e) => {
        if (e.target === MODAL) {
            if (DONT && DONT.checked) snoozeFor24h();
            closeModal();
        }
    });

    // CTA click: optional snooze if checked
    if (CTA) CTA.addEventListener('click', () => {
        if (DONT && DONT.checked) snoozeFor24h();
        // natural navigation to admission.html will occur
    });

    // Show after delay if not snoozed
    if (!isSnoozed()) {
        setTimeout(() => {
            // don't open if another overlay (like loader) present & visible
            const loader = document.getElementById('loader-overlay');
            if (loader && !loader.classList.contains('hidden')) {
                // wait for loader hide up to 3s
                const observer = new MutationObserver(() => {
                    if (loader.classList.contains('hidden')) {
                        observer.disconnect();
                        openModal();
                    }
                });
                observer.observe(loader, { attributes: true, attributeFilter: ['class'] });
                setTimeout(openModal, 3000);
            } else {
                openModal();
            }
        }, SHOW_DELAY);
    }

    // Optional: expose open/close if needed
    window.VVJMModal = { open: openModal, close: closeModal };
})();

// News stop section
(function () {
    const scrollContainer = document.getElementById('news-scroll');
    const track = document.getElementById('news-track');

    if (!scrollContainer || !track) return;

    // Duplicate track for a seamless loop
    const clone = track.cloneNode(true);
    clone.id = 'news-track-clone';
    track.parentNode.appendChild(clone);

    // Set up variables
    let speed = 0.45; // px per frame (adjust speed)
    let paused = false;
    let rafId = null;

    // Pause on hover or focus, resume on leave/blur
    const pause = () => (paused = true);
    const resume = () => (paused = false);

    scrollContainer.addEventListener('mouseenter', pause);
    scrollContainer.addEventListener('mouseleave', resume);
    scrollContainer.addEventListener('focusin', pause);
    scrollContainer.addEventListener('focusout', resume);

    // Ensure the two tracks are displayed stacked vertically
    // Wrap both track elements in a single tall container for scrolling
    const startAutoScroll = () => {
        // Set heights after DOM layout
        // We will animate scrollTop of scrollContainer
        const singleTrackHeight = track.getBoundingClientRect().height;
        // If no height or too small, do nothing
        if (singleTrackHeight <= 0) return;

        // set initial scrollTop to 0
        scrollContainer.scrollTop = 0;

        // animation function
        const step = () => {
            if (!paused) {
                scrollContainer.scrollTop += speed;
                // When we've scrolled past the first track, reset to start
                if (scrollContainer.scrollTop >= singleTrackHeight) {
                    scrollContainer.scrollTop = 0;
                }
            }
            rafId = requestAnimationFrame(step);
        };

        // start
        if (!rafId) rafId = requestAnimationFrame(step);
    };

    // Start after small delay to ensure fonts/images rendered
    window.addEventListener('load', startAutoScroll);
    // also attempt on DOMContentLoaded if load may have fired earlier
    if (document.readyState === 'complete') startAutoScroll();

    // cleanup on unload
    window.addEventListener('beforeunload', () => {
        if (rafId) cancelAnimationFrame(rafId);
    });
})();