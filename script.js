const topBar = document.getElementById("top-bar");
const navbar = document.getElementById("navbar");
let lastScroll = 0;

function adjustNavbar() {
    const topBarHeight = topBar.offsetHeight;
    navbar.style.top = `${topBarHeight}px`;
}

// Initial adjustment
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

// Feather icons
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
    progress += Math.random() * 2; // smooth increment
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