
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");

    // Ano automático no footer
    const year = document.getElementById("current-year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    if (!form) return;

    const whatsappNumber = "258835234230";
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const name = document.getElementById("name").value.trim();
        const business = document.getElementById("business").value.trim();
        const email = document.getElementById("email").value.trim();
        const subjectSelect = document.getElementById("subject");
        const subject = subjectSelect.options[
            subjectSelect.selectedIndex
        ].text;
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message || !subjectSelect.value) {
            status.textContent = "Please complete all required fields.";
            status.classList.add("is-error");
            return;
        }

        const whatsappMessage = [
            "Hello Lucyn TCL! I'd like to make an enquiry.",
            "",
            "CONTACT DETAILS",
            `Name: ${name} `,
            `Business: ${business || "Not provided"} `,
            `Email: ${email} `,
            "",
            "ENQUIRY",
            `Subject: ${subject} `,
            `Message: ${message} `,
            "",
            "Sent via the Lucyn TCL website."
        ].join("\n");

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;



        const whatsappWindow = window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

        // Fallback for browsers that block new windows
        if (!whatsappWindow) {
            window.location.href = whatsappURL;
        }
    });
});
