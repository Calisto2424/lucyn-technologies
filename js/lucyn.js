
const assistantGreeting = document.getElementById("assistantGreeting");
const assistantPopup = document.getElementById("assistantPopup");
const assistantLauncher = document.getElementById("assistantLauncher");
const assistantChatNow = document.getElementById("assistantChatNow");
const assistantNoThanks = document.getElementById("assistantNoThanks");

function openAssistant() {
    assistantGreeting.classList.add("is-hidden");
    assistantPopup.classList.add("is-open");
    assistantPopup.setAttribute("aria-hidden", "false");
    assistantLauncher.classList.add("is-open");
    assistantLauncher.setAttribute("aria-expanded", "true");
}

function closeAssistant() {
    assistantPopup.classList.remove("is-open");
    assistantPopup.setAttribute("aria-hidden", "true");
    assistantLauncher.classList.remove("is-open");
    assistantLauncher.setAttribute("aria-expanded", "false");
}

assistantChatNow.addEventListener("click", openAssistant);

assistantNoThanks.addEventListener("click", () => {
    assistantGreeting.classList.add("is-hidden");
});

assistantLauncher.addEventListener("click", () => {
    if (assistantPopup.classList.contains("is-open")) {
        closeAssistant();
    } else {
        openAssistant();
    }
});






document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.getElementById("primary-navigation");

    if (!menuToggle || !navigation) return;

    function closeMenu() {
        navigation.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) closeMenu();
    });
});
