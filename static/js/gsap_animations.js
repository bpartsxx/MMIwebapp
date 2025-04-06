document.addEventListener("DOMContentLoaded", () => {
    // GSAP Title & Flicker Effect
    // gsap.to(".glow-text", { duration: 2, opacity: 1, y: -20, ease: "power2.out" });

    function flickerEffect() {
        gsap.to(".glow-text", { opacity: Math.random() * 0.6 + 0.8, duration: 0.1, onComplete: flickerEffect });
    }
    setTimeout(flickerEffect, 2);

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

    const phantom = document.querySelector('.glow-text .normal');

    function flickerSequence() {
        // Step 1: Keep the phantom visible for 3-6 seconds before flickering
        const stableTime = Math.random() * 3000 + 3000; // Random between 3s to 6s

        setTimeout(() => {
            // Step 2: Enter chaotic flickering phase (0.5s - 1.5s)
            let flickerCount = Math.floor(Math.random() * 5) + 3; // Between 3-7 flickers
            let flickerDelay = 0;

            for (let i = 0; i < flickerCount; i++) {
                flickerDelay += Math.random() * 150 + 50; // Random short flickers (50ms-200ms)
                gsap.to(phantom, { opacity: i % 2 === 0 ? 0 : 0.5, delay: flickerDelay / 1000, duration: 0.05 });
            }

            // Step 3: Restore stable visibility and repeat
            setTimeout(() => {
                gsap.to(phantom, { opacity: 90, duration: 0.2 });
                flickerSequence(); // Restart the cycle
            }, flickerDelay + 500);

        }, stableTime);
    }

    flickerSequence();

    const altSymbols = ["☽", "☉", "☾", "♄", "☿", "✙", "𖤐"];
    const sigils = document.querySelectorAll('.sigil'); // ADD THIS LINE
    
    sigils.forEach(sigil => {
        const original = sigil.innerHTML;
        sigil.addEventListener("mouseenter", () => {
            sigil.innerHTML = altSymbols[Math.floor(Math.random() * altSymbols.length)];
        });
        sigil.addEventListener("mouseleave", () => {
            sigil.innerHTML = original;
        });
    });

    // gsap.fromTo("#divine-whisper", {
    //     opacity: 0
    //   }, {
    //     opacity: 0.7,
    //     duration: 4,
    //     delay: 3,
    //     ease: "power1.out"
    //   });
});
