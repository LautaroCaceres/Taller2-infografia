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

  // --- 2. REVEAL AL HACER SCROLL ---
  const scrollElements = document.querySelectorAll(".scroll-reveal");

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

  const browserContent = document.querySelector(".browser-content");

  // Guardamos el contenido original del navegador para restaurarlo con el botón "Volver"
  const originalBrowserContent = browserContent ? browserContent.innerHTML : "";

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

  // --- 6. FUNCIONES AUXILIARES INTERNAS DE PREVIEW Y ANIMACIONES ---
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

  // Inyectar vista previa dinámica (AltaVista / Lycos)
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
    initSearchDropdown(); // Re-vinculamos eventos del buscador
  }
});

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