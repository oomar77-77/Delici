let progressBar = document.querySelector(".scroll-progress");

window.addEventListener("scroll", updateProgress);
window.addEventListener("resize", updateProgress);
updateProgress();


window.addEventListener("scroll", function () {
    checkScrollNav();
});

let nextBtn = document.querySelector("#SC-Carousel .next"),
    prevBtn = document.querySelector("#SC-Carousel .prev");
nextBtn.addEventListener("click", function () {
    let currentSlide = document.querySelector("#SC-Carousel .sc-carousel-inner .sc-carousel-item.active"),
        newSlide = currentSlide.nextElementSibling ?? document.querySelector(".sc-carousel-item:first-child");
    currentSlide.classList.remove("active");
    newSlide.classList.add("active");
});

prevBtn.addEventListener("click", function () {
    let currentSlide = document.querySelector("#SC-Carousel .sc-carousel-inner .sc-carousel-item.active"),
        newSlide = currentSlide.previousElementSibling ?? document.querySelector(".sc-carousel-item:last-child");
    currentSlide.classList.remove("active");
    newSlide.classList.add("active");
});









let links = document.querySelectorAll(".navbar ul li a");

links.forEach(function (link) {
    link.addEventListener("click", function () {
        document.querySelector(".navbar ul li a.active")?.classList.remove("active");
        link.classList.add("active");
    });
});


let slides = document.querySelectorAll("#SC-Carousel .sc-carousel-item"),
    dots = document.querySelectorAll("#SC-Carousel .indicators button"),
    current = 0;
dots.forEach((dot, i) => {
    dot.addEventListener("animationend", e => {
        if (e.animationName === "scale") show(current + 1);
    });
    dot.addEventListener("click", () => show(i));
});

nextBtn.addEventListener("click", function () {
    show(current + 1);
});

prevBtn.addEventListener("click", function () {
    show(current - 1);
});

document.querySelector(".bookingTable").addEventListener("click", function () {
    openPopup("bookingTable");
});

document.querySelector(".popup > .box").addEventListener("click", function (e) {
    e.stopPropagation();
});




let burgerBtn = document.querySelector(".menu-toggle"),
    sidebarPopup = document.querySelector('.popup[data-popup-name="sidebar"]'),
    sidebarBox = sidebarPopup.querySelector(".box");

burgerBtn?.addEventListener("click", function () {
    openPopup("sidebar");
});

sidebarBox.addEventListener("click", function (e) {
    e.stopPropagation();
});

sidebarPopup.querySelectorAll(".links a").forEach(function (link) {
    link.addEventListener("click", closePopup);
});





let sideLinks = document.querySelectorAll(".link-sidebar");

function setActive(link) {
    sideLinks.forEach(l => {
        l.classList.remove("active");
        l.parentElement.querySelector(".square").classList.add("d-none");
    });
    link.classList.add("active");
    link.parentElement.querySelector(".square").classList.remove("d-none");
}


sideLinks.forEach(link => {
    link.addEventListener("click", () => setActive(link));
});




let loadingpageEle = document.querySelector(".loadingPage");

window.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        loadingpageEle.classList.add("hide");
        setTimeout(function () {
            loadingpageEle.classList.add("d-none");
        }, 1000);
    }, 2000);
});




document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));




