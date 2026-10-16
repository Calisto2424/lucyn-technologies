
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