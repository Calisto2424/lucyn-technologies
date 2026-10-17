
// Current year
document.getElementById("currentYear").textContent =
    new Date().getFullYear();

// Render Lucide icons
if (window.lucide) {
    window.lucide.createIcons();
}

// Form feedback
const partnerForm = document.getElementById("partnerForm");
const partnerFormNote = document.getElementById("partnerFormNote");

partnerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    partnerFormNote.textContent =
        "The form is ready, but submission has not been connected yet.";
});
