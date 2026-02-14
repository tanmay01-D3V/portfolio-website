import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Models from './models';

export default class GLApp {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(this.pixelRatio);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(35, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 100);
        this.camera.position.z = 12;

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;

        this.ambient_light = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambient_light);

        this.dir_light = new THREE.DirectionalLight(0xffffff, 5);
        this.dir_light.position.set(5, 5, 5);
        this.scene.add(this.dir_light);

        this.models = new Models(this);

        this.onResize = this.onResize.bind(this);
        window.addEventListener('resize', this.onResize);

        this.animate = this.animate.bind(this);
        this.animate();
    }

    onResize() {
        if (!this.canvas) return;
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    animate() {
        this.requestID = requestAnimationFrame(this.animate);
        if (this.models && this.models.is_ready) {
            this.models.update();
        }
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }

    destroy() {
        window.removeEventListener('resize', this.onResize);
        cancelAnimationFrame(this.requestID);
        this.renderer.dispose();
    }
}
