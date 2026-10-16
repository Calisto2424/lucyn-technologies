
/* =====================================================
   LUCYN TCL — SERVICES INTERACTIONS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Footer year
    const year = document.getElementById("current-year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Respect reduced-motion preferences
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealElements = document.querySelectorAll(
        ".service-detail, " +
        ".approach-heading, " +
        ".approach-steps article, " +
        ".services-contact-inner"
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
});
