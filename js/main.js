gsap.registerPlugin(ScrollTrigger);

// Instancias globales para gráficos de Chart.js
let dirChartInstance = null;
let archieChartInstance = null;

// =========================================================================
// LISTENER PRINCIPAL (DOMContentLoaded)
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {

  // --- 1. INICIALIZACIONES GENERALES ---
  initLupaFollower();
  initTypingEffect();
  initIntroAnimation();
  initWindowsClock();     // Reloj de la taskbar
  initWindowsDesktop();   // Menú Start, Apertura/Cierre y Draggable
  initYahooWelcomeData(); // Lógica secuencial del gráfico/árbol Yahoo!
  initDirWebsChart();     // Gráfico inicial de directorios
  initSearchDropdown();   // Desplegable del buscador retro
  initGoogleBrowserEvents(); // Eventos de pestañas y búsqueda de Google
  initRetroLinks();
  initMLGame();

  // --- 2. REVEAL AL HACER SCROLL ---
  const scrollElements = document.querySelectorAll(".scroll-reveal, .modern-card, .reveal-ml");

  const elementInView = (el, dividend = 1.25) => {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend;
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el)) {
        el.classList.add("is-visible");
      }
    });
  };

  window.addEventListener("scroll", handleScrollAnimation);
  handleScrollAnimation(); // Disparo inicial al cargar

  // --- 3. MANEJO DE MODALES Y LINKS RETRO (.retro-link) ---
  const overlay = document.getElementById("modal-overlay");
  const modalQueEs = document.getElementById("modal-que-es");
  const modalProblemas = document.getElementById("modal-problemas");
  const modalLimitaciones = document.getElementById("modal-limitaciones");
  const modalError = document.getElementById("modal-error");
  
  // Modales AltaVista
  const modalAltavistaQueEs = document.getElementById("modal-altavista-que-es");
  const modalAltavistaDatos = document.getElementById("modal-altavista-datos");

  // Modales Lycos
  const modalLycosQueEs = document.getElementById("modal-lycos-que-es");
  const modalLycosDatos = document.getElementById("modal-lycos-datos");

  document.querySelectorAll(".retro-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetInfo = link.getAttribute("data-info");

      // Ocultar todos los modales abiertos
      document.querySelectorAll(".modal-window, .alert-window").forEach(m => m.classList.add("hidden"));

      // --- Modales de Palabras Clave ---
      if (targetInfo === "que-es-busqueda") {
        overlay?.classList.remove("hidden");
        modalQueEs?.classList.remove("hidden");
      } else if (targetInfo === "problema-busqueda") {
        overlay?.classList.remove("hidden");
        modalProblemas?.classList.remove("hidden");
      } else if (targetInfo === "como-busqueda") {
        overlay?.classList.remove("hidden");
        modalLimitaciones?.classList.remove("hidden");
        resetTreeSequence();
      }

      // --- Modales y acciones de AltaVista ---
      else if (targetInfo === "que-es-altavista") {
        overlay?.classList.remove("hidden");
        modalAltavistaQueEs?.classList.remove("hidden");
      } else if (targetInfo === "datos-altavista") {
        overlay?.classList.remove("hidden");
        modalAltavistaDatos?.classList.remove("hidden");
        triggerAltavistaAnimations();
      } else if (targetInfo === "veia-altavista") {
        injectPreview("assets/imagenes/altavista-preview.png", "AltaVista");
      }

      // --- Modales y acciones de Lycos ---
      else if (targetInfo === "que-es-lycos") {
        overlay?.classList.remove("hidden");
        modalLycosQueEs?.classList.remove("hidden");
      } else if (targetInfo === "datos-lycos") {
        overlay?.classList.remove("hidden");
        modalLycosDatos?.classList.remove("hidden");
      } else if (targetInfo === "veia-lycos") {
        injectPreview("assets/imagenes/lycos-preview.png", "Lycos");
      }
    });
  });

  // Cerrar ventanas modal con botón 'X'
  document.querySelectorAll(".close-modal-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      overlay?.classList.add("hidden");
      btn.closest(".retro-window")?.classList.add("hidden");
    });
  });

  // --- 4. SISTEMA DE PESTAÑAS (Tabs) ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabNum = btn.getAttribute("data-tab");

      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(`tab-${tabNum}`)?.classList.add("active");
    });
  });

  // --- 5. LÓGICA DE MAPA SECUENCIAL Y ERROR FINAL ---
  let currentStep = 1;
  const maxSteps = 3;
  const prevBtn = document.getElementById("prev-step-btn");
  const nextBtn = document.getElementById("next-step-btn");

  function updateTreeDisplay() {
    for (let i = 1; i <= maxSteps; i++) {
      const node = document.getElementById(`step-node-${i}`);
      if (node) {
        if (i <= currentStep) {
          node.classList.remove("hidden-node");
        } else {
          node.classList.add("hidden-node");
        }
      }
    }
    if (prevBtn) prevBtn.disabled = (currentStep === 1);
  }

  function resetTreeSequence() {
    currentStep = 1;
    updateTreeDisplay();
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentStep < maxSteps) {
        currentStep++;
        updateTreeDisplay();
      } else {
        modalLimitaciones?.classList.add("hidden");
        modalError?.classList.remove("hidden");
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        updateTreeDisplay();
      }
    });
  }

  // Cerrar Pop-up de Error
  document.querySelectorAll(".close-error-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      modalError?.classList.add("hidden");
      overlay?.classList.add("hidden");
    });
  });
  // --- PRIMER REPRODUCTOR DE VIDEO ---
