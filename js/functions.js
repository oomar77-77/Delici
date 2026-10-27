function updateProgress() {
    let scrolled = window.scrollY,
        total = document.documentElement.scrollHeight - window.innerHeight;

    progressBar.style.transform = "scaleX(" + (scrolled / total) + ")";
}

function checkScrollNav() {
    let navEle = document.querySelector(".navbar")
    if (window.scrollY > 10) {
        navEle.classList.add("scrolled");
    }
    else {
        navEle.classList.remove("scrolled");
    }
}


function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    dots.forEach(dot => dot.classList.remove("active"));
    void dots[0].offsetWidth;
    dots[current].classList.add("active");
}


function openPopup(name) {
    document.querySelector('.popup[data-popup-name="' + name + '"]').classList.add("show");
    document.body.style.overflow = "hidden";
}

function closePopup() {
    document.querySelectorAll(".popup.show").forEach(function (popup) {
        popup.classList.remove("show");
    });
    document.body.style.overflow = "";
}


function setActive(link) {
    sideLinks.forEach(ele => {
        ele.classList.remove("active");
        ele.parentElement.querySelector(".square").classList.add("d-none");
    });
    link.classList.add("active");
    link.parentElement.querySelector(".square").classList.remove("d-none");
}

/* abotus */
function viewMenu(category) {
    let menuSection = document.getElementById("Menu");
    if (!menuSection) return;

    menuSection.scrollIntoView({ behavior: "smooth" });

    let target = category.toLowerCase();
    let filterBtns = menuSection.querySelectorAll("[data-category], .filter-btn, .tab-btn, button");

    filterBtns.forEach(btn => {
        let name = (btn.dataset.category || btn.textContent).trim().toLowerCase();
        if (name === target) {
            btn.click();
        }
    });
}


function showError(input, message) {
    let alertMsg = input.parentElement.querySelector(".alert-msg");
    alertMsg.textContent = message;
    alertMsg.classList.remove("d-none");
    input.classList.add("input-error");
}

function clearError(input) {
    let alertMsg = input.parentElement.querySelector(".alert-msg");
    if (alertMsg) {
        alertMsg.textContent = "";
        alertMsg.classList.add("d-none");
    }
    input.classList.remove("input-error");
}

