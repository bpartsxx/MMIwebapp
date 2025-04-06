import * as THREE from 'three';

let camera, scene, renderer, uniforms;

let mouse = new THREE.Vector2(0.5, 0.5);
let clock = new THREE.Clock();

init();
animate();

function init() {
    // Canvas
    const canvas = document.getElementById('three-bg');
    if (!canvas) {
        console.error('Canvas with id "three-bg" not found.');
        return;
    }

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Camera
    camera = new THREE.Camera();
    camera.position.z = 1;

    // Scene
    scene = new THREE.Scene();

    // Geometry & Uniforms
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    uniforms = {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) }
    };

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: `
            uniform vec2 u_mouse;
            uniform vec2 u_resolution;
            uniform float u_time;

            float ripple(vec2 uv, vec2 center) {
                float dist = distance(uv, center);
                return 0.05 / abs(sin(dist * 40.0 - u_time * 5.0) + 0.005);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec3 color = vec3(0.02); // base dark glow

                float wave = ripple(uv, u_mouse);

                color += vec3(0.9, 0.2, 0.6) * wave; // divine pinkish glow

                gl_FragColor = vec4(color, 1.0);
            }
        `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse move listener
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX / window.innerWidth;
        mouse.y = 1 - event.clientY / window.innerHeight;
        uniforms.u_mouse.value.set(mouse.x, mouse.y);
    });

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    uniforms.u_time.value += clock.getDelta();
    renderer.render(scene, camera);
}