const video1 = document.getElementById("wmp-video");
const playTrigger1 = document.getElementById("wmp-play-trigger");

if (video1 && playTrigger1) {
  playTrigger1.addEventListener("click", () => {
    if (video1.paused) {
      video1.play();
      playTrigger1.textContent = "❚❚";
    } else {
      video1.pause();
      playTrigger1.textContent = "▶";
    }
  });

  video1.addEventListener("play", () => {
    playTrigger1.textContent = "❚❚";
  });

  video1.addEventListener("pause", () => {
    playTrigger1.textContent = "▶";
  });
}

  // --- 6. SEGUNDO REPRODUCTOR DE VIDEO ---
  const video2 = document.getElementById("wmp-video-2");
  const playTrigger2 = document.getElementById("wmp-play-trigger-2");

  if (video2 && playTrigger2) {
    playTrigger2.addEventListener("click", () => {
      if (video2.paused) {
        video2.play();
        playTrigger2.textContent = "❚❚";
      } else {
        video2.pause();
        playTrigger2.textContent = "▶";
      }
    });

    video2.addEventListener("play", () => {
      playTrigger2.textContent = "❚❚";
    });

    video2.addEventListener("pause", () => {
      playTrigger2.textContent = "▶";
    });
  }
});

// Guardamos la referencia global al contenedor del navegador
const browserContent = document.querySelector(".browser-content");
const originalBrowserContent = browserContent ? browserContent.innerHTML : "";

// --- FUNCIONES DE PREVIEW Y RESTAURACIÓN DEL NAVEGADOR ---
function triggerAltavistaAnimations() {
  const bigBar = document.getElementById("altavista-bar-big");
  const card1 = document.getElementById("data-card-1");
  const card2 = document.getElementById("data-card-2");
  const card3 = document.getElementById("data-card-3");

  if (bigBar) bigBar.classList.add("hidden-bar");
  [card1, card2, card3].forEach(c => c?.classList.add("hidden-card"));

  setTimeout(() => bigBar?.classList.remove("hidden-bar"), 400);
  setTimeout(() => card1?.classList.remove("hidden-card"), 1000);
  setTimeout(() => card2?.classList.remove("hidden-card"), 1800);
  setTimeout(() => card3?.classList.remove("hidden-card"), 2600);
}

function injectPreview(imagePath, name) {
  if (!browserContent) return;
  browserContent.innerHTML = `
    <div class="browser-injected-view">
      <div class="browser-back-bar">
        <button id="browser-back-btn" class="retro-btn">◄ Volver al buscador</button>
      </div>
      <img src="${imagePath}" alt="${name} Preview" class="altavista-preview-img" />
    </div>
  `;

  document.getElementById("browser-back-btn")?.addEventListener("click", restoreBrowserContent);
}

function restoreBrowserContent() {
  if (!browserContent) return;
  browserContent.innerHTML = originalBrowserContent;
  initSearchDropdown(); 
  initGoogleBrowserEvents(); 
  initRetroLinks(); // <-- AGREGÁ ESTA LÍNEA ACÁ PARA RE-VINCULAR LOS CLICS
}

