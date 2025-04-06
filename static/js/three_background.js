import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';



document.addEventListener("DOMContentLoaded", () => {
let scene, camera, renderer, composer;
let skyscraperLights = [];

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Deep noir black
    scene.fog = new THREE.Fog(0x000000, 50, 200); // Add depth

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 10, 60); // Adjusted to see the city
    camera.lookAt(0, 5, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Post-processing for neon bloom effect
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.5, 0.3);
    composer.addPass(bloomPass);

    // Generate skyscraper lights
    for (let i = 0; i < 150; i++) {
        const geometry = new THREE.SphereGeometry(Math.random() * 0.4 + 0.2, 12, 12);
        const material = new THREE.MeshBasicMaterial({ color: 0xffcc88, transparent: true, opacity: 0.8 });

        const light = new THREE.Mesh(geometry, material);
        let x = (Math.random() - 0.5) * 200; // Spread lights
        let y = Math.random() * 20 + 5; // Different heights
        let z = -Math.random() * 100 - 20; // Depth for skyline effect

        light.position.set(x, y, z);
        scene.add(light);
        skyscraperLights.push(light);
    }

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Flicker effect
    skyscraperLights.forEach(light => {
        light.material.opacity = 0.6 + Math.sin(Date.now() * 0.002 + light.position.x) * 0.3;
    });

    composer.render();
}

// Ensure resizing works
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize the scene
init();
});