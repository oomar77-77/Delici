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
            <button type="button" class="meal-popup-close" aria-label="Close">
                <i class="fa-regular fa-circle-xmark"></i>
            </button>

            <div class="title text-center">
                <h6 class="main-color">SPECIAL SELECTION</h6>
                <img src="./images/separator.svg"
                     class="img-fluid widOfImg" alt="Separator">
                <h2 class="display-5 text-light meal-popup-name"></h2>
            </div>

            <div class="meal-popup-gallery">
                <img class="meal-popup-img" alt="">
                <div class="meal-popup-price"></div>

                <div class="buttons">
                    <button type="button" class="meal-popup-arrow prev"
                            aria-label="Previous meal">
                        <i class="fa-solid fa-angle-left"></i>
                    </button>

                    <button type="button" class="meal-popup-arrow next"
                            aria-label="Next meal">
                        <i class="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            </div>

            <p class="meal-popup-desc"></p>
        </div>
    `;

    document.body.appendChild(popup);

    let get = selector => popup.querySelector(selector);

    let mealIndex = 0;

    function showMeal(meal) {
        if (!meal) return;

        get(".meal-popup-name").textContent = meal.name || "";
        get(".meal-popup-price").textContent =
            "$" + (Number(meal.price) || 0).toFixed(2);
        get(".meal-popup-desc").textContent =
            meal.description || meal.miniDescription || "";

        let images = Array.isArray(meal.images) ? meal.images : [];

        if (images.length > 0) {
            get(".meal-popup-img").src = IMG_PATH + images[0];
            get(".meal-popup-img").alt = meal.name || "";
        } else {
            get(".meal-popup-img").removeAttribute("src");
        }

        popup.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    window.showPopupMeal = function (id) {
        mealIndex = allMenu.findIndex(
            item => Number(item.id) === Number(id)
        );

        if (mealIndex === -1) return;

        showMeal(allMenu[mealIndex]);
    };

    function changeMeal(step) {
        if (!allMenu || allMenu.length === 0) return;

        mealIndex = (mealIndex + step + allMenu.length) % allMenu.length;

        showMeal(allMenu[mealIndex]);
    }

    get(".meal-popup-arrow.prev").onclick = function (event) {
        event.stopPropagation();
        changeMeal(-1);
    };

    get(".meal-popup-arrow.next").onclick = function (event) {
        event.stopPropagation();
        changeMeal(1);
    };

    window.closePopupMeal = function () {
        popup.classList.remove("show");
        document.body.style.overflow = "";
    };

    get(".meal-popup-close").onclick = window.closePopupMeal;

    popup.onclick = function (event) {
        if (event.target === popup) {
            window.closePopupMeal();
        }
    };

    document.addEventListener("click", function (event) {
        let layout = event.target.closest("#Menu .meal .layout");

        if (layout && layout.dataset.id) {
            window.showPopupMeal(layout.dataset.id);
        }
    });
})();
