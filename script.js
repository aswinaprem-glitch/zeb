```javascript
/* =========================================================
   QUICKBITE FOOD DELIVERY WEBSITE
   JAVASCRIPT
========================================================= */


/* =========================================================
   1. DATA
========================================================= */

const foodData = [
    {
        name: "Chicken Biryani",
        restaurant: "Spice Route",
        category: "Biryani",
        price: 180,
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Margherita Pizza",
        restaurant: "La Piazza",
        category: "Pizza",
        price: 249,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Classic Chicken Burger",
        restaurant: "Burger House",
        category: "Burger",
        price: 159,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Paneer Samosa",
        restaurant: "Spice Route",
        category: "Indian",
        price: 90,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80"
    }
];


/* =========================================================
   2. CART
========================================================= */

let cart = JSON.parse(localStorage.getItem("quickbiteCart")) || [];


/* =========================================================
   3. GET HTML ELEMENTS
========================================================= */

const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");

const emptyCart = document.getElementById("emptyCart");
const cartContent = document.getElementById("cartContent");

const cartSubtotal = document.getElementById("cartSubtotal");
const deliveryFee = document.getElementById("deliveryFee");
const taxAmount = document.getElementById("taxAmount");
const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutTotal = document.getElementById("checkoutTotal");

const checkoutForm = document.getElementById("checkoutForm");

const successModal = document.getElementById("successModal");
const closeSuccess = document.getElementById("closeSuccess");
const orderNumber = document.getElementById("orderNumber");
const continueShoppingBtn =
    document.getElementById("continueShoppingBtn");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


/* =========================================================
   4. HELPER FUNCTIONS
========================================================= */

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}


function saveCart() {
    localStorage.setItem(
        "quickbiteCart",
        JSON.stringify(cart)
    );
}


function showToast(message, icon = "✓") {

    const toastIcon = document.getElementById("toastIcon");

    toastMessage.textContent = message;
    toastIcon.textContent = icon;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


function preventBodyScroll() {

    const anyModalOpen =
        document.querySelector(".modal-overlay.show") ||
        cartSidebar.classList.contains("show") ||
        cartOverlay.classList.contains("show");

    document.body.classList.toggle(
        "no-scroll",
        Boolean(anyModalOpen)
    );
}


/* =========================================================
   5. CART FUNCTIONS
========================================================= */

function updateCart() {

    /*
       Calculate total quantity
    */

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;


    /*
       Empty cart
    */

    if (cart.length === 0) {

        emptyCart.style.display = "flex";
        cartContent.classList.remove("show");

        cartSubtotal.textContent = "₹0";
        taxAmount.textContent = "₹0";
        cartTotal.textContent = "₹0";

        return;
    }


    /*
       Show cart
    */

    emptyCart.style.display = "none";
    cartContent.classList.add("show");


    /*
       Generate cart items
    */

    cartItems.innerHTML = "";


    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
                class="cart-item-image"
            >

            <div class="cart-item-details">

                <h4>${item.name}</h4>

                <p>${formatPrice(item.price)}</p>

                <div class="quantity-controls">

                    <button
                        class="quantity-minus"
                        data-index="${index}">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        class="quantity-plus"
                        data-index="${index}">
                        +
                    </button>

                </div>

            </div>

            <div class="cart-item-total">

                ${formatPrice(itemTotal)}

            </div>

        `;

        cartItems.appendChild(cartItem);
    });


    /*
       Calculate subtotal
    */

    const subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );


    /*
       Delivery fee
       Free delivery above ₹500
    */

    const delivery =
        subtotal >= 500 ? 0 : 40;


    /*
       5% tax
    */

    const tax = Math.round(subtotal * 0.05);


    /*
       Final total
    */

    const total =
        subtotal + delivery + tax;


    cartSubtotal.textContent =
        formatPrice(subtotal);

    deliveryFee.textContent =
        delivery === 0
            ? "FREE"
            : formatPrice(delivery);

    taxAmount.textContent =
        formatPrice(tax);

    cartTotal.textContent =
        formatPrice(total);

    checkoutTotal.textContent =
        formatPrice(total);


    /*
       Save cart
    */

    saveCart();
}


/* =========================================================
   ADD ITEM TO CART
========================================================= */

function addToCart(name, price, image) {

    const existingItem = cart.find(
        item => item.name === name
    );


    if (existingItem) {

        existingItem.quantity++;

        showToast(
            `${name} quantity increased`,
            "+"
        );

    } else {

        cart.push({
            name: name,
            price: Number(price),
            image: image,
            quantity: 1
        });

        showToast(
            `${name} added to cart`,
            "✓"
        );
    }


    updateCart();
}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(index, change) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity += change;


    /*
       Remove item if quantity reaches zero
    */

    if (cart[index].quantity <= 0) {

        const removedItem = cart[index].name;

        cart.splice(index, 1);

        showToast(
            `${removedItem} removed`,
            "×"
        );
    }


    updateCart();
}


