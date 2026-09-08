gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  initLupaFollower();
  initTypingEffect();
  initIntroAnimation();
});

// 1. Efecto de la lupa siguiendo al mouse con suavizado (retraso)
// 1. Efecto de la lupa (solo activa dentro del Hero)
function initLupaFollower() {
  const hero = document.getElementById("hero");
  const lupa = document.getElementById("magnifying-glass");

  // Al mover el mouse dentro del hero
  hero.addEventListener("mousemove", (e) => {
    gsap.to(lupa, {
      x: e.clientX,
      y: e.clientY,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    });
  });

  // Ocultar la lupa cuando el mouse sale del hero
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
  let i = 0;

  function escribir() {
    if (i < texto.length) {
      contenedor.textContent += texto.charAt(i);
      i++;
      setTimeout(escribir, 110);
    }
  }

  // Pequeña pausa inicial antes de empezar a escribir
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