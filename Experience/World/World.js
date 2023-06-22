import * as THREE from 'three'
import Experience from '../Experience';
import { EventEmitter } from "events";

import Environment from '../Scene/Environement';
import Models from './Models';
import Objects from './Objects';

import TrianglesEffect from '../Sketches/TrianglesEffect';


export default class World extends EventEmitter {
    constructor() {
        super();

        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;

        this.objects = [];
        
        // Start world (on ressource ready)
        this.resources.on("ready", ()=> {
            this.environment = new Environment();

            // Floor
            this.setFloor(50, 50, 0xffffff) 

            // Wolf
            this.wolf = new Models(this.resources.items.wolf.scene);
            this.wolf.model.scale.set(.005, .005, .005);
            this.wolf.model.position.y = -7.3;

            // Sphere
            this.addTrianglesObject(new THREE.IcosahedronGeometry(1, 10),'sphere', 'tornado', 0xff0000);
            this.objects.sphere.object.position.set(5, 2, 0)
            
            // Cube
            this.addTrianglesObject(new THREE.BoxGeometry( 1.5, 1.5, 1.5, 10, 10, 10 ), 'cube', 'wind', 0x008E80);

            this.objects.cube.object.position.set(-5, 2, 0);
            this.objects.cube.object.rotation.set(1, 1, 1);
            
            
            this.emit("worldready");
        }); 
        
    }

    /**
     * 
     * @param {number} geometryX 
     * @param {number} geometryZ 
     * @param {*} color 
     */
    setFloor(geometryX, geometryZ, color) {
        const geometry = new THREE.PlaneGeometry(geometryX, geometryZ);
        const material = new THREE.MeshStandardMaterial( {color: color, side: THREE.DoubleSide} );
        this.plane = new THREE.Mesh( geometry, material );
        this.plane.receiveShadow = true;
        this.plane.castShadow = false;
    
        this.plane.rotateX(Math.PI / 180 * 90);
        this.scene.add( this.plane );
    }

    /**
     * 
     * @param {THREE.geometry} geometry 
     * @param {String} objectName
     * @param {String} effectName 
     */
    addTrianglesObject(geometry, objectName, effectName = 'wind', colorMaterial = '0xfff') {
        let trianglesEffect = new TrianglesEffect(
            geometry,
            objectName,
            effectName,
            colorMaterial
        )

        // Push in objects array to access it outside by his name
        this.objects[`${objectName}`] = new Objects(
            trianglesEffect.triangleEffectGeometry,
            trianglesEffect.triangleEffectMaterial,
            objectName
        );
        
        //Bind Shadow to object
        trianglesEffect.createTriangleShadow(this.objects[`${objectName}`].object);
    }

    //RESIZE
    resize() {
    }

    //UPDATE
    update() {
        
        if(this.objects.cube) {
            this.objects.cube.object.rotation.x -= .001 * 2;
            this.objects.cube.object.rotation.y -= .001 * 3;
            this.objects.cube.object.rotation.z -= .001 * 4;
        }

        if(this.trianglesEffect) {
            this.trianglesEffect.update();
        }
    }
}