const menu1 = document.getElementById("menu1");
const submenu1 = document.getElementById("submenu1");
const submenuBoxes = submenu1 ? submenu1.querySelectorAll(".submenu-box") : [];
const menu4 = document.querySelector(".menu-item.menu4");
const langToggleBtn = document.getElementById("lang-toggle");
const btnUpward = document.getElementById("btn-upward");

// References for tool icons
const menuTranslate = document.getElementById("lang-toggle");
const menuUpward = document.getElementById("btn-upward");
const themeToggleBtn = document.getElementById("theme-toggle");
const menuMotionBtn = document.getElementById("motion-toggle");
const menuAboutMe = document.getElementById("menu-about-me");

const typingDelay = 50;
let showTimeouts = [];
let hideTimeouts = [];
let isMobileMenuOpen = false;

/* =========================================
   1. MENU & SUBMENU LOGIC (FIXED CLICK)
   ========================================= */

if (menu1 && submenu1) {
  function positionSubmenu() {
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
      const rect = menuAboutMe.getBoundingClientRect();
      submenu1.style.top = rect.bottom + 5 + "px";
      submenu1.style.left = "auto";
      submenu1.style.right = "10px";
    } else {
      const rect = menu1.getBoundingClientRect();
      submenu1.style.top = rect.bottom + 3 + "px";
      submenu1.style.left = rect.left + "px";
      submenu1.style.right = "auto";
    }
  }

  positionSubmenu();
  window.addEventListener("resize", positionSubmenu);
  window.addEventListener("scroll", positionSubmenu);

  function showSubmenu() {
    if (window.innerWidth > 900) {
      if (menu4) menu4.style.display = "none";
      if (menuTranslate) menuTranslate.style.display = "none";
      if (menuUpward) menuUpward.style.display = "none";
      if (themeToggleBtn) themeToggleBtn.style.display = "none";
      if (menuMotionBtn) menuMotionBtn.style.display = "none";
    }

    showTimeouts.forEach((t) => clearTimeout(t));
    submenuBoxes.forEach((box, index) => {
      box.style.display = "inline-flex";
      // ATIVA OS CLIQUES QUANDO O MENU APARECE
      box.style.pointerEvents = "auto";

      const timeout = setTimeout(() => {
        box.style.opacity = 1;
      }, index * typingDelay);
      showTimeouts.push(timeout);
    });
  }

  function hideSubmenu() {
    if (window.innerWidth > 900) {
      if (menu4) menu4.style.display = "flex";
      if (menuTranslate) menuTranslate.style.display = "flex";
      if (menuUpward) menuUpward.style.display = "flex";
      if (themeToggleBtn) themeToggleBtn.style.display = "flex";
      if (menuMotionBtn) menuMotionBtn.style.display = "flex";
    }

    submenuBoxes.forEach((box) => {
      box.style.opacity = 0;
      // DESATIVA OS CLIQUES IMEDIATAMENTE AO ESCONDER
      box.style.pointerEvents = "none";
    });
    hideTimeouts.forEach((t) => clearTimeout(t));
  }

  let hoverTimeout;
  const delay = 100;

  menu1.addEventListener("mouseenter", () => {
    if (window.innerWidth > 900) {
      clearTimeout(hoverTimeout);
      showSubmenu();
    }
  });

  menu1.addEventListener("mouseleave", () => {
    if (window.innerWidth > 900) {
      hoverTimeout = setTimeout(hideSubmenu, delay);
    }
  });

  submenu1.addEventListener("mouseenter", () => {
    if (window.innerWidth > 900) {
      clearTimeout(hoverTimeout);
    }
  });

  submenu1.addEventListener("mouseleave", () => {
    if (window.innerWidth > 900) {
      hoverTimeout = setTimeout(hideSubmenu, delay);
    }
  });

  const portfolioLink = menu1.querySelector("a");
  if (portfolioLink) {
    portfolioLink.addEventListener("click", (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        if (!isMobileMenuOpen) {
          positionSubmenu();
          showSubmenu();
          isMobileMenuOpen = true;
        } else {
          hideSubmenu();
          isMobileMenuOpen = false;
        }
      }
    });
  }
}

/* =========================================
   2. LANGUAGE TOGGLE LOGIC
   ========================================= */

