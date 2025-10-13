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