// --- LÓGICA REUSABLE DEL BROWSER DE GOOGLE ---
function initGoogleBrowserEvents() {
  const backBtn = document.getElementById("gb-back-btn");
  const viewResults = document.getElementById("gb-view-results");
  const viewDetail = document.getElementById("gb-view-detail");

  const linkTriggers = document.querySelectorAll(".gb-link-trigger");
  const sidebarBtns = document.querySelectorAll(".sidebar-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const folderLabel = document.getElementById("tab-folder-title");

  const tabTitles = {
    "que-es": "Qué es",
    "como-funciona": "Cómo funciona",
    "historia": "Historia",
    "ecuacion": "Ecuación"
  };

  function switchTab(targetTab) {
    sidebarBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === targetTab);
    });

    tabPanes.forEach(pane => {
      pane.classList.toggle("hidden", pane.id !== `tab-content-${targetTab}`);
    });

    if (folderLabel && tabTitles[targetTab]) {
      folderLabel.textContent = tabTitles[targetTab];
    }

    if (targetTab === "ecuacion" && window.MathJax) {
      MathJax.typesetPromise();
    }
  }

  linkTriggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const target = trigger.dataset.target;

      viewResults?.classList.add("hidden");
      viewDetail?.classList.remove("hidden");
      backBtn?.classList.remove("hidden");

      switchTab(target);
    });
  });

  sidebarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab);
    });
  });

  backBtn?.addEventListener("click", () => {
    viewDetail?.classList.add("hidden");
    viewResults?.classList.remove("hidden");
    backBtn?.classList.add("hidden");
  });
}

// Listener global para redimensionar la ventana del navegador
window.addEventListener('resize', () => {
  const yahooWin = document.getElementById('win-yahoo') || document.getElementById('win-welcome');
  if (yahooWin && !yahooWin.classList.contains('hidden')) {
    drawYahooTreeLines();
  }
});

// Evento para renderizar el gráfico de Archie al hacer click
document.querySelectorAll('[data-window="win-archie-data"]').forEach(item => {
  item.addEventListener('click', () => {
    setTimeout(renderArchieChart, 50);
  });
});

// =========================================================================
// MÓDULOS DE FUNCIONES INDEPENDIENTES
// =========================================================================

// 1. Efecto Lupa (Hero)
function initLupaFollower() {
  const hero = document.getElementById("hero");
  const lupa = document.getElementById("magnifying-glass");

  if (!hero || !lupa) return;

  hero.addEventListener("mousemove", (e) => {
    gsap.to(lupa, {
      x: e.clientX,
      y: e.clientY,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    });
  });

  hero.addEventListener("mouseleave", () => {
    gsap.to(lupa, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  });
}

// 2. Efecto Tipeo
function initTypingEffect() {
  const texto = "¿Cómo lee mentes Google?";
  const contenedor = document.getElementById("typing-text");
  if (!contenedor) return;

  let i = 0;
  function escribir() {
    if (i < texto.length) {
      contenedor.textContent += texto.charAt(i);
      i++;
      setTimeout(escribir, 110);
    }
  }

  setTimeout(escribir, 600);
}

// 3. Animación Intro
function initIntroAnimation() {
  gsap.from(".intro-title, .intro-text", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#intro",
      start: "top 75%",
      toggleActions: "play none none reverse"
    }
  });
}

// 4. Reloj Taskbar
function initWindowsClock() {
  const clockEl = document.getElementById('win-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    clockEl.textContent = `${hours}:${minutes} ${ampm}`;
  }
  updateClock();
  setInterval(updateClock, 10000);
}