let currentLang = localStorage.getItem("lang") || "pt";

function translateContent(lang) {
  const translatableElements = document.querySelectorAll("[data-en][data-pt]");
  translatableElements.forEach((el) => {
    if (lang === "en") {
      el.innerText = el.getAttribute("data-en");
    } else {
      el.innerText = el.getAttribute("data-pt");
    }
  });
  document.documentElement.lang = lang;

  // Update the toggle icon to show the NEXT available language
  const langIcon = document.querySelector("#lang-toggle .nav-icon");
  if (langIcon) {
    if (lang === "en") {
      // Site is in English -> Show Portuguese flag to switch back
      langIcon.src = "assets/icons/portuguese.svg";
      langIcon.alt = "Português";
    } else {
      // Site is in Portuguese -> Show English flag to switch
      langIcon.src = "assets/icons/english.svg";
      langIcon.alt = "English";
    }
  }

  // Re-initialize the shake effect because the text nodes were replaced
  if (window.initShake) {
    window.initShake();
  }
}

// Initialize on load
translateContent(currentLang);

if (langToggleBtn) {
  langToggleBtn.addEventListener("click", () => {
    currentLang = currentLang === "pt" ? "en" : "pt";
    localStorage.setItem("lang", currentLang);
    translateContent(currentLang);
  });
}

/* =========================================
   3. UTILITY SCROLL LOGIC
   ========================================= */

function scrollToTarget(targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: "smooth",
    });
  }
}