function checkInput(input) {
    let value = input.value.trim();

    clearError(input);

    switch (input.name) {
        case "name":
            if (value === "") {
                showError(input, "Please enter the reservation name");
                return false;
            }
            if (value.length < 3) {
                showError(input, "Name must be at least 3 characters");
                return false;
            }
            if (!/^[\p{L}\s.'-]+$/u.test(value)) {
                showError(input, "Name can contain letters only");
                return false;
            }
            break;

        case "phone":
            let phone = value.replace(/[\s-]/g, "");
            if (phone === "") {
                showError(input, "Please enter your phone number");
                return false;
            }
            if (!/^(\+20|0020|0)?1[0125]\d{8}$/.test(phone)) {
                showError(input, "Enter a valid phone number");
                return false;
            }
            break;

        case "seats":
            let seats = Number(value);
            if (value === "") {
                showError(input, "Please enter the number of seats");
                return false;
            }
            if (!Number.isInteger(seats) || seats < 1 || seats > 20) {
                showError(input, "Seats must be between 1 and 20");
                return false;
            }
            break;

        case "datetime":
            if (value === "") {
                showError(input, "Please choose a date and time");
                return false;
            }
            let date = new Date(value),
                hours = date.getHours() + date.getMinutes() / 60;
            if (date <= new Date()) {
                showError(input, "Choose a date in the future");
                return false;
            }
            if (hours < 8 || hours > 22) {
                showError(input, "We are open from 8:00 AM to 10:00 PM");
                return false;
            }
            break;
    }

    return true;
}
function toggleReset(form) {
    let hasValue = [...form.querySelectorAll("input, textarea")].some(function (field) {
        return field.value.trim() !== "";
    });
    form.querySelector(".reset").classList.toggle("d-none", !hasValue);
}

function resetForm(icon) {
    let form = icon.closest("form");
    form.reset();
    form.querySelectorAll(".reservation-input").forEach(clearError);
    form.querySelector(".reset").classList.add("d-none");
}

let bookingForm = document.querySelector('.popup[data-popup-name="bookingTable"] form');

bookingForm.addEventListener("input", function () {
    toggleReset(bookingForm);
});

bookingForm.addEventListener("submit", function (e) {
    let allValid = true;

    bookingForm.querySelectorAll(".reservation-input").forEach(function (input) {
        if (!checkInput(input)) {
            allValid = false;
        }
    });

    if (!allValid) {
        e.preventDefault();
        bookingForm.querySelector(".input-error").focus();
    }
});



let categories = document.querySelectorAll("#Menu .category");
let searchInput = document.querySelector("#Menu #Search");
let cancelSearch = document.querySelector("#Menu .cancel-search");
let emptyState = document.querySelector("#Menu .meals-empty-state");
let menuMeals = document.querySelector("#Menu .menu-meals");

let currentCategory = "BreakFast";

function updateCategoryActive(element) {
    categories.forEach(function (category) {
        category.classList.remove("active");
    });

    element.classList.add("active");
    currentCategory = element.dataset.category;

    searchInput.value = "";
    renderMenu();
}

function renderMenu() {
    let searchValue = searchInput.value.trim().toLowerCase();

    let filteredMeals = allMenu.filter(function (meal) {
        return (
            meal.type.toLowerCase() === currentCategory.toLowerCase() &&
            meal.name.toLowerCase().includes(searchValue)
        );
    });



    if (cancelSearch) {
        cancelSearch.classList.toggle("d-none", searchValue === "");
    }

    if (filteredMeals.length === 0) {
        menuMeals.innerHTML = "";

        if (emptyState) {
            emptyState.classList.remove("d-none");
        }

        return;
    }

    if (emptyState) {
        emptyState.classList.add("d-none");
    }

    menuMeals.classList.remove("d-none");
    menuMeals.classList.add("active", "show");

    menuMeals.innerHTML = `
        <div class="row row-gap-5 position-relative">
            <div class="part1 col-lg-6 pe-lg-5">
                <div class="item d-flex flex-column row-gap-5"
                     id="menu-left"></div>
            </div>

            <div class="vertical-line p-0 d-none d-lg-block"></div>

            <div class="part2 col-lg-6 ps-lg-5">
                <div class="item d-flex flex-column row-gap-5"
                     id="menu-right"></div>
            </div>
        </div>
    `;

    let menuLeft = menuMeals.querySelector("#menu-left");
    let menuRight = menuMeals.querySelector("#menu-right");

    filteredMeals.forEach(function (meal, index) {
        let image = meal.images && meal.images.length > 0
            ? meal.images[0]
            : "";

        let product = document.createElement("div");
        product.className = "meal row mx-0 align-items-center";

        product.innerHTML = `
            <div class="col-4 col-lg-3 center p-0">
                <div class="frame center">
                    <div class="meal-img"
                         style="background-image: url('./images/${image}')">
                    </div>

                    <div class="layout center fs-4 text-black">
                        <i class="fa-regular fa-square-plus"
                           role="button"
                           tabindex="0"
                           onclick="showPopupMeal(${meal.id})">
                        </i>
                    </div>
                </div>
            </div>

            <div class="col-8 col-lg-9">
                <div class="description text-light">
                    <div class="d-flex align-items-center column-gap-3 mb-2">
                        <h5 class="meal-name m-0 main-color">
                            ${meal.name}
                        </h5>

                        <div class="separator"></div>

                        <h5 class="meal-price m-0 main-color">
                            $${Number(meal.price).toFixed(2)}
                        </h5>
                    </div>

                    <p class="s-text-color mb-0">
                        ${meal.miniDescription || ""}
                    </p>
                </div>
            </div>
        `;

        if (index % 2 === 0) {
            menuLeft.appendChild(product);
        } else {
            menuRight.appendChild(product);
        }
    });
}

categories.forEach(function (category) {
    category.addEventListener("click", function (event) {
        event.preventDefault();
        updateCategoryActive(category);
    });
});

if (searchInput) {
    searchInput.addEventListener("input", renderMenu);
}

if (cancelSearch) {
    cancelSearch.addEventListener("click", function () {
        searchInput.value = "";
        renderMenu();
        searchInput.focus();
    });
}

let defaultCategory = document.querySelector(
    '#Menu .category[data-category="BreakFast"]'
);

if (defaultCategory) {
    updateCategoryActive(defaultCategory);
} else {
    renderMenu();
}



(function () {
    const IMG_PATH = "./images/";

    const popup = document.createElement("div");

    popup.className = "meal-popup";

    popup.innerHTML = `
        <div class="meal-popup-box">
            <button class="meal-popup-close" aria-label="Close">
                <i class="fa-regular fa-circle-xmark"></i>
            </button>

            <div class="title text-center">
                <h6 class="main-color">SPECIAL SELECTION</h6>

                <img
                    src="./images/separator.svg"
                    class="img-fluid widOfImg"
                    alt="Separator"
                >

                <h2 class="display-5 text-light meal-popup-name"></h2>
            </div>

            <div class="meal-popup-gallery">
                <img class="meal-popup-img" alt="">

                <div class="meal-popup-price"></div>

                <button class="meal-popup-arrow prev" aria-label="Previous">
                    <i class="fa-solid fa-angle-left"></i>
                </button>

                <button class="meal-popup-arrow next" aria-label="Next">
                    <i class="fa-solid fa-angle-right"></i>
                </button>
            </div>

            <p class="meal-popup-desc"></p>
        </div>
    `;

    document.body.appendChild(popup);

    let box = popup.querySelector(".meal-popup-box");
    let nameEl = popup.querySelector(".meal-popup-name");
    let imgEl = popup.querySelector(".meal-popup-img");
    let priceEl = popup.querySelector(".meal-popup-price");
    let descEl = popup.querySelector(".meal-popup-desc");
    let prevBtn = popup.querySelector(".meal-popup-arrow.prev");
    let nextBtn = popup.querySelector(".meal-popup-arrow.next");
    let closeBtn = popup.querySelector(".meal-popup-close");

    let currentImages = [];
    let currentIndex = 0;

    function showImage(index, animate) {
        if (currentImages.length === 0) {
            imgEl.removeAttribute("src");
            return;
        }

        currentIndex =
            (index + currentImages.length) % currentImages.length;

        let src = IMG_PATH + currentImages[currentIndex];

        if (!animate) {
            imgEl.src = src;
            return;
        }

        imgEl.style.opacity = "0";

        setTimeout(function () {
            imgEl.src = src;
            imgEl.style.opacity = "1";
        }, 250);
    }

    prevBtn.addEventListener("click", function () {
        showImage(currentIndex - 1, true);
    });

    nextBtn.addEventListener("click", function () {
        showImage(currentIndex + 1, true);
    });

    window.showPopupMeal = function (id) {
        let meal = allMenu.find(function (item) {
            return item.id === Number(id);
        });

        if (!meal) return;

        nameEl.textContent = meal.name || "";

        priceEl.textContent = "$" + Number(meal.price).toFixed(2);

        // عرض الـ description الكامل وليس miniDescription
        descEl.textContent = meal.description || "";

        currentImages = Array.isArray(meal.images)
            ? meal.images
            : [];

        imgEl.style.opacity = "1";

        showImage(0, false);

        let multiple = currentImages.length > 1;

        prevBtn.style.display = multiple ? "" : "none";
        nextBtn.style.display = multiple ? "" : "none";

        popup.scrollTop = 0;
        box.scrollTop = 0;

        popup.classList.add("show");
        document.body.style.overflow = "hidden";
    };

    window.closePopupMeal = function () {
        popup.classList.remove("show");
        document.body.style.overflow = "";
    };

    closeBtn.addEventListener("click", function () {
        window.closePopupMeal();
    });

    popup.addEventListener("click", function (event) {
        if (!box.contains(event.target)) {
            window.closePopupMeal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            popup.classList.contains("show")
        ) {
            window.closePopupMeal();
        }

        if (
            !popup.classList.contains("show") ||
            currentImages.length < 2
        ) {
            return;
        }

        if (event.key === "ArrowLeft") {
            showImage(currentIndex - 1, true);
        }

        if (event.key === "ArrowRight") {
            showImage(currentIndex + 1, true);
        }
    });

    document.addEventListener("click", function (event) {
        let layout = event.target.closest("#Menu .meal .layout");

        if (layout && layout.dataset.id) {
            window.showPopupMeal(layout.dataset.id);
        }
    });
})();