// 5. Escritorio Windows (Start, Ventanas, Drag)
function initWindowsDesktop() {
  const startBtn = document.getElementById("start-btn");
  const startMenu = document.getElementById("start-menu");

  if (startMenu) startMenu.classList.remove("hidden");

  if (startBtn && startMenu) {
    startBtn.classList.add("active");

    startBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      startMenu.classList.toggle("hidden");
      startBtn.classList.toggle("active");
    });

    document.querySelectorAll('.has-submenu').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const targetId = item.getAttribute("data-submenu");
        document.getElementById(targetId)?.classList.remove("hidden");
      });
      item.addEventListener('mouseleave', () => {
        const targetId = item.getAttribute("data-submenu");
        document.getElementById(targetId)?.classList.add("hidden");
      });
    });
  }

  // Apertura de ventanas
  document.querySelectorAll('.show-window').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const winId = btn.getAttribute('data-window');
      const winEl = document.getElementById(winId);

      if (winEl) {
        winEl.classList.remove('hidden');

        document.querySelectorAll('.win-window').forEach(w => w.style.zIndex = '10');
        winEl.style.zIndex = '100';

        const desktopEl = document.getElementById('desktop-section');
        const desktopWidth = desktopEl ? desktopEl.clientWidth : window.innerWidth;
        const desktopHeight = (desktopEl ? desktopEl.clientHeight : window.innerHeight) - 48;

        const winWidth = winEl.offsetWidth || 500;
        const winHeight = winEl.offsetHeight || 350;

        const minX = 40;
        const maxX = Math.max(minX, desktopWidth - winWidth - 40);
        const minY = 40;
        const maxY = Math.max(minY, desktopHeight - winHeight - 40);

        const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

        winEl.style.left = `${randomX}px`;
        winEl.style.top = `${randomY}px`;
        winEl.style.transform = 'translate(0px, 0px)';
        winEl.setAttribute('data-x', 0);
        winEl.setAttribute('data-y', 0);

        if (winId === 'win-dir-data') {
          initDirWebsChart();
        }

        if (winId === 'win-yahoo' || winId === 'win-welcome') {
          setTimeout(drawYahooTreeLines, 50);

          if (!winEl.dataset.hasResizeListener) {
            const resizeObserver = new ResizeObserver(() => drawYahooTreeLines());
            resizeObserver.observe(winEl);
            winEl.dataset.hasResizeListener = 'true';
          }
        }
      }
    });
  });

  // Botones de cierre
  document.querySelectorAll('.win-close-btn, .win-close-btn-footer').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.win-window')?.classList.add('hidden');
    });
  });

  // Draggable con Interact.js
  if (typeof interact !== 'undefined') {
    interact('.draggable').draggable({
      allowFrom: '.win-window-header',
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: '#desktop-section',
          endOnly: true
        })
      ],
      listeners: {
        start(event) {
          event.target.classList.add('dragging');
        },
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
        end(event) {
          event.target.classList.remove('dragging');
        }
      }
    });
  }
}

// 6. Secuencia Yahoo! Screen
function initYahooWelcomeData() {
  const winComo = document.getElementById('win-yahoo-como');
  if (!winComo) return;

  const nextBtn = winComo.querySelector('#yahoo-next-btn');
  const introText = winComo.querySelector('#yahoo-intro-text');
  const treeContainer = winComo.querySelector('#yahoo-tree-container');
  const level1 = winComo.querySelector('#tree-level-1');
  const level2 = winComo.querySelector('#tree-level-2');
  const level3 = winComo.querySelector('#tree-level-3');
  const nasaLink = winComo.querySelector('#yahoo-nasa-link');

  if (!nextBtn) return;

  let step = 0;

  nextBtn.addEventListener('click', () => {
    step++;
    if (step === 1) {
      introText?.classList.add('hidden');
      treeContainer?.classList.remove('hidden');
      level1?.classList.remove('hidden');
    } else if (step === 2) {
      level2?.classList.remove('hidden');
      drawYahooTreeLines();
    } else if (step === 3) {
      level3?.classList.remove('hidden');
      drawYahooTreeLines();
    } else if (step === 4) {
      nasaLink?.classList.remove('hidden');
      nextBtn.disabled = true;
      nextBtn.classList.add('win-btn-disabled');
    }
  });

  winComo.querySelectorAll('.win-close-btn, .win-close-btn-footer').forEach(btn => {
    btn.addEventListener('click', () => {
      step = 0;
      introText?.classList.remove('hidden');
      treeContainer?.classList.add('hidden');
      level1?.classList.add('hidden');
      level2?.classList.add('hidden');
      level3?.classList.add('hidden');
      nasaLink?.classList.add('hidden');
      nextBtn.disabled = false;
      nextBtn.classList.remove('win-btn-disabled');
    });
  });
}

