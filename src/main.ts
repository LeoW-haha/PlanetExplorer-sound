import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Planet } from "./planet";
import { Settings } from "./settings"
import { collisionTest } from "./collisionTest.ts";
import { loadTardis, updateTardis} from './tardis';

// I’m sure there’s a better name for this
class Global {
    #activePlanet: Planet
    #controls: OrbitControls
    #camera: THREE.PerspectiveCamera
    #scene: THREE.Scene
    #renderer: THREE.WebGLRenderer
    #testScene: collisionTest
    #debugLightSphere: THREE.Mesh
    #listener: THREE.AudioListener | null = null


    get ActivePlanet() { return this.#activePlanet }

    constructor() {
        this.#renderer = new THREE.WebGLRenderer();
        this.#renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.#renderer.domElement);
        this.#scene = new THREE.Scene();
        this.#listener = new THREE.AudioListener();
        this.#camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.#camera.position.set(10, 10, 10)
        this.#camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.#camera.add(this.#listener); 
        this.#controls = new OrbitControls(this.#camera, this.#renderer.domElement)
        this.#renderer.setAnimationLoop(this.Tick.bind(this));


        let settings = new Settings();
        this.#activePlanet = new Planet(settings, this.#scene, this.#listener)
        let shader: THREE.ShaderMaterial = this.ActivePlanet.Mesh!.material as THREE.ShaderMaterial;
        shader.uniforms.u_cameraPos.value = this.#camera.position;
        this.#testScene = new collisionTest(this.#scene);

        loadTardis(this.#scene, settings, this.#listener);
        
        

        this.#debugLightSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshBasicMaterial({ color: 0xffaa00 }))
        this.#scene.add(this.#debugLightSphere)

        //adds sound to the debug light

        settings.LightSound = new THREE.PositionalAudio(this.#listener);
        const audioLoader = new THREE.AudioLoader()
        audioLoader.load( 'sound/ambientSun.ogg', (buffer) => {
            settings.LightSound?.setBuffer( buffer );
            settings.LightSound?.setLoop( true );
            settings.LightSound?.setVolume( 0.25 );
            settings.LightSound?.setRolloffFactor(2.5);
        });
        
        this.#debugLightSphere.add(settings.LightSound);
    }

    Tick() {
        this.#controls.update()
        this.#renderer.render(this.#scene, this.#camera);
        updateTardis();

        // Update camera pos…  this had sure better be temporary
        let shader: THREE.ShaderMaterial = this.ActivePlanet.Mesh!.material as THREE.ShaderMaterial;
        shader.uniforms.u_cameraPos.value = this.#camera.position;
        let lightPos: THREE.Vector3 = shader.uniforms.u_lightPos.value;
        this.#debugLightSphere.position.set(lightPos.x, lightPos.y, lightPos.z);
        this.#testScene.update();
    }
}



new Global;




