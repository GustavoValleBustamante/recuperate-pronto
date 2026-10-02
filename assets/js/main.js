/*
 * Recupérate pronto — lógica de la tarjeta.
 *
 * Supuesto de despliegue (GitHub Pages):
 *   - /<repo>/          → index.html  (data-route="home")  → sin nombre.
 *   - /<repo>/<Nombre>  → no existe como archivo, GitHub Pages sirve 404.html,
 *                         que es una copia de index.html con data-route="name".
 *   En la ruta "name" el nombre es el último segmento no vacío del pathname,
 *   así que funciona sea cual sea el nombre del repositorio.
 *   El nombre solo se lee de la URL: no se pide, no se guarda, no se hardcodea.
 */
(function () {
  "use strict";

  const MAX_NAME_LENGTH = 50;
  const IGNORED_SEGMENTS = new Set(["index.html", "404.html"]);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 575.98px)").matches;

  /* ---------- Nombre desde la URL ---------- */

  function getNameFromPath() {
    if (document.documentElement.dataset.route !== "name") return null;

    const segments = window.location.pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    if (!last || IGNORED_SEGMENTS.has(last.toLowerCase())) return null;

    let decoded;
    try {
      decoded = decodeURIComponent(last);
    } catch (error) {
      decoded = last; // Secuencia % mal formada: se usa tal cual.
    }

    const cleaned = decoded
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!cleaned) return null;

    const chars = Array.from(cleaned);
    if (chars.length <= MAX_NAME_LENGTH) return cleaned;
    return chars.slice(0, MAX_NAME_LENGTH - 1).join("").trimEnd() + "…";
  }

  function setupNameCard(name) {
    const nameCard = document.getElementById("nameCard");
    const nameText = document.getElementById("nameText");

    if (name) {
      nameText.textContent = name;
      nameCard.hidden = false;
      document.title = `Recupérate pronto, ${name} 🌷`;
    } else {
      nameText.textContent = "";
      nameCard.hidden = true;
    }
  }

  /* ---------- Frase motivadora (una al azar en cada visita) ---------- */

  const QUOTES = [
    "Cada día es un pequeño paso hacia sentirte mejor.",
    "Descansa, respira y recuerda: vienen días más bonitos.",
    "Tu recuperación también merece paciencia, calma y mucho cariño.",
    "Poco a poco también se llega lejos.",
    "Hoy no tienes que poder con todo, solo con lo de hoy.",
    "Las flores también se toman su tiempo para florecer.",
    "Ir despacio también es avanzar.",
    "Mereces descanso, calma y todo el cariño del mundo.",
  ];

  function setupQuote() {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    document.getElementById("quoteText").textContent = `“${quote}”`;
  }

  /* ---------- Flores (SVG inline, colores sólidos) ---------- */

  const C = {
    pink: "#E88FA3",
    pinkDark: "#C96F84",
    blush: "#F7C6D2",
    lavender: "#CDB4DB",
    lavenderDark: "#B396C6",
    green: "#A8D8B9",
    greenDark: "#7FBF98",
    yellow: "#F6C85F",
    white: "#FFFFFF",
  };

  function petals(count, cy, rx, ry, fill, stroke) {
    let out = "";
    for (let i = 0; i < count; i++) {
      out += `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="1.5"` : ""} transform="rotate(${(360 / count) * i} 50 50)"/>`;
    }
    return out;
  }

  const FLOWER_SVGS = {
    blossom: (main, center) =>
      `<svg viewBox="0 0 100 100">${petals(5, 28, 15, 22, main)}<circle cx="50" cy="50" r="11" fill="${center}"/><circle cx="46" cy="46" r="3" fill="${C.white}" opacity=".7"/></svg>`,
    daisy: (main, center) =>
      `<svg viewBox="0 0 100 100">${petals(10, 26, 7, 20, main)}<circle cx="50" cy="50" r="12" fill="${center}"/></svg>`,
    tulip: (main) =>
      `<svg viewBox="0 0 100 100"><path d="M50 58 C50 72 49 84 50 96" stroke="${C.greenDark}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M50 86 C40 80 32 70 34 62 C42 66 48 74 50 86Z" fill="${C.green}"/><path d="M30 26 C30 50 38 60 50 60 C62 60 70 50 70 26 L60 36 L50 20 L40 36Z" fill="${main}"/><path d="M50 20 L58 34 C56 46 54 54 50 60 C46 54 44 46 42 34Z" fill="${C.white}" opacity=".25"/></svg>`,
    sprig: () =>
      `<svg viewBox="0 0 100 100"><path d="M22 86 C40 66 56 44 78 16" stroke="${C.greenDark}" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="58" rx="7" ry="14" fill="${C.green}" transform="rotate(-50 40 58)"/><ellipse cx="54" cy="48" rx="7" ry="14" fill="${C.green}" transform="rotate(40 54 48)"/><ellipse cx="60" cy="32" rx="6" ry="12" fill="${C.green}" transform="rotate(-45 60 32)"/><ellipse cx="72" cy="26" rx="6" ry="11" fill="${C.green}" transform="rotate(40 72 26)"/></svg>`,
  };

  // Posiciones pegadas a los bordes para no tapar el mensaje.
  // "welcome: true" → visibles (estáticas) ya en la pantalla inicial.
  const FLOWERS = [
    { type: "blossom", colors: [C.pink, C.yellow], x: 6, y: 8, size: 84, welcome: true, mobile: true },
    { type: "tulip", colors: [C.lavender], x: 84, y: 12, size: 76, welcome: true, mobile: true },
    { type: "daisy", colors: [C.blush, C.yellow], x: 86, y: 74, size: 80, welcome: true, mobile: true },
    { type: "sprig", colors: [], x: 4, y: 76, size: 88, welcome: true, mobile: true },
    { type: "daisy", colors: [C.lavender, C.yellow], x: 12, y: 42, size: 56, mobile: true },
    { type: "blossom", colors: [C.lavenderDark, C.yellow], x: 80, y: 44, size: 60, mobile: true },
    { type: "tulip", colors: [C.pink], x: 26, y: 88, size: 58 },
    { type: "blossom", colors: [C.blush, C.pinkDark], x: 66, y: 4, size: 54 },
    { type: "sprig", colors: [], x: 92, y: 30, size: 60 },
    { type: "daisy", colors: [C.pink, C.yellow], x: 62, y: 88, size: 52 },
  ];

  const SPARKLES = [
    { x: 20, y: 18 }, { x: 74, y: 22 }, { x: 16, y: 64 },
    { x: 88, y: 58 }, { x: 44, y: 8 }, { x: 50, y: 94 },
  ];

  function createFlowers(layer) {
    const list = FLOWERS.filter((f) => !isMobile || f.mobile);
    const scale = isMobile ? 0.62 : 1;

    return list.map((f) => {
      const el = document.createElement("div");
      el.className = "flower";
      el.style.left = `${f.x}%`;
      el.style.top = `${f.y}%`;
      el.style.setProperty("--size", `${Math.round(f.size * scale)}px`);
      // Markup estático definido arriba; nunca contiene datos de la URL.
      el.innerHTML = FLOWER_SVGS[f.type](...f.colors);
      el.dataset.welcome = f.welcome ? "true" : "false";
      layer.appendChild(el);
      return el;
    });
  }

  function createSparkles(layer) {
    const list = isMobile ? SPARKLES.slice(0, 3) : SPARKLES;
    return list.map((s) => {
      const el = document.createElement("span");
      el.className = "sparkle";
      el.style.left = `${s.x}%`;
      el.style.top = `${s.y}%`;
      layer.appendChild(el);
      return el;
    });
  }

  /* ---------- Estado inicial ---------- */

  let flowers = [];
  let sparkles = [];

  function setupInitialState() {
    const layer = document.getElementById("flowerLayer");
    flowers = createFlowers(layer);
    sparkles = prefersReducedMotion ? [] : createSparkles(layer);

    // Antes del clic: solo una composición estática y ligera.
    flowers.forEach((el, i) => {
      const isWelcome = el.dataset.welcome === "true";
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        rotation: (i % 2 ? 1 : -1) * (8 + i * 3),
        opacity: isWelcome ? 0.9 : 0,
        scale: isWelcome ? 1 : 0.6,
      });
    });
  }

  /* ---------- Animaciones de flores (tras el clic) ---------- */

  function createFlowerAnimations() {
    const hidden = flowers.filter((el) => el.dataset.welcome !== "true");

    if (prefersReducedMotion) {
      gsap.to(hidden, { opacity: 0.9, scale: 1, duration: 0.4 });
      return;
    }

    gsap.to(hidden, {
      opacity: 0.9,
      scale: 1,
      duration: 1.2,
      ease: "back.out(1.4)",
      stagger: 0.12,
    });

    // Flotación suave: solo transform, pocas instancias, ciclos largos.
    flowers.forEach((el) => {
      gsap.to(el, {
        y: gsap.utils.random(-18, -8),
        rotation: `+=${gsap.utils.random(-12, 12)}`,
        duration: gsap.utils.random(3.5, 5.5),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: gsap.utils.random(0, 1.5),
      });
    });

    sparkles.forEach((el) => {
      gsap.to(el, {
        opacity: 0.85,
        scale: 1.4,
        duration: gsap.utils.random(1.4, 2.4),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: gsap.utils.random(0.5, 3),
        repeatDelay: gsap.utils.random(0.5, 2),
      });
    });
  }

  /* ---------- Experiencia principal ---------- */

  function startExperience(button) {
    const welcome = document.getElementById("welcomeScreen");
    const main = document.getElementById("mainContent");
    const nameCard = document.getElementById("nameCard");
    const title = document.getElementById("mainTitle");
    const card = main.querySelector(".message-card");
    const messageParts = card.querySelectorAll(".title-serif, .message, .quote, .signature");

    button.disabled = true;
    const fast = prefersReducedMotion;

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => title.focus({ preventScroll: true }),
    });

    if (!fast) {
      tl.to(button, { scale: 0.92, duration: 0.12, ease: "power1.in" })
        .to(button, { scale: 1, duration: 0.2 });
    }

    tl.to(welcome, { opacity: 0, y: fast ? 0 : -30, duration: fast ? 0.3 : 0.7, ease: "power2.in" })
      .call(() => {
        welcome.hidden = true;
        main.hidden = false;
        window.scrollTo(0, 0);
      })
      .fromTo(main, { opacity: 0, y: fast ? 0 : 30 }, { opacity: 1, y: 0, duration: fast ? 0.4 : 0.9 })
      .call(createFlowerAnimations, null, "<");

    if (!nameCard.hidden) {
      tl.fromTo(
        nameCard,
        { opacity: 0, scale: fast ? 1 : 0.8 },
        { opacity: 1, scale: 1, duration: fast ? 0.3 : 0.7, ease: fast ? "none" : "back.out(1.6)" },
        "-=0.5"
      );
    }

    if (fast) {
      tl.fromTo(messageParts, { opacity: 0 }, { opacity: 1, duration: 0.3 }, "<");
    } else {
      tl.fromTo(
        messageParts,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
        "-=0.3"
      );
    }
  }

  /* ---------- Arranque ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    const name = getNameFromPath();
    setupNameCard(name);
    setupQuote();

    const button = document.getElementById("startExperience");

    if (typeof window.gsap === "undefined") {
      // Sin GSAP (CDN caído): la tarjeta sigue funcionando sin animaciones.
      button.addEventListener("click", () => {
        document.getElementById("welcomeScreen").hidden = true;
        const main = document.getElementById("mainContent");
        main.hidden = false;
        main.style.opacity = "1";
        document.getElementById("mainTitle").focus();
      }, { once: true });
      return;
    }

    setupInitialState();
    button.addEventListener("click", () => startExperience(button), { once: true });
  });
})();
