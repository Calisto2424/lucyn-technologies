/* ==================================================
   LUCYN TCL — JS
   (menu + header + ano + scroll reveal + formulário)
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
                if (
                    !navigation.contains(e.target) &&
                    !toggle.contains(e.target)
                ) {
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

            document
                .querySelectorAll(
                    ".ls-grid, .projects-grid, .process-grid, .partners-logos, .stats-grid, .mvv-grid"
                )
                .forEach((group) => {
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
                showAll();
            } else {
                const vh =
                    window.innerHeight ||
                    document.documentElement.clientHeight;

                reveals.forEach((el) => {
                    const r = el.getBoundingClientRect();
                    if (r.top < vh * 0.9 && r.bottom > 0) {
                        el.classList.add("is-visible");
                    }
                });

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

        /* --- 5. Formulário de contacto --- */
        const form = document.querySelector(".contact-form");

        if (form) {
            const statusEl = form.querySelector(".form-status");
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalLabel = submitBtn ? submitBtn.innerHTML : "";

            const setStatus = (type, message) => {
                if (!statusEl) return;
                statusEl.classList.remove("is-success", "is-error");
                statusEl.classList.add(
                    type === "success" ? "is-success" : "is-error"
                );
                statusEl.textContent = message;
            };

            const clearStatus = () => {
                if (!statusEl) return;
                statusEl.classList.remove("is-success", "is-error");
                statusEl.textContent = "";
            };

            form.addEventListener("submit", async (e) => {
                e.preventDefault();

                // Honeypot anti-spam
                const honey = form.querySelector('input[name="_gotcha"]');
                if (honey && honey.value.trim() !== "") return;

                if (!form.checkValidity()) {
                    form.reportValidity();
                    setStatus(
                        "error",
                        "Por favor, preencha corretamente os campos obrigatórios."
                    );
                    return;
                }

                clearStatus();

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = 'A enviar… <span aria-hidden="true">⋯</span>';
                }

                const endpoint = (form.getAttribute("data-endpoint") || "").trim();
                const formData = new FormData(form);

                try {
                    if (endpoint && endpoint !== "#") {
                        const res = await fetch(endpoint, {
                            method: "POST",
                            headers: { Accept: "application/json" },
                            body: formData
                        });

                        if (!res.ok) throw new Error("Erro no envio");

                        setStatus(
                            "success",
                            "Mensagem enviada com sucesso. Entraremos em contacto em breve."
                        );
                        form.reset();
                    } else {
                        // Fallback: abre o cliente de email do utilizador
                        const subject = encodeURIComponent(
                            `Contacto site — ${formData.get("nome") || "sem nome"}`
                        );
                        const body = encodeURIComponent(
                            `Nome: ${formData.get("nome") || ""}\n` +
                            `Email: ${formData.get("email") || ""}\n` +
                            `Telefone: ${formData.get("telefone") || "-"}\n` +
                            `Empresa: ${formData.get("empresa") || "-"}\n` +
                            `Serviço: ${formData.get("servico") || "-"}\n\n` +
                            `${formData.get("mensagem") || ""}`
                        );

                        window.location.href =
                            `mailto:oficial@lucyn.com?subject=${subject}&body=${body}`;

                        setStatus(
                            "success",
                            "A abrir o seu cliente de email para completar o envio…"
                        );
                    }
                } catch (err) {
                    console.error("[Lucyn] erro formulário:", err);
                    setStatus(
                        "error",
                        "Não foi possível enviar. Tente novamente ou escreva para oficial@lucyn.com."
                    );
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalLabel;
                    }
                }
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();