// 7. Buscador Desplegable Retro
function initSearchDropdown() {
  const searchInput = document.getElementById('search-input');
  const searchDropdown = document.getElementById('search-dropdown');

  if (!searchInput || !searchDropdown) return;

  searchInput.addEventListener('focus', () => {
    searchDropdown.classList.remove('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.classList.add('hidden');
    }
  });

  searchDropdown.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      searchInput.value = item.textContent;
      searchDropdown.classList.add('hidden');
    });
  });
}

// 8. Gráfico de Directorios Web
function initDirWebsChart() {
  const ctx = document.getElementById('chart-dir-webs');
  if (!ctx) return;

  if (dirChartInstance) {
    dirChartInstance.destroy();
  }

  dirChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1991', '1992', '1994'],
      datasets: [{
        label: 'Sitios Web en línea',
        data: [1, 10, 3000],
        backgroundColor: ['#008080', '#1084d0', '#000080'],
        borderColor: '#000000',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => ` Sitios: ${ctx.raw}` } }
      },
      scales: {
        y: {
          type: 'logarithmic',
          min: 1,
          ticks: { font: { family: 'monospace', size: 12 }, color: '#000' },
          grid: { color: '#c0c0c0' }
        },
        x: {
          ticks: { font: { family: 'monospace', size: 14, weight: 'bold' }, color: '#000' },
          grid: { display: false }
        }
      }
    }
  });
}

// 9. Conexiones SVG del Árbol de Yahoo!
function drawYahooTreeLines() {
  const svg = document.getElementById('yahoo-tree-svg');
  const container = document.getElementById('yahoo-tree-container');
  if (!svg || !container) return;

  svg.innerHTML = '';
  const containerRect = container.getBoundingClientRect();

  const connections = [
    ['node-root', 'node-ciencia'],
    ['node-root', 'node-negocios'],
    ['node-root', 'node-recreacion'],
    ['node-ciencia', 'node-bio'],
    ['node-ciencia', 'node-astro'],
    ['node-negocios', 'node-emp'],
    ['node-negocios', 'node-fin'],
    ['node-recreacion', 'node-dep'],
    ['node-recreacion', 'node-viajes']
  ];

  connections.forEach(([parentId, childId]) => {
    const parentEl = document.getElementById(parentId);
    const childEl = document.getElementById(childId);

    if (parentEl && childEl) {
      const pRect = parentEl.getBoundingClientRect();
      const cRect = childEl.getBoundingClientRect();

      const x1 = (pRect.left + pRect.width / 2) - containerRect.left;
      const y1 = pRect.bottom - containerRect.top;

      const x2 = (cRect.left + cRect.width / 2) - containerRect.left;
      const y2 = cRect.top - containerRect.top;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', '#000000');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-dasharray', '4 2');

      svg.appendChild(line);
    }
  });
}

// 10. Gráfico Archie vs Google
function renderArchieChart() {
  const canvas = document.getElementById('chart-archie-vs-google');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (archieChartInstance) {
    archieChartInstance.destroy();
  }

  archieChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Archie (1993)'],
      datasets: [{
        label: 'Consultas diarias',
        data: [50000],
        backgroundColor: ['#000080'],
        borderColor: ['#000000'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (context) => ` ${context.raw.toLocaleString()} consultas` } }
      },
      scales: {
        y: {
          type: 'linear',
          beginAtZero: true,
          ticks: {
            font: { family: 'monospace' },
            callback: value => value >= 1e6 ? (value / 1e6) + 'M' : value.toLocaleString()
          }
        },
        x: { ticks: { font: { family: 'monospace', weight: 'bold' } } }
      }
    }
  });

  setTimeout(() => {
    if (!archieChartInstance) return;

    archieChartInstance.options.scales.y.type = 'logarithmic';
    archieChartInstance.options.scales.y.min = 1000;
    
    archieChartInstance.options.animation = {
      duration: 1200,
      easing: 'easeInOutCubic'
    };

    archieChartInstance.data.labels = ['Archie (1993)', 'Google (2025)'];
    archieChartInstance.data.datasets[0].data = [50000, 16400000000];
    archieChartInstance.data.datasets[0].backgroundColor = ['#000080', '#34a853'];

    archieChartInstance.update();
  }, 1800);
}

