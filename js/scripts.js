/* ==================================================
   LUCYN TCL — JS (menu + header + ano)
================================================== */

(function () {
    "use strict";

    function init() {
        console.log("[Lucyn] JS iniciado");

        /* --- Referências --- */
        const header = document.querySelector(".site-header");
        const toggle = document.querySelector(".menu-toggle");
        const navigation = document.querySelector(".primary-navigation");
        const yearEl = document.querySelector("#current-year");

        /* --- 1. Ano no rodapé --- */
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        /* --- 2. Header ao scroll --- */
        if (header) {
            const onScroll = () => {
                header.classList.toggle("is-scrolled", window.scrollY > 8);
            };
            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
        }

        /* --- 3. Menu mobile --- */
        if (toggle && navigation) {
            const setOpen = (open) => {
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
                toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
                navigation.classList.toggle("is-open", open);
                document.body.classList.toggle("menu-open", open);
            };

            toggle.addEventListener("click", (e) => {
                e.stopPropagation();
                const isOpen = toggle.getAttribute("aria-expanded") === "true";
                setOpen(!isOpen);
                console.log("[Lucyn] menu →", !isOpen ? "aberto" : "fechado");
            });

            // Fechar ao clicar num link
            navigation.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => setOpen(false));
            });

            // Fechar com Escape
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") setOpen(false);
            });

            // Fechar ao clicar fora
            document.addEventListener("click", (e) => {
                if (
                    !navigation.contains(e.target) &&
                    !toggle.contains(e.target)
                ) {
                    setOpen(false);
                }
            });

            // Fechar ao redimensionar para desktop
            window.addEventListener("resize", () => {
                if (window.innerWidth > 700) setOpen(false);
            });
        } else {
            console.warn("[Lucyn] Menu toggle ou nav não encontrados no DOM.");
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
/* ==================================================
   LUCYN TCL — JS (menu + header + ano + scroll reveal)
================================================== */

(function () {
    "use strict";

    function init() {
        console.log("[Lucyn] JS iniciado");

        const header = document.querySelector(".site-header");
        const toggle = document.querySelector(".menu-toggle");
        const navigation = document.querySelector(".primary-navigation");
        const yearEl = document.querySelector("#current-year");

        /* --- 1. Ano no rodapé --- */
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        /* --- 2. Header ao scroll --- */
        if (header) {
            const onScroll = () => {
                header.classList.toggle("is-scrolled", window.scrollY > 8);
            };
            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
        }

        /* --- 3. Menu mobile --- */
        if (toggle && navigation) {
            const setOpen = (open) => {
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
                toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
                navigation.classList.toggle("is-open", open);
                document.body.classList.toggle("menu-open", open);
            };

            toggle.addEventListener("click", (e) => {
                e.stopPropagation();
                const isOpen = toggle.getAttribute("aria-expanded") === "true";
                setOpen(!isOpen);
            });

            navigation.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => setOpen(false));
            });

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") setOpen(false);
            });

            document.addEventListener("click", (e) => {
                if (!navigation.contains(e.target) && !toggle.contains(e.target)) {
                    setOpen(false);
                }
            });

            window.addEventListener("resize", () => {
                if (window.innerWidth > 700) setOpen(false);
            });
        }

        /* --- 4. Scroll reveal --- */
        const reveals = document.querySelectorAll("[data-scroll-reveal]");
        console.log("[Lucyn] elementos reveal:", reveals.length);

        if (reveals.length > 0) {

            // Cascata em grupos (cartões aparecem um a seguir ao outro)
            document.querySelectorAll(
                ".ls-grid, .projects-grid, .process-grid, .partners-logos"
            ).forEach((group) => {
                Array.from(group.children).forEach((el, i) => {
                    el.style.setProperty(
                        "--scroll-delay",
                        `${Math.min(i * 90, 270)}ms`
                    );
                });
            });

            const showAll = () =>
                reveals.forEach((el) => el.classList.add("is-visible"));

            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            if (reduceMotion || !("IntersectionObserver" in window)) {
                // Sem animação: mostra tudo imediatamente
                showAll();
            } else {
                // 4a. Marca já visíveis os que estão dentro do viewport
                const vh = window.innerHeight || document.documentElement.clientHeight;
                reveals.forEach((el) => {
                    const r = el.getBoundingClientRect();
                    if (r.top < vh * 0.9 && r.bottom > 0) {
                        el.classList.add("is-visible");
                    }
                });

                // 4b. Observer para o resto
                const observer = new IntersectionObserver(
                    (entries, obs) => {
                        entries.forEach((entry) => {
                            if (!entry.isIntersecting) return;
                            entry.target.classList.add("is-visible");
                            obs.unobserve(entry.target);
                        });
                    },
                    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
                );

                reveals.forEach((el) => {
                    if (!el.classList.contains("is-visible")) {
                        observer.observe(el);
                    }
                });

                // 4c. Rede de segurança: se algo ficar preso, revela ao fim de 2s
                setTimeout(() => {
                    const hidden = Array.from(reveals).filter(
                        (el) => !el.classList.contains("is-visible")
                    );
                    if (hidden.length) {
                        console.warn(
                            "[Lucyn] fallback: forçar visibilidade em",
                            hidden.length,
                            "elementos"
                        );
                        hidden.forEach((el) => el.classList.add("is-visible"));
                    }
                }, 2000);
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();