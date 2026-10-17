
(() => {
    const GA_ID = "G-Y4KGJCHJLN"; // Substitui pelo teu ID real
    const STORAGE_KEY = "lucyn_analytics_consent";

    const readConsent = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    };

    let consent = readConsent();
    let gaLoaded = false;

    // Criar a estrutura do banner
    const banner = document.createElement("section");
    banner.id = "lucyn-consent";
    banner.className = "lucyn-consent";
    banner.setAttribute("aria-label", "Preferências de privacidade");

    banner.innerHTML = `
    <div class="lucyn-consent__content">
      
<img
  class="lucyn-consent__logo"
  src="assets/lucyn-r.webp"
  alt="LUCYN"
/>


      <p class="lucyn-consent__description">
        Utilizamos cookies de análise para compreender como os
        visitantes utilizam o nosso site e melhorar os nossos serviços.
        Pode aceitar, rejeitar ou personalizar as suas preferências.
        <a href="policy.html">Política de privacidade</a>.
      </p>

      <div class="lucyn-consent__actions">
        <button type="button" data-consent="accept">
          Aceitar todos
        </button>
        <button type="button" data-consent="reject">
          Rejeitar
        </button>
        <button type="button" data-consent="settings">
          Personalizar
        </button>
      </div>
    </div>
  `;

    document.body.appendChild(banner);

    // Janela simples de personalização
    const settings = document.createElement("dialog");
    settings.className = "lucyn-consent__dialog";

    settings.innerHTML = `
    <form method="dialog" class="lucyn-consent__settings">
      <h2>Preferências de análise</h2>
      <p>
        Escolha se permite que a LUCYN utilize o Google Analytics
        para compreender a utilização do site.
      </p>
      <label>
        <input type="checkbox" checked id="lucyn-analytics-choice">
        Permitir análise de tráfego
      </label>
      <div class="lucyn-consent__actions">
        <button type="button" id="lucyn-save">Guardar preferências</button>
        <button type="button" id="lucyn-cancel">Cancelar</button>
      </div>
    </form>
  `;

    document.body.appendChild(settings);

    // Estado inicial: negar armazenamento e publicidade.
    // Não carregar o script do Google antes da autorização.
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer.push(arguments);
    };

    window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500
    });

    function loadAnalytics() {
        if (gaLoaded) return;
        gaLoaded = true;

        window.gtag("js", new Date());
        window.gtag("config", GA_ID);

        const script = document.createElement("script");
        script.async = true;
        script.src =
            "https://www.googletagmanager.com/gtag/js?id=" +
            encodeURIComponent(GA_ID);

        document.head.appendChild(script);
    }

    function applyConsent(allowed, save = true) {
        consent = { analytics: allowed, updatedAt: Date.now() };

        if (save) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
        }

        window.gtag("consent", "update", {
            analytics_storage: allowed ? "granted" : "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
        });

        if (allowed) {
            loadAnalytics();
        }

        banner.hidden = true;
        settings.close?.();
    }

    banner.addEventListener("click", (event) => {
        const action = event.target.closest("[data-consent]")?.dataset.consent;

        if (action === "accept") applyConsent(true);
        if (action === "reject") applyConsent(false);

        if (action === "settings") {
            document.getElementById("lucyn-analytics-choice").checked =
                consent?.analytics === true;
            settings.showModal();
        }
    });

    document.getElementById("lucyn-save").addEventListener("click", () => {
        const allowed =
            document.getElementById("lucyn-analytics-choice").checked;
        applyConsent(allowed);
    });

    document.getElementById("lucyn-cancel").addEventListener("click", () => {
        settings.close();
    });

    // Reapresentar o banner se ainda não existir uma escolha
    if (consent && typeof consent.analytics === "boolean") {
        banner.hidden = true;

        if (consent.analytics) {
            window.gtag("consent", "update", {
                analytics_storage: "granted",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied"
            });
            loadAnalytics();
        }
    } else {
        banner.hidden = false;
    }

    // Permitir alterar a escolha posteriormente
    window.LucynConsent = {
        reopen() {
            const checkbox = document.getElementById("lucyn-analytics-choice");
            checkbox.checked = consent?.analytics === true;
            settings.showModal();
        }
    };
})();