function initRetroLinks() {
  const overlay = document.getElementById("modal-overlay");
  const modalQueEs = document.getElementById("modal-que-es");
  const modalProblemas = document.getElementById("modal-problemas");
  const modalLimitaciones = document.getElementById("modal-limitaciones");

  // Modales AltaVista
  const modalAltavistaQueEs = document.getElementById("modal-altavista-que-es");
  const modalAltavistaDatos = document.getElementById("modal-altavista-datos");

  // Modales Lycos
  const modalLycosQueEs = document.getElementById("modal-lycos-que-es");
  const modalLycosDatos = document.getElementById("modal-lycos-datos");

  document.querySelectorAll(".retro-link").forEach(link => {
    // Para evitar duplicar listeners si se llama varias veces:
    link.replaceWith(link.cloneNode(true));
  });

  document.querySelectorAll(".retro-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetInfo = link.getAttribute("data-info");

      document.querySelectorAll(".modal-window, .alert-window").forEach(m => m.classList.add("hidden"));

      // --- Modales de Palabras Clave ---
      if (targetInfo === "que-es-busqueda") {
        overlay?.classList.remove("hidden");
        modalQueEs?.classList.remove("hidden");
      } else if (targetInfo === "problema-busqueda") {
        overlay?.classList.remove("hidden");
        modalProblemas?.classList.remove("hidden");
      } else if (targetInfo === "como-busqueda") {
        overlay?.classList.remove("hidden");
        modalLimitaciones?.classList.remove("hidden");
        if (typeof resetTreeSequence === "function") resetTreeSequence();
      }

      // --- Modales y acciones de AltaVista ---
      else if (targetInfo === "que-es-altavista") {
        overlay?.classList.remove("hidden");
        modalAltavistaQueEs?.classList.remove("hidden");
      } else if (targetInfo === "datos-altavista") {
        overlay?.classList.remove("hidden");
        modalAltavistaDatos?.classList.remove("hidden");
        triggerAltavistaAnimations();
      } else if (targetInfo === "veia-altavista") {
        injectPreview("assets/imagenes/altavista-preview.png", "AltaVista");
      }

      // --- Modales y acciones de Lycos ---
      else if (targetInfo === "que-es-lycos") {
        overlay?.classList.remove("hidden");
        modalLycosQueEs?.classList.remove("hidden");
      } else if (targetInfo === "datos-lycos") {
        overlay?.classList.remove("hidden");
        modalLycosDatos?.classList.remove("hidden");
      } else if (targetInfo === "veia-lycos") {
        injectPreview("assets/imagenes/lycos-preview.png", "Lycos");
      }
    });
  });
}

// 11. Juego interactivo de clasificación (Machine Learning)
function initMLGame() {
  const tray = document.getElementById('ml-dogs-tray');
  if (!tray || typeof interact === 'undefined') return;

  const totalDogs = document.querySelectorAll('.draggable-dog').length;
  let correctCount = 0;

  function dragMoveListenerML(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  interact('.draggable-dog').draggable({
    inertia: false,
    listeners: {
      start(event) {
        event.target.classList.add('dragging-dog');
      },
      move: dragMoveListenerML,
      end(event) {
        const target = event.target;
        target.classList.remove('dragging-dog');
        if (target.getAttribute('data-placed') !== 'true') {
          target.style.transform = 'translate(0px, 0px)';
          target.setAttribute('data-x', 0);
          target.setAttribute('data-y', 0);
        }
      }
    }
  });

  interact('.ml-dropzone').dropzone({
    accept: '.draggable-dog',
    overlap: 0.5,
    ondropactivate(event) {
      event.target.classList.add('drop-active');
    },
    ondragenter(event) {
      event.target.classList.add('drop-target-hover');
    },
    ondragleave(event) {
      event.target.classList.remove('drop-target-hover');
    },
    ondrop(event) {
      const dropzoneEl = event.target;
      const dogEl = event.relatedTarget;
      const tipoCorrecto = dogEl.getAttribute('data-tipo');
      const tipoZona = dropzoneEl.getAttribute('data-tipo');

      if (dogEl.getAttribute('data-placed') === 'true') return;

      if (tipoCorrecto === tipoZona) {
        dogEl.setAttribute('data-placed', 'true');
        dogEl.classList.add('dog-placed');
        dogEl.style.transform = '';
        dogEl.removeAttribute('data-x');
        dogEl.removeAttribute('data-y');

        const slot = dropzoneEl.querySelector('.ml-dropzone-slots');
        slot?.appendChild(dogEl);

        correctCount++;
        if (correctCount === totalDogs) {
          showMLFinalText();
        }
      } else {
        dogEl.classList.add('dog-shake');
        setTimeout(() => dogEl.classList.remove('dog-shake'), 400);
      }
    },
    ondragdeactivate(event) {
      event.target.classList.remove('drop-active', 'drop-target-hover');
    }
  });
}

function showMLFinalText() {
  const finalText = document.getElementById('ml-final-text');
  if (!finalText) return;
  finalText.classList.remove('hidden');
  requestAnimationFrame(() => {
    finalText.classList.add('is-visible');
  });
}

// =========================================================================
// SECCIÓN CHATBOTS: GRÁFICOS Y FILTROS
// =========================================================================

let chartGoogleChatgpt = null;
let chartEdad = null;
let chartMarketShare = null;
let chartTimeline = null;

document.addEventListener("DOMContentLoaded", () => {
  initFiltrosDashboard();
  initChartGoogleChatgpt();
  initChartEdad();
  initChartMarketShare();
  initChartTimeline();
  initPopupsChatbot();
});

// --- Filtros Actividad / Dispositivos / Edad ---
function initFiltrosDashboard() {
  const btns = document.querySelectorAll('.filtro-btn');
  const vistaCombinada = document.getElementById('vista-actividad-dispositivos');
  const vistaEdad = document.getElementById('vista-edad');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filtro = btn.dataset.filtro;

      if (filtro === 'edad') {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        vistaCombinada.classList.add('hidden');
        vistaEdad.classList.remove('hidden');
        return;
      }

      // Si el usuario clickea Actividad o Dispositivos, apagamos Edad
      document.querySelector('[data-filtro="edad"]').classList.remove('active');
      vistaEdad.classList.add('hidden');
      vistaCombinada.classList.remove('hidden');

      const actividadBtn = document.querySelector('[data-filtro="actividad"]');
      const dispositivosBtn = document.querySelector('[data-filtro="dispositivos"]');
      const estaActivo = btn.classList.contains('active');
      const otroEstaActivo = (btn === actividadBtn ? dispositivosBtn : actividadBtn).classList.contains('active');

      // No permitir apagar el último filtro activo
      if (estaActivo && !otroEstaActivo) {
        return;
      }

      btn.classList.toggle('active');
      updateChartGoogleChatgpt();
    });
  });
}

// --- Gráfico: Google vs ChatGPT (Actividad + Dispositivos) ---
function initChartGoogleChatgpt() {
  const ctx = document.getElementById('chart-google-chatgpt');
  if (!ctx) return;

  chartGoogleChatgpt = new Chart(ctx, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}%`
          }
        }
      },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } }
      }
    }
  });

  updateChartGoogleChatgpt();
}

function updateChartGoogleChatgpt() {
  if (!chartGoogleChatgpt) return;

  const actividadOn = document.querySelector('[data-filtro="actividad"]').classList.contains('active');
  const dispositivosOn = document.querySelector('[data-filtro="dispositivos"]').classList.contains('active');

  const labels = ['Google Search', 'ChatGPT', 'Otros'];
  const datasets = [];

  if (actividadOn) {
    datasets.push({
      label: '% de búsquedas totales',
      data: [57, 17.9, 25.1],
      backgroundColor: '#4285F4'
    });
  }

  if (dispositivosOn) {
    datasets.push({
      label: '% Desktop',
      data: [37, 62, null], // Otros no tiene dato
      backgroundColor: '#10a37f'
    });
    datasets.push({
      label: '% Mobile',
      data: [63, 38, null], // Otros no tiene dato
      backgroundColor: '#a0d9c8'
    });
  }

  chartGoogleChatgpt.data.labels = labels;
  chartGoogleChatgpt.data.datasets = datasets;
  chartGoogleChatgpt.update();
}

// --- Gráfico: Market Share por edad ---
function initChartEdad() {
  const ctx = document.getElementById('chart-edad');
  if (!ctx) return;

  chartEdad = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['13-24', '25-44', '45-64', '65+'],
      datasets: [
        {
          label: 'Google',
          data: [74, 80, 86, 89],
          backgroundColor: '#4285F4'
        },
        {
          label: 'ChatGPT',
          data: [17, 13, 8, 5],
          backgroundColor: '#10a37f'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } }
      }
    }
  });
}

// --- Gráfico: Market Share chatbots enero 2026 ---
function initChartMarketShare() {
  const ctx = document.getElementById('chart-market-share');
  if (!ctx) return;

  chartMarketShare = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['ChatGPT', 'Google Gemini', 'DeepSeek', 'Grok', 'Perplexity', 'Copilot'],
      datasets: [{
        label: 'Market share',
        data: [64.5, 18.2, 4, 3.4, 2, 1.2],
        backgroundColor: ['#8ecae6', '#ffd166', '#c0c0c0', '#c0c0c0', '#c0c0c0', '#c0c0c0']
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, max: 70, ticks: { callback: v => v + '%' } }
      }
    }
  });
}

// --- Gráfico: Línea de tiempo con slider ---
// NOTA: Los valores de este dataset son ESTIMADOS a partir de la tendencia
// visual del gráfico de referencia. Reemplazar por los datos exactos
// de Similarweb/fuente original en cuanto los tengas.
const timelineLabels = [
  'Q1 2023','Q2 2023','Q3 2023','Q4 2023',
  'Q1 2024','Q2 2024','Q3 2024','Q4 2024',
  'Q1 2025','Q2 2025','Q3 2025','Q4 2025',
  'Q1 2026','Q2 2026'
];
const timelineGoogle = [92, 91, 90, 89, 88, 86, 84, 82, 81, 80, 79, 78, 78, 77]; // ESTIMADO
const timelineChatgpt = [1, 2, 3, 5, 7, 9, 11, 13, 15, 16, 17, 18, 19, 20]; // ESTIMADO

function initChartTimeline() {
  const ctx = document.getElementById('chart-timeline');
  const slider = document.getElementById('timeline-slider');
  const sliderValue = document.getElementById('timeline-slider-value');
  if (!ctx || !slider) return;

  slider.max = timelineLabels.length - 1;
  slider.value = timelineLabels.length - 1;

  chartTimeline = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timelineLabels,
      datasets: [
        {
          label: 'Google',
          data: timelineGoogle,
          borderColor: '#4285F4',
          backgroundColor: 'rgba(66,133,244,0.15)',
          fill: true,
          tension: 0.35
        },
        {
          label: 'ChatGPT',
          data: timelineChatgpt,
          borderColor: '#10a37f',
          backgroundColor: 'rgba(16,163,127,0.15)',
          fill: true,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } }
      }
    }
  });

  function updateTimeline() {
    const hasta = parseInt(slider.value, 10);
    sliderValue.textContent = timelineLabels[hasta];

    chartTimeline.data.labels = timelineLabels.slice(0, hasta + 1);
    chartTimeline.data.datasets[0].data = timelineGoogle.slice(0, hasta + 1);
    chartTimeline.data.datasets[1].data = timelineChatgpt.slice(0, hasta + 1);
    chartTimeline.update();
  }

  slider.addEventListener('input', updateTimeline);
  updateTimeline();
}

// --- Pop-ups: Market Share detalle y "Por qué" ---
function initPopupsChatbot() {
  const overlay = document.getElementById('popup-overlay-cb');
  const popupMarketShare = document.getElementById('popup-market-share');
  const popupPorque = document.getElementById('popup-timeline-porque');

  document.getElementById('btn-expand-market-share')?.addEventListener('click', () => {
    overlay?.classList.remove('hidden');
    popupMarketShare?.classList.remove('hidden');
  });

  document.getElementById('btn-timeline-porque')?.addEventListener('click', () => {
    overlay?.classList.remove('hidden');
    popupPorque?.classList.remove('hidden');
  });

  document.querySelectorAll('.close-popup-cb').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay?.classList.add('hidden');
      popupMarketShare?.classList.add('hidden');
      popupPorque?.classList.add('hidden');
    });
  });
}

// --- Cohete que sigue al mouse en la sección de cierre ---
document.addEventListener("DOMContentLoaded", () => {
  initRocketFollower();
});

function initRocketFollower() {
  const section = document.getElementById("cierre-section");
  const rocket = document.getElementById("rocket-follower");

  if (!section || !rocket || typeof gsap === "undefined") return;

  section.addEventListener("mousemove", (e) => {
    const rect = section.getBoundingClientRect();
    gsap.to(rocket, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    });
  });

  section.addEventListener("mouseleave", () => {
    gsap.to(rocket, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  });
}