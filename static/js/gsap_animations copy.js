document.addEventListener("DOMContentLoaded", () => {
    // GSAP Title & Flicker Effect
    gsap.to(".glow-text", { duration: 2, opacity: 1, y: -20, ease: "power2.out" });

    function flickerEffect() {
        gsap.to(".glow-text", { opacity: Math.random() * 0.6 + 0.4, duration: 0.1, onComplete: flickerEffect });
    }
    setTimeout(flickerEffect, 3);

    gsap.to(".fade-in", { duration: 2, opacity: 1, delay: 1 });

    // Dreamlike Particles
    const symbols = ["✶", "▲", "✦", "✺", "◈", "✵", "⚝", "⚚"]; // Symbol pool
    const container = document.getElementById("particle-container");

    function createParticle() {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        container.appendChild(particle);

        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = startY - (Math.random() * 300 + 100);
        const scale = Math.random() * 1.5 + 0.5;
        const duration = Math.random() * 6 + 4;

        gsap.set(particle, {
            x: startX,
            y: startY,
            scale: scale,
            opacity: 0
        });

        gsap.to(particle, {
            x: endX,
            y: endY,
            opacity: 1,
            duration: duration,
            ease: "power1.out",
            onComplete: () => {
                gsap.to(particle, { opacity: 0, duration: 2, onComplete: () => particle.remove() });
            }
        });
    }

    // Spawn particles continuously
    setInterval(createParticle, 500);

//     const glowText = document.querySelector(".glow-text");

//     function randomFlicker() {
//         const time = Math.random() * 4000 + 500; // Random interval between 0.5s and 4s
//         glowText.style.visibility = (Math.random() > 0.5) ? "visible" : "hidden"; // 50% chance to hide
//         setTimeout(randomFlicker, time);
//     }

//     randomFlicker();
});
