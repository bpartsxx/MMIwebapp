document.addEventListener("DOMContentLoaded", function () {
    // ----- Scene Setup -----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.zIndex = "0";
    document.body.appendChild(renderer.domElement);

    // ----- Particle System -----
    const particleCount = 300;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3); // For movement

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = Math.random() * -5;
        
        velocities[i * 3] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 2] = 0;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // Particle shader
    const particleVertexShader = `
        uniform float size;
        uniform vec3 uMouse;
        varying float vDistance;
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vDistance = distance(worldPosition.xyz, uMouse);
            gl_PointSize = size * (1.0 / vDistance);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const particleFragmentShader = `
        varying float vDistance;
        uniform float uThreshold;
        uniform float opacity;
        void main() {
            float factor = smoothstep(uThreshold, 0.0, vDistance);
            vec3 color = mix(vec3(1.0, 0.8, 1.0), vec3(0.1, 0.1, 0.8), factor);
            gl_FragColor = vec4(color, opacity);
        }
    `;

    const particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
            size: { value: 15.0 },
            uMouse: { value: new THREE.Vector3(0, 0, 0) },
            uThreshold: { value: 5.0 },
            opacity: { value: 0.9 }
        },
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // ----- Mouse Interactivity -----
    const mouse = new THREE.Vector2();
    document.addEventListener("mousemove", (event) => {
        // Convert screen coordinates to normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // Convert to world coordinates
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        particlesMaterial.uniforms.uMouse.value.copy(vector);
    });

    // ----- Animation Loop -----
    function animate() {
        requestAnimationFrame(animate);

        const positionsArray = particlesGeometry.attributes.position.array;
        const velocitiesArray = particlesGeometry.attributes.velocity.array;

        for (let i = 0; i < particleCount; i++) {
            // Make particles float and drift randomly
            positionsArray[i * 3] += velocitiesArray[i * 3];
            positionsArray[i * 3 + 1] += velocitiesArray[i * 3 + 1];

            // Mouse interaction: repel when near
            const dx = positionsArray[i * 3] - particlesMaterial.uniforms.uMouse.value.x;
            const dy = positionsArray[i * 3 + 1] - particlesMaterial.uniforms.uMouse.value.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 2.5) { // Stronger interaction zone
                velocitiesArray[i * 3] += dx * 0.02;
                velocitiesArray[i * 3 + 1] += dy * 0.02;
            }

            // Reset positions if they go out of bounds
            if (positionsArray[i * 3] > 20 || positionsArray[i * 3] < -20) {
                positionsArray[i * 3] = (Math.random() - 0.5) * 40;
            }
            if (positionsArray[i * 3 + 1] > 10 || positionsArray[i * 3 + 1] < -10) {
                positionsArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
            }
        }

        particlesGeometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