if (btnUpward) {
  btnUpward.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (menuAboutMe) {
  menuAboutMe.addEventListener("click", (e) => {
    e.preventDefault();
    menuAboutMe.style.transform = "translateY(1px)";
    setTimeout(() => {
      menuAboutMe.style.transform = "translateY(0)";
    }, 200);

    if (
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname.endsWith("/")
    ) {
      scrollToTarget("target");
    } else {
      window.location.href = "index.html#target";
    }
  });
}

/* =========================================
   4. DARK / LIGHT MODE LOGIC
   ========================================= */
if (themeToggleBtn) {
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      applyTheme("light");
    } else {
      applyTheme("dark");
    }
  });
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
} else {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

/* =========================================
   5. DYNAMIC MENU COLORS ON SCROLL (INDEX)
   ========================================= */

const scrollSections = [
  {
    element: document.querySelector(".banner-main"),
    bgColorVar: "--color-tag-main",
    textColor: "#ffffff",
  },
  {
    element: document.querySelector(".banner-1"),
    bgColorVar: "--color-tag-1",
    textColor: "#ffffff",
  },
  {
    element: document.querySelector(".banner-2"),
    bgColorVar: "--color-tag-2",
    textColor: "#ffffff",
  },
];

function updateMenuColorsOnScroll() {
  if (!document.querySelector(".banner-main")) return;

  const scrollPosition = window.scrollY;
  const triggerOffset = 50;
  let activeSection = null;

  scrollSections.forEach((section) => {
    if (section.element) {
      const rect = section.element.getBoundingClientRect();
      if (rect.top <= triggerOffset && rect.bottom >= triggerOffset) {
        activeSection = section;
      }
    }
  });

  const root = document.documentElement;

  if (activeSection) {
    const newBgColor = getComputedStyle(root)
      .getPropertyValue(activeSection.bgColorVar)
      .trim();

    root.style.setProperty("--menu-bg", newBgColor);
    root.style.setProperty("--menu-text", activeSection.textColor);
    root.style.setProperty("--icon-filter", "invert(1)");
  } else {
    root.style.removeProperty("--menu-bg");
    root.style.removeProperty("--menu-text");
    root.style.removeProperty("--icon-filter");
  }
}

window.addEventListener("scroll", updateMenuColorsOnScroll);
window.addEventListener("load", updateMenuColorsOnScroll);

/* =========================================
   6. CAROUSEL LOGIC (3D RING + MANUAL NAV + FILTERING)
   ========================================= */
const carouselTrack = document.querySelector(".carousel-track");
const carouselItems = document.querySelectorAll(".carousel-item");
const carouselSection = document.querySelector(".carousel-section");
const btnPrev = document.getElementById("carousel-prev");
const btnNext = document.getElementById("carousel-next");
const filterBtns = document.querySelectorAll(".filter-btn"); // Added for filtering

if (carouselTrack && carouselItems.length > 0 && carouselSection) {
  let isReactive = true;
  let mouseX = 0,
    mouseY = 0;
  let containerCenterX = 0,
    containerCenterY = 0;

  // Manual Navigation State
  let rotationOffset = 0;
  let currentRotation = 0;
  const angleStep = (Math.PI * 2) / carouselItems.length;

  /* --- UPDATED: Category Filtering Logic --- */
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      carouselItems.forEach((item) => {
        // Get the tags and convert to an array (split by space)
        const itemCategories = item.getAttribute("data-category") || "";
        const categoriesArray = itemCategories.split(" ");

        // Check if it's "all" OR if the array contains the specific tag
        if (filterValue === "all" || categoriesArray.includes(filterValue)) {
          item.classList.remove("is-dimmed");
        } else {
          item.classList.add("is-dimmed");
        }
      });
    });
  });

  // Motion Toggle (if exists in your header)
  if (typeof menuMotionBtn !== "undefined" && menuMotionBtn) {
    menuMotionBtn.addEventListener("click", () => {
      isReactive = !isReactive;
      menuMotionBtn.classList.toggle("inactive", !isReactive);
    });
  }

  // Button Listeners: Increment/Decrement the target rotation
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      rotationOffset += angleStep;
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      rotationOffset -= angleStep;
    });
  }

  function updateMousePosition(e) {
    const rect = carouselSection.getBoundingClientRect();

    // Calculate center based on the actual visible section on screen
    containerCenterX = rect.left + rect.width / 2;
    containerCenterY = rect.top + rect.height / 2;

    mouseX = e.clientX - containerCenterX;
    mouseY = e.clientY - containerCenterY;
  }

  window.addEventListener("mousemove", updateMousePosition);
  window.addEventListener("resize", () => {
    const rect = carouselSection.getBoundingClientRect();
    containerCenterX = rect.left + rect.width / 2;
    containerCenterY = rect.top + rect.height / 2;
    maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.35; // Update radius on resize
  });

  let currentTiltX = 0,
    targetTiltX = 0;
  let currentTiltY = 0,
    targetTiltY = 0;
  let currentRepulseX = 0,
    targetRepulseX = 0;
  let currentRepulseY = 0,
    targetRepulseY = 0;

  const minRadius = 80;
  let maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
  let currentRadius = maxRadius;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

  function animateCarousel() {
    const lerpFactor = 0.2;
    const rotationLerp = 0.15;
    const radiusLerp = 0.15;

    // 1. Smoothly interpolate the rotation to the target offset
    currentRotation = lerp(currentRotation, rotationOffset, rotationLerp);

    if (isReactive) {
      targetTiltY = map(
        mouseX,
        -window.innerWidth / 2,
        window.innerWidth / 2,
        -20,
        20,
      );
      targetTiltX = map(
        mouseY,
        -window.innerHeight / 2,
        window.innerHeight / 2,
        20,
        -20,
      );

      targetRepulseX = -mouseX * 0.08;
      targetRepulseY = -mouseY * 0.08;

      const dist = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      const maxDist = Math.max(window.innerWidth, window.innerHeight) / 2;
      let normalizedDist = Math.min(dist / maxDist, 1);
      let targetRadius = map(normalizedDist, 0, 1, maxRadius, minRadius);
      currentRadius = lerp(currentRadius, targetRadius, radiusLerp);
    } else {
      targetTiltX = 0;
      targetTiltY = 0;
      targetRepulseX = 0;
      targetRepulseY = 0;
      currentRadius = lerp(currentRadius, maxRadius, radiusLerp);
    }

    currentTiltX = lerp(currentTiltX, targetTiltX, lerpFactor);
    currentTiltY = lerp(currentTiltY, targetTiltY, lerpFactor);
    currentRepulseX = lerp(currentRepulseX, targetRepulseX, lerpFactor);
    currentRepulseY = lerp(currentRepulseY, targetRepulseY, lerpFactor);

    // Apply overall track transformation
    carouselTrack.style.transform = `translate3d(${currentRepulseX}px, ${currentRepulseY}px, 0) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg)`;

    carouselItems.forEach((item, index) => {
      // 2. Add currentRotation to the base angle for each item
      const angle = index * angleStep + currentRotation;

      let x = Math.cos(angle) * currentRadius;
      let y = Math.sin(angle) * currentRadius * 0.4;
      let z = Math.sin(angle) * currentRadius;

      const scale = map(z, -currentRadius, currentRadius, 0.6, 1.3);

      // Z-Index mapping (0-1000) for clean layering
      item.style.zIndex = Math.round(
        map(z, -currentRadius, currentRadius, 0, 1000),
      );

      // Apply individual item transform
      item.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale}) rotateY(${-currentTiltY}deg) rotateX(${-currentTiltX}deg)`;
    });

    requestAnimationFrame(animateCarousel);
  }

  animateCarousel();
}
/* =========================================
   7. TYPE TESTER LOGIC (SMOOTH INTERPOLATION)
   ========================================= */

const testers = document.querySelectorAll(".type-tester-wrapper");

testers.forEach((wrapper) => {
  const input = wrapper.querySelector(".tester-input");
  const sliders = wrapper.querySelectorAll(".axis-slider");
  const btnAnimate = wrapper.querySelector(".btn-animate");
  const btnAlt = wrapper.querySelector(".btn-alt");

  let isAnimating = false;
  let isAltActive = false;
  let animationFrameId;
  let animationTime = 0;

  // 1. Update Function: Applies the slider values to the font
  function updateFontSettings() {
    let axisSettings = [];

    sliders.forEach((slider) => {
      const tag = slider.getAttribute("data-tag"); // e.g., 'wght'
      const value = slider.value;

      // We push the setting: "wght" 500
      axisSettings.push(`"${tag}" ${value}`);
    });

    const variationString = axisSettings.join(", ");

    // Check for alternate character toggle (ss01)
    const featureString = isAltActive ? '"ss01" 1' : '"ss01" 0';

    if (input) {
      // We apply settings to VariationSettings ONLY (not font-weight)
      input.style.fontVariationSettings = variationString;
      input.style.fontFeatureSettings = featureString;
    }
  }

  // 2. Animation Loop: Smooth Sine Wave
  function animateLoop() {
    if (!isAnimating) return;

    animationTime += 0.05; // Adjust speed here

    sliders.forEach((slider) => {
      const min = parseFloat(slider.min);
      const max = parseFloat(slider.max);

      // Create a smooth wave between 0 and 1
      const factor = (Math.sin(animationTime) + 1) / 2;

      // Calculate precise decimal value
      const newValue = min + (max - min) * factor;

      // Update the slider UI
      slider.value = newValue;
    });

    // Apply the new values to the text
    updateFontSettings();

    // Request next frame
    animationFrameId = requestAnimationFrame(animateLoop);
  }

  // 3. Setup Sliders
  sliders.forEach((slider) => {
    // IMPORTANT: Allow decimals for smooth sliding
    slider.step = "0.01";

    slider.addEventListener("input", () => {
      // If user manually drags, stop the auto-animation
      if (isAnimating) {
        isAnimating = false;
        if (btnAnimate) btnAnimate.classList.remove("active");
        cancelAnimationFrame(animationFrameId);
      }
      updateFontSettings();
    });
  });

  // 4. Setup Buttons
  if (btnAlt) {
    btnAlt.addEventListener("click", () => {
      isAltActive = !isAltActive;
      btnAlt.classList.toggle("active", isAltActive);
      updateFontSettings();
    });
  }

  if (btnAnimate) {
    btnAnimate.addEventListener("click", () => {
      isAnimating = !isAnimating;
      btnAnimate.classList.toggle("active", isAnimating);

      if (isAnimating) {
        animateLoop();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    });
  }

  // Initial load
  updateFontSettings();
});

/* =========================================
   8. AURA TEXT SHAKE EFFECT
   ========================================= */

// 1. CONFIGURATION
// Radius: 300 (Bigger gradient)
const SHAKE_RADIUS = 300;
// Max Shake: 1.5 (Gentler movement)
const MAX_SHAKE_X = 1.5;
const MAX_SHAKE_Y = 1.5;

const targetSelectors = [
  ".scroll-content p",
  ".scroll-content h1",
  ".about-section p",
  ".about-section h2",
  // ".fullscreen-section .floating-caption",
  ".about-header-styled",
  ".editorial-text", // <--- ADICIONA ESTA LINHA AQUI
];

let shakeChars = [];
let mouseX = -1000;
let mouseY = -1000;

// 2. PREPARE TEXT (Wrap characters)
function wrapCharacters(element) {
  if (element.childNodes.length > 0) {
    Array.from(element.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent;
        if (!text.trim() && text.indexOf("\n") > -1) return;

        const fragment = document.createDocumentFragment();

        // Split text into words and whitespace
        const tokens = text.split(/(\s+)/);

        tokens.forEach((token) => {
          if (token.trim() === "") {
            // Handle spaces
            const span = document.createElement("span");
            span.innerHTML = token.replace(/ /g, "&nbsp;");
            span.className = "char-space";
            fragment.appendChild(span);
          } else {
            // Wrap the entire word in a container to prevent splitting
            const wordSpan = document.createElement("span");
            wordSpan.className = "char-word";

            token.split("").forEach((char) => {
              const span = document.createElement("span");
              span.textContent = char;
              span.className = "char-wrapper";
              span.dataset.seed = Math.random();
              shakeChars.push(span);
              wordSpan.appendChild(span);
            });
            fragment.appendChild(wordSpan);
          }
        });

        element.replaceChild(fragment, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName !== "INPUT" && child.tagName !== "SCRIPT") {
          wrapCharacters(child);
        }
      }
    });
  }
}

// 3. INITIALIZATION FUNCTION (GLOBAL)
// We make this global so translateContent can call it
window.initShake = function () {
  // CLEAR the old array so we don't animate deleted nodes
  shakeChars = [];

  const targets = document.querySelectorAll(targetSelectors.join(","));
  targets.forEach((el) => wrapCharacters(el));
};

// 4. TRACK MOUSE
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// 5. ANIMATION LOOP
function animateShake() {
  shakeChars.forEach((char) => {
    // Safety check: if char is no longer in DOM, skip
    if (!char.isConnected) return;

    const rect = char.getBoundingClientRect();

    // Optimization: Off-screen check
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const charCenterX = rect.left + rect.width / 2;
    const charCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(mouseX - charCenterX, mouseY - charCenterY);

    if (dist < SHAKE_RADIUS) {
      // Intensity calculation
      const intensity = 1 - dist / SHAKE_RADIUS;
      const powerIntensity = Math.pow(intensity, 2);

      // Random Erratic Movement
      const randomX = (Math.random() - 0.5) * 2;
      const randomY = (Math.random() - 0.5) * 2;

      const offsetX = randomX * MAX_SHAKE_X * powerIntensity;
      const offsetY = randomY * MAX_SHAKE_Y * powerIntensity;

      char.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    } else {
      if (char.style.transform !== "") {
        char.style.transform = "";
      }
    }
  });

  requestAnimationFrame(animateShake);
}

// Start everything
initShake();
animateShake();

/* =========================================
   9. PROFESSIONAL SMOOTH SCROLL & ZOOM (SPLIT-SCREEN READY)
   ========================================= */

// 1. Configurar o alvo do scroll (Janela ou a coluna de texto)
const scrollContainer = document.querySelector(".scroll-section");
const isMobile = window.innerWidth <= 900;

// Só aplicamos o Lenis à coluna interna se for Desktop e a coluna existir
const lenisOptions =
  scrollContainer && !isMobile
    ? {
        wrapper: scrollContainer, // O contentor que tem o scroll
        content: document.querySelector(".scroll-content"), // O conteúdo longo lá dentro
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }
    : {
        // Configuração padrão para a página inicial ou Mobile
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      };

const lenis = new Lenis(lenisOptions);

// 2. Loop de animação
function raf(time) {
  lenis.raf(time);
  applyScrollZoom();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 3. Função de Zoom (mantém-se igual, funciona em todo o lado)
function applyScrollZoom() {
  const visualContent = document.querySelectorAll(`
    .fullscreen-section img, .fullscreen-section video,
    .media-block img, .media-block video,
    .poster-media img
  `);

  visualContent.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const scrolled = Math.max(
        0,
        Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)),
      );
      const scale = 1.2 - scrolled * 0.2;
      el.style.transform = `scale(${scale.toFixed(4)})`;
    }
  });
}