/* =========================================================
   CART BUTTON EVENTS
========================================================= */

cartBtn.addEventListener("click", () => {

    cartSidebar.classList.add("show");
    cartOverlay.classList.add("show");

    preventBodyScroll();
});


closeCart.addEventListener("click", closeCartSidebar);

cartOverlay.addEventListener(
    "click",
    closeCartSidebar
);


function closeCartSidebar() {

    cartSidebar.classList.remove("show");
    cartOverlay.classList.remove("show");

    preventBodyScroll();
}


/* =========================================================
   CART QUANTITY EVENTS
========================================================= */

cartItems.addEventListener("click", event => {

    const minusButton =
        event.target.closest(".quantity-minus");

    const plusButton =
        event.target.closest(".quantity-plus");


    if (minusButton) {

        const index =
            Number(minusButton.dataset.index);

        changeQuantity(index, -1);
    }


    if (plusButton) {

        const index =
            Number(plusButton.dataset.index);

        changeQuantity(index, 1);
    }
});


/* =========================================================
   6. ADD BUTTONS
========================================================= */

const addButtons =
    document.querySelectorAll(".add-btn");


addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name =
            button.dataset.name;

        const price =
            Number(button.dataset.price);


        /*
           Find food image
        */

        const food =
            foodData.find(
                item => item.name === name
            );


        const image =
            food
                ? food.image
                : "";


        addToCart(
            name,
            price,
            image
        );

    });

});


/* =========================================================
   7. RESTAURANT MENU BUTTONS
========================================================= */

const menuButtons =
    document.querySelectorAll(".menu-btn");


menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        const restaurant =
            button.dataset.restaurant;

        showToast(
            `${restaurant} menu selected`,
            "🍽"
        );


        /*
           Scroll to dishes
        */

        document
            .querySelector(".dishes-section")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


/* =========================================================
   8. RESTAURANT FILTERS
========================================================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const restaurantCards =
    document.querySelectorAll(".restaurant-card");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        /*
           Remove active state
        */

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");


        const filter =
            button.dataset.filter;


        restaurantCards.forEach(card => {

            let show = true;


            if (filter === "rating") {

                const rating =
                    Number(card.dataset.rating);

                show = rating >= 4.0;
            }


            if (filter === "fast") {

                const delivery =
                    Number(card.dataset.delivery);

                show = delivery <= 25;
            }


            if (filter === "veg") {

                /*
                   Demo:
                   restaurants containing Indian
                   category are considered veg-friendly.
                */

                show =
                    card.dataset.category === "Indian";
            }


            if (filter === "offers") {

                show =
                    card.dataset.offer === "true";
            }


            if (filter === "all") {
                show = true;
            }


            card.style.display =
                show ? "" : "none";
        });

    });

});


/* =========================================================
   9. FAVORITES
========================================================= */

const heartButtons =
    document.querySelectorAll(".heart-btn");


heartButtons.forEach(button => {

    button.addEventListener("click", event => {

        event.stopPropagation();

        button.classList.toggle("liked");


        if (button.classList.contains("liked")) {

            button.textContent = "♥";

            showToast(
                "Added to favourites",
                "♥"
            );

        } else {

            button.textContent = "♡";

            showToast(
                "Removed from favourites",
                "♡"
            );
        }

    });

});


/* =========================================================
   10. SEARCH
========================================================= */

const foodSearch =
    document.getElementById("foodSearch");

const heroSearchBtn =
    document.getElementById("heroSearchBtn");

const searchBtn =
    document.getElementById("searchBtn");

const searchOverlay =
    document.getElementById("searchOverlay");

const closeSearch =
    document.getElementById("closeSearch");

const modalSearchInput =
    document.getElementById("modalSearchInput");

const searchResults =
    document.getElementById("searchResults");


/* =========================================================
   OPEN SEARCH
========================================================= */

searchBtn.addEventListener("click", () => {

    searchOverlay.classList.add("show");

    preventBodyScroll();

    setTimeout(() => {
        modalSearchInput.focus();
    }, 250);

});


/* =========================================================
   CLOSE SEARCH
========================================================= */

closeSearch.addEventListener("click", () => {

    searchOverlay.classList.remove("show");

    preventBodyScroll();

});


searchOverlay.addEventListener("click", event => {

    if (event.target === searchOverlay) {

        searchOverlay.classList.remove("show");

        preventBodyScroll();
    }

});


/* =========================================================
   SEARCH FUNCTION
========================================================= */

function performSearch(query) {

    query = query.trim().toLowerCase();


    if (!query) {

        searchResults.innerHTML = `
            <p style="color:#888;font-size:0.8rem;">
                Start typing to search for food or restaurants.
            </p>
        `;

        return;
    }


    const results =
        foodData.filter(item => {

            return (
                item.name.toLowerCase().includes(query) ||
                item.restaurant.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );

        });


    if (results.length === 0) {

        searchResults.innerHTML = `
            <p style="color:#888;font-size:0.8rem;">
                No results found for "${query}".
            </p>
        `;

        return;
    }


    searchResults.innerHTML = "";


    results.forEach(item => {

        const result =
            document.createElement("div");

        result.className = "search-result";

        result.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div style="flex:1;">

                <h4>
                    ${item.name}
                </h4>

                <p>
                    ${item.restaurant}
                    • ${item.category}
                </p>

                <strong>
                    ${formatPrice(item.price)}
                </strong>

            </div>

            <button
                class="add-search-item"
                style="
                    padding:7px 10px;
                    background:#d9572b;
                    color:white;
                    border-radius:5px;
                    font-size:0.7rem;
                "
            >
                + Add
            </button>
        `;


        result
            .querySelector(".add-search-item")
            .addEventListener("click", () => {

                addToCart(
                    item.name,
                    item.price,
                    item.image
                );

            });


        searchResults.appendChild(result);

    });

}


modalSearchInput.addEventListener(
    "input",
    () => {
        performSearch(
            modalSearchInput.value
        );
    }
);


/* =========================================================
   HERO SEARCH
========================================================= */

heroSearchBtn.addEventListener(
    "click",
    () => {

        const query =
            foodSearch.value.trim();


        if (!query) {

            showToast(
                "Please enter something to search",
                "🔍"
            );

            foodSearch.focus();

            return;
        }


        /*
           Open search modal
        */

        searchOverlay.classList.add("show");

        modalSearchInput.value = query;

        performSearch(query);

        preventBodyScroll();

    }
);


/* =========================================================
   ENTER KEY SEARCH
========================================================= */

foodSearch.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            heroSearchBtn.click();
        }

    }
);


/* =========================================================
   11. QUICK SEARCH BUTTONS
========================================================= */

const quickSearchButtons =
    document.querySelectorAll(
        ".quick-search button"
    );


quickSearchButtons.forEach(button => {

    button.addEventListener("click", () => {

        const query =
            button.dataset.search;


        foodSearch.value = query;

        heroSearchBtn.click();

    });

});


/* =========================================================
   12. CATEGORY BUTTONS
========================================================= */

const categoryCards =
    document.querySelectorAll(".category-card");


categoryCards.forEach(card => {

    card.addEventListener("click", () => {

        const category =
            card.dataset.category;


        /*
           Open search modal
        */

        searchOverlay.classList.add("show");

        modalSearchInput.value =
            category;

        performSearch(category);

        preventBodyScroll();

    });

});


/* =========================================================
   13. LOGIN MODAL
========================================================= */

const loginBtn =
    document.getElementById("loginBtn");

const mobileLoginBtn =
    document.getElementById("mobileLoginBtn");

const loginModal =
    document.getElementById("loginModal");

const closeLogin =
    document.getElementById("closeLogin");

const loginForm =
    document.getElementById("loginForm");


function openLogin() {

    loginModal.classList.add("show");

    preventBodyScroll();

}


loginBtn.addEventListener(
    "click",
    openLogin
);


mobileLoginBtn.addEventListener(
    "click",
    event => {

        event.preventDefault();

        openLogin();
    }
);


closeLogin.addEventListener(
    "click",
    () => {

        loginModal.classList.remove("show");

        preventBodyScroll();
    }
);


loginModal.addEventListener(
    "click",
    event => {

        if (event.target === loginModal) {

            loginModal.classList.remove("show");

            preventBodyScroll();
        }

    }
);


/* =========================================================
   LOGIN FORM
========================================================= */

loginForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const email =
            document.getElementById(
                "loginEmail"
            ).value;


        showToast(
            `Welcome back!`,
            "✓"
        );


        loginModal.classList.remove(
            "show"
        );

        preventBodyScroll();


        /*
           Demo login only.
           Real authentication requires a backend.
        */

        console.log(
            "Demo login:",
            email
        );

    }
);


/* =========================================================
   SIGNUP
========================================================= */

const signupLink =
    document.getElementById("signupLink");


signupLink.addEventListener(
    "click",
    event => {

        event.preventDefault();

        showToast(
            "Signup will be added soon",
            "ℹ"
        );

    }
);


/* =========================================================
   14. LOCATION
========================================================= */

const locationBtn =
    document.getElementById("locationBtn");

const locationModal =
    document.getElementById("locationModal");

const closeLocation =
    document.getElementById("closeLocation");

const saveLocationBtn =
    document.getElementById(
        "saveLocationBtn"
    );

const locationInput =
    document.getElementById(
        "locationInput"
    );

const locationText =
    document.getElementById(
        "locationText"
    );


/*
   Load saved location
*/

const savedLocation =
    localStorage.getItem(
        "quickbiteLocation"
    );


if (savedLocation) {

    locationText.textContent =
        savedLocation;
}


/*
   Open location modal
*/

locationBtn.addEventListener(
    "click",
    () => {

        locationModal.classList.add(
            "show"
        );

        locationInput.focus();

        preventBodyScroll();

    }
);


/*
   Close location modal
*/

closeLocation.addEventListener(
    "click",
    () => {

        locationModal.classList.remove(
            "show"
        );

        preventBodyScroll();

    }
);


/*
   Save location
*/

saveLocationBtn.addEventListener(
    "click",
    () => {

        const location =
            locationInput.value.trim();


        if (!location) {

            showToast(
                "Please enter your location",
                "!"
            );

            locationInput.focus();

            return;
        }


        locationText.textContent =
            location;


        localStorage.setItem(
            "quickbiteLocation",
            location
        );


        locationModal.classList.remove(
            "show"
        );

        preventBodyScroll();


        showToast(
            "Location saved",
            "📍"
        );

    }
);


/* =========================================================
   15. CHECKOUT
========================================================= */

checkoutBtn.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            showToast(
                "Your cart is empty",
                "!"
            );

            return;
        }


        /*
           Close cart
        */

        closeCartSidebar();


        /*
           Update checkout amount
        */

        updateCart();


        checkoutModal.classList.add(
            "show"
        );

        preventBodyScroll();

    }
);


/*
   Close checkout
*/

closeCheckout.addEventListener(
    "click",
    () => {

        checkoutModal.classList.remove(
            "show"
        );

        preventBodyScroll();

    }
);


/* =========================================================
   16. PLACE ORDER
========================================================= */

checkoutForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (cart.length === 0) {

            showToast(
                "Your cart is empty",
                "!"
            );

            return;
        }


        /*
           Generate random order number
        */

        const generatedNumber =
            Math.floor(
                1000 +
                Math.random() * 9000
            );


        orderNumber.textContent =
            generatedNumber;


        /*
           Close checkout
        */

        checkoutModal.classList.remove(
            "show"
        );


        /*
           Clear cart
        */

        cart = [];

        saveCart();

        updateCart();


        /*
           Show success
        */

        successModal.classList.add(
            "show"
        );

        preventBodyScroll();


        /*
           Reset checkout form
        */

        checkoutForm.reset();


        showToast(
            "Order successfully placed!",
            "✓"
        );

    }
);


/* =========================================================
   17. SUCCESS MODAL
========================================================= */

closeSuccess.addEventListener(
    "click",
    () => {

        successModal.classList.remove(
            "show"
        );

        preventBodyScroll();

    }
);


continueShoppingBtn.addEventListener(
    "click",
    () => {

        successModal.classList.remove(
            "show"
        );

        preventBodyScroll();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   18. OFFER BUTTON
========================================================= */

const offerBtn =
    document.getElementById("offerBtn");


offerBtn.addEventListener(
    "click",
    () => {

        document
            .getElementById("restaurants")
            .scrollIntoView({
                behavior: "smooth"
            });

        showToast(
            "Choose a restaurant to use your offer",
            "🏷"
        );

    }
);


/* =========================================================
   19. VIEW ALL RESTAURANTS
========================================================= */

const viewAllRestaurants =
    document.getElementById(
        "viewAllRestaurants"
    );


viewAllRestaurants.addEventListener(
    "click",
    event => {

        event.preventDefault();


        filterButtons.forEach(btn => {
            btn.classList.remove(
                "active"
            );
        });


        filterButtons[0].classList.add(
            "active"
        );


        restaurantCards.forEach(card => {
            card.style.display = "";
        });


        document
            .getElementById("restaurants")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =========================================================
   20. MOBILE MENU
========================================================= */

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );

const mobileNav =
    document.getElementById(
        "mobileNav"
    );


mobileMenuBtn.addEventListener(
    "click",
    () => {

        mobileNav.classList.toggle(
            "show"
        );

    }
);


/*
   Close mobile menu when link clicked
*/

mobileNav
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileNav.classList.remove(
                    "show"
                );

            }
        );

    });


/* =========================================================
   21. CLOSE MODALS WITH ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        searchOverlay.classList.remove(
            "show"
        );

        loginModal.classList.remove(
            "show"
        );

        checkoutModal.classList.remove(
            "show"
        );

        successModal.classList.remove(
            "show"
        );

        locationModal.classList.remove(
            "show"
        );


        closeCartSidebar();


        preventBodyScroll();

    }
);


/* =========================================================
   22. INITIALIZE WEBSITE
========================================================= */

updateCart();


console.log(
    "QuickBite website loaded successfully."
);
```
