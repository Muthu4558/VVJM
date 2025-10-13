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
const swiper = new Swiper(".mySwiper", {
    loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    autoplay: { delay: 4000, disableOnInteraction: false },
    effect: "fade",
    fadeEffect: { crossFade: true },
});

feather.replace();

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



// Gallery
const images = [
    "./assets/Gallery/1.jpg",
    "./assets/Gallery/3.jpg",
    "./assets/Gallery/4.jpg",
    "./assets/Gallery/6.jpg",
    "./assets/Gallery/7.jpg",
    "./assets/Gallery/8.jpg",
    "./assets/Gallery/9.jpg",
    "./assets/Gallery/10.jpg",
    "./assets/Gallery/11.jpg",
    "./assets/Gallery/12.jpg",
    "./assets/Gallery/13.jpg",
    "./assets/Gallery/14.jpg",
    "./assets/Gallery/15.jpg",
    "./assets/Gallery/16.jpg",
    "./assets/Gallery/17.jpg",
    "./assets/Gallery/18.jpg",
    "./assets/Gallery/19.jpg",
    "./assets/Gallery/20.jpg"
];

let currentIndex = 0;

function openModal(index) {
    currentIndex = index;
    document.getElementById("lightbox").classList.remove("hidden");
    document.getElementById("lightbox-img").src = images[currentIndex];
}

function closeModal() {
    document.getElementById("lightbox").classList.add("hidden");
}

function changeSlide(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    document.getElementById("lightbox-img").src = images[currentIndex];
}


// quotes
const vivekanandaSwiper = new Swiper(".vivekanandaSwiper", {
    loop: true,
    effect: "fade",             // Smooth fade effect
    fadeEffect: { crossFade: true },
    autoplay: {
        delay: 3500,              // 3.5 seconds per quote
        disableOnInteraction: false,
    },
    speed: 1200,                // Smooth transition speed
    allowTouchMove: false       // Prevent manual swipe
});

// Modal popup for VVJM Attention
/* VVJM Popup script - show after 10s, respect "don't show again today" */
/* Append or paste into ./script.js */

(function () {
    const MODAL_ID = 'vvjm-modal';
    const CLOSE_ID = 'vvjm-close';
    const CTA_ID = 'vvjm-apply';
    const CHECK_ID = 'vvjm-dont-show';
    const STORAGE_KEY = 'vvjm_popup_snooze_until';

    const modal = document.getElementById(MODAL_ID);
    const closeBtn = document.getElementById(CLOSE_ID);
    const dontShowCheckbox = document.getElementById(CHECK_ID);
    const cta = document.getElementById(CTA_ID);

    // Helper: check snooze
    function isSnoozed() {
        try {
            const v = localStorage.getItem(STORAGE_KEY);
            if (!v) return false;
            const ts = parseInt(v, 10);
            return Date.now() < ts;
        } catch (e) {
            return false;
        }
    }

    // Helper: snooze for 24 hours
    function snoozeFor24h() {
        const ms24 = 24 * 60 * 60 * 1000;
        const until = Date.now() + ms24;
        localStorage.setItem(STORAGE_KEY, String(until));
    }

    function openModal() {
        if (!modal) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        // trap focus to modal (basic)
        const focusable = modal.querySelectorAll('a,button,input,textarea,[tabindex]:not([tabindex="-1"])');
        if (focusable && focusable.length) focusable[0].focus();
        // close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        // close on Esc
        document.addEventListener('keydown', escHandler);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.removeEventListener('keydown', escHandler);
    }

    function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            if (dontShowCheckbox.checked) snoozeFor24h();
        }
    }

    // close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal();
            if (dontShowCheckbox.checked) snoozeFor24h();
        });
    }

    // CTA: if user clicks Apply, optionally mark snooze (we don't force)
    if (cta) {
        cta.addEventListener('click', () => {
            // If checked, snooze
            if (dontShowCheckbox.checked) snoozeFor24h();
            // Allow navigation to admission page naturally
        });
    }

    // Show after 10 seconds unless snoozed
    const SHOW_DELAY = 5000; // ms
    if (!isSnoozed()) {
        window.setTimeout(() => {
            // Extra safety: don't show while loader overlay visible
            const loader = document.getElementById('loader-overlay');
            if (loader && !loader.classList.contains('hidden')) {
                // if loader present, wait until loader hidden or 2 more seconds
                const observer = new MutationObserver(() => {
                    if (loader.classList.contains('hidden')) {
                        observer.disconnect();
                        openModal();
                    }
                });
                observer.observe(loader, { attributes: true, attributeFilter: ['class'] });
                // fallback: open after +2s
                setTimeout(openModal, 2000);
            } else {
                openModal();
            }
        }, SHOW_DELAY);
    }

})();