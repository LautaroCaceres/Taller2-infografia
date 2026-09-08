// ==========================================
// 1. GSAP + ScrollTrigger
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Primero, reseteamos la posición inicial del elemento (para asegurar que empiece a la izquierda)
gsap.set(".caja-animada", { x: 0 });

gsap.to(".caja-animada", {
  x: 300, // Se mueve 300px a la derecha
  rotation: 360, // Gira una vuelta completa
  duration: 1.5,
  ease: "power1.out",
  scrollTrigger: {
    trigger: ".seccion-animada", // Elemento que activa el scroll
    start: "top 70%", // Empieza cuando el 'top' de la sección llega al 70% de la altura del viewport
    end: "bottom 30%", // Termina cuando el 'bottom' de la sección llega al 30% del viewport
    
    //toggleActions controla el comportamiento:
    //play (al entrar), none (al salir), none (al volver a entrar), reverse (al volver a salir por arriba)
    toggleActions: "play none none reverse", 
    
    markers: true // ELIMINAR ESTA LÍNEA CUANDO FUNCIONE (sirve para debuggear)
  }
});

// ==========================================
// 2. Chart.js
// ==========================================
const ctx = document.getElementById('miGrafico').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Enero', 'Febrero', 'Marzo'],
    datasets: [{
      label: 'Prueba Chart.js',
      data: [12, 19, 7],
      backgroundColor: '#238636'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// ==========================================
// 3. Interact.js (Arrastrar elemento)
// ==========================================
let position = { x: 0, y: 0 };

interact('#elemento-arrastrable').draggable({
  listeners: {
    move(event) {
      position.x += event.dx;
      position.y += event.dy;
      event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }
});