gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  initLupaFollower();
  initTypingEffect();
  initIntroAnimation();
  initWindowsClock();     // Reloj de la taskbar
  initWindowsDesktop();   // Menú, Apertura/Cierre y Draggable
  initYahooWelcomeData(); // Lógica secuencial del gráfico/árbol Yahoo!
  initDirWebsChart();
});

// Listener global para redimensionar la ventana del navegador
window.addEventListener('resize', () => {
  const yahooWin = document.getElementById('win-yahoo') || document.getElementById('win-welcome');
  if (yahooWin && !yahooWin.classList.contains('hidden')) {
    drawYahooTreeLines();
  }
});

// 1. Efecto de la lupa (solo activa dentro del Hero)
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

// 2. Efecto de escritura en la barra de búsqueda
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

// 3. Animación de entrada para la sección Intro
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

// =========================================
// SECCIÓN 3: LOGICA ESCRITORIO WINDOWS
// =========================================

// 1. Reloj de la barra de tareas
function initWindowsClock() {
  const clockEl = document.getElementById('win-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    clockEl.textContent = `${hours}:${minutes} ${ampm}`;
  }
  updateClock();
  setInterval(updateClock, 10000);
}

// 2. Menú, Ventanas y Comportamiento Draggable (interact.js)
function initWindowsDesktop() {
  const startBtn = document.getElementById("start-btn");
  const startMenu = document.getElementById("start-menu");

  // --- A. Abrir/Cerrar Menú Start y Submenús ---
  if (startBtn && startMenu) {
    startBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      startMenu.classList.toggle("hidden");
      startBtn.classList.toggle("active");
    });

    document.querySelectorAll('.win-item:not(.has-submenu)').forEach(item => {
      item.addEventListener('click', () => {
        startMenu.classList.add("hidden");
        startBtn.classList.remove("active");
      });
    });

    document.querySelectorAll('.has-submenu').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const targetId = item.getAttribute("data-submenu");
        const sub = document.getElementById(targetId);
        if (sub) sub.classList.remove("hidden");
      });
      item.addEventListener('mouseleave', () => {
        const targetId = item.getAttribute("data-submenu");
        const sub = document.getElementById(targetId);
        if (sub) sub.classList.add("hidden");
      });
    });
  }

  // --- B. APERTURA DE VENTANAS CON POSICIÓN ALEATORIA ---
  document.querySelectorAll('.show-window').forEach(btn => {
    btn.addEventListener('click', () => {
      const winId = btn.getAttribute('data-window');
      const winEl = document.getElementById(winId);

      if (winEl) {
        winEl.classList.remove('hidden');

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
            const resizeObserver = new ResizeObserver(() => {
              drawYahooTreeLines();
            });
            resizeObserver.observe(winEl);
            winEl.dataset.hasResizeListener = 'true';
          }
        }
      }
    });
  });

  // Botones "X" o "Close" que cierran ventanas
  document.querySelectorAll('.win-close-btn, .win-close-btn-footer').forEach(btn => {
    btn.addEventListener('click', () => {
      const winEl = btn.closest('.win-window');
      if (winEl) winEl.classList.add('hidden');
    });
  });

  // --- C. Comportamiento Draggable (interact.js) ---
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

// 3. Lógica Secuencial de Yahoo! Welcome Screen / Árbol
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
      // Oculta el texto y muestra contenedor + Raíz (Yahoo!)
      if (introText) introText.classList.add('hidden');
      if (treeContainer) treeContainer.classList.remove('hidden');
      if (level1) level1.classList.remove('hidden');
    } else if (step === 2) {
      // Muestra Nivel 2 (Categorías) y dibuja líneas
      if (level2) level2.classList.remove('hidden');
      drawYahooTreeLines();
    } else if (step === 3) {
      // Muestra Nivel 3 (Subcategorías) y dibuja líneas
      if (level3) level3.classList.remove('hidden');
      drawYahooTreeLines();
    } else if (step === 4) {
      // Muestra el link final y deshabilita el botón
      if (nasaLink) nasaLink.classList.remove('hidden');
      nextBtn.disabled = true;
      nextBtn.classList.add('win-btn-disabled');
    }
  });

  // Reiniciar estado al cerrar la ventana
  winComo.querySelectorAll('.win-close-btn, .win-close-btn-footer').forEach(btn => {
    btn.addEventListener('click', () => {
      step = 0;
      if (introText) introText.classList.remove('hidden');
      if (treeContainer) treeContainer.classList.add('hidden');
      if (level1) level1.classList.add('hidden');
      if (level2) level2.classList.add('hidden');
      if (level3) level3.classList.add('hidden');
      if (nasaLink) nasaLink.classList.add('hidden');
      nextBtn.disabled = false;
      nextBtn.classList.remove('win-btn-disabled');
    });
  });
}

let dirChartInstance = null;

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
        backgroundColor: [
          '#008080',
          '#1084d0',
          '#000080'
        ],
        borderColor: '#000000',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` Sitios: ${ctx.raw}`
          }
        }
      },
      scales: {
        y: {
          type: 'logarithmic',
          min: 1,
          ticks: {
            font: { family: 'monospace', size: 12 },
            color: '#000'
          },
          grid: { color: '#c0c0c0' }
        },
        x: {
          ticks: {
            font: { family: 'monospace', size: 14, weight: 'bold' },
            color: '#000'
          },
          grid: { display: false }
        }
      }
    }
  });
}

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

let archieChartInstance = null;

function renderArchieChart() {
  const ctx = document.getElementById('chart-archie-vs-google').getContext('2d');

  if (archieChartInstance) {
    archieChartInstance.destroy();
  }

  // PASO 1: Renderizar Archie en solitario (Escala Lineal Inicial)
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
      animation: {
        duration: 1200, // Entrada suave de Archie
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => ` ${context.raw.toLocaleString()} consultas`
          }
        }
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
        x: {
          ticks: { font: { family: 'monospace', weight: 'bold' } }
        }
      }
    }
  });

  // PASO 2: Pausa de 3.5 segundos para que la persona lea la barra de Archie cómodamente
  setTimeout(() => {
    if (!archieChartInstance) return;

    // Cambiamos a escala logarítmica para que la barra de 50.000 sea perfectamente visible al lado de 16.400M
    archieChartInstance.options.scales.y.type = 'logarithmic';
    archieChartInstance.options.scales.y.min = 1000; // Define una base fija para que no parta de cero absoluto
    
    // Extendemos la duración de la animación de transición
    archieChartInstance.options.animation = {
      duration: 1200,
      easing: 'easeInOutCubic'
    };

    // Agregamos Google a los datos
    archieChartInstance.data.labels = ['Archie (1993)', 'Google (2025)'];
    archieChartInstance.data.datasets[0].data = [50000, 16400000000];
    archieChartInstance.data.datasets[0].backgroundColor = ['#000080', '#34a853'];

    // Actualizamos el gráfico con la nueva escala e información
    archieChartInstance.update();
  },1800);
}

// Evento de apertura desde el menú
document.querySelectorAll('[data-window="win-archie-data"]').forEach(item => {
  item.addEventListener('click', () => {
    setTimeout(renderArchieChart, 50);
  });
});