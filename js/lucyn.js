
/* =========================================================
   LUCYN TCL — JAVASCRIPT PRINCIPAL
   1. Assistente flutuante
   2. Memória da mensagem automática entre páginas
   3. Menu de navegação móvel
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       1. ASSISTENTE LUCYN
    ===================================================== */

    const assistantGreeting = document.getElementById("assistantGreeting");
    const assistantPopup = document.getElementById("assistantPopup");
    const assistantLauncher = document.getElementById("assistantLauncher");
    const assistantChatNow = document.getElementById("assistantChatNow");
    const assistantNoThanks = document.getElementById("assistantNoThanks");

    // Chave partilhada por todas as páginas do site.
    const ASSISTANT_DISMISSED_KEY = "lucyn_assistant_greeting_dismissed";

    // Verifica se todos os elementos do assistente existem nesta página.
    const hasAssistant = Boolean(
        assistantGreeting &&
        assistantPopup &&
        assistantLauncher &&
        assistantChatNow &&
        assistantNoThanks
    );

    if (hasAssistant) {

        /* Guardar a preferência do visitante */
        function saveGreetingDismissal() {
            try {
                localStorage.setItem(ASSISTANT_DISMISSED_KEY, "true");
            } catch (error) {
                // O assistente continua funcional se o armazenamento falhar.
            }
        }

        /* Esconder definitivamente a mensagem automática */
        function hideGreeting() {
            assistantGreeting.classList.add("is-hidden");
            saveGreetingDismissal();
        }

        /* Abrir a janela de serviços */
        function openAssistant() {
            hideGreeting();

            assistantPopup.classList.add("is-open");
            assistantPopup.setAttribute("aria-hidden", "false");

            assistantLauncher.classList.add("is-open");
            assistantLauncher.setAttribute("aria-expanded", "true");
            assistantLauncher.setAttribute(
                "aria-label",
                "Fechar janela de ajuda"
            );
        }

        /* Fechar a janela de serviços */
        function closeAssistant() {
            assistantPopup.classList.remove("is-open");
            assistantPopup.setAttribute("aria-hidden", "true");

            assistantLauncher.classList.remove("is-open");
            assistantLauncher.setAttribute("aria-expanded", "false");
            assistantLauncher.setAttribute(
                "aria-label",
                "Abrir janela de ajuda"
            );
        }

        /* Verificar se a mensagem já foi dispensada */
        try {
            const greetingDismissed =
                localStorage.getItem(ASSISTANT_DISMISSED_KEY) === "true";

            if (greetingDismissed) {
                assistantGreeting.classList.add("is-hidden");
            }
        } catch (error) {
            // Se o armazenamento não estiver disponível,
            // a mensagem permanece no seu estado inicial.
        }

        /* Botão "Conversar agora" */
        assistantChatNow.addEventListener("click", openAssistant);

        /* Botão "Agora não" */
        assistantNoThanks.addEventListener("click", hideGreeting);

        /* Botão flutuante: abrir ou fechar a janela */
        assistantLauncher.addEventListener("click", () => {
            const isOpen = assistantPopup.classList.contains("is-open");

            if (isOpen) {
                closeAssistant();
            } else {
                openAssistant();
            }
        });

        /* Fechar com a tecla Escape */
        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                assistantPopup.classList.contains("is-open")
            ) {
                closeAssistant();
            }
        });
    }


    /* =====================================================
       2. MENU DE NAVEGAÇÃO MÓVEL
    ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.getElementById("primary-navigation");

    // Evita erros em páginas sem menu móvel.
    if (menuToggle && navigation) {

        function closeMenu() {
            navigation.classList.remove("is-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open menu");
        }

        /* Abrir ou fechar o menu */
        menuToggle.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("is-open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );
        });

        /* Fechar ao selecionar um link */
        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        /* Fechar com Escape */
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        /* Fechar o menu móvel ao aumentar a janela */
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }
});
