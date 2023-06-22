import * as THREE from 'three';
import { extendMaterial } from 'three-extend-material';

import Experience from '../Experience';

// Effects
import bottomAppear from '../shaders/triangleEffect/bottomAppearVertex.glsl'
import flyAppear from '../shaders/triangleEffect/flyAppearVertex.glsl'
import rotationAppear from '../shaders/triangleEffect/rotationAppearVertex.glsl'
import tornadoDisappear from '../shaders/triangleEffect/tornadoDisappearVertex.glsl'
import windDisappear from '../shaders/triangleEffect/windDisappearVertex.glsl'
import xDisappear from '../shaders/triangleEffect/xDisappearVertex.glsl'


export default class TrianglesEffect {
    constructor(geometry, objectName, effectName, colorMaterial) {
        this.experience = new Experience();
        this.debug = this.experience.debug;

        //Effects list
        this.effectsVertexList = {
          bottom: bottomAppear,
          fly: flyAppear,
          rotation: rotationAppear,
          tornado: tornadoDisappear,
          wind: windDisappear,
          xRotation: xDisappear
        }

        this.vertexEffect = this.effectsVertexList[effectName]
        
        this.geometry = geometry;
        this.colorMaterial = colorMaterial;
        
        
        // Progress Value
        this.setting = {
            progress: 0,
            time: 0
        }
        
        
        if(this.debug.active) {
            this.debugObjectTriangles = this.debug.debugTrianglesSketch.addFolder(`${objectName}`);

            

            this.debugObjectTriangles.add(this.setting, "progress", 0, 1, 0.01).onChange(val => {
                this.triangleEffectMaterial.uniforms.progress.value = val;
              });
        }

        this.createTriangleMaterial();
        this.createTriangleGeometry();
    };

    createTriangleMaterial() {
        this.triangleEffectMaterial = extendMaterial( THREE.MeshStandardMaterial, {
            class: THREE.CustomMaterial,

            vertexHeader: `
              attribute float aRandom;
              attribute vec3 aCenter;
              uniform float time;
              uniform float progress;
      
              mat4 rotationMatrix(vec3 axis, float angle) {
                axis = normalize(axis);
                float s = sin(angle);
                float c = cos(angle);
                float oc = 1.0 - c;
                
                return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                            oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                            oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                            0.0,                                0.0,                                0.0,                                1.0);
              }
              
              vec3 rotate(vec3 v, vec3 axis, float angle) {
                mat4 m = rotationMatrix(axis, angle);
                return (m * vec4(v, 1.0)).xyz;
              }
            `,

            vertex: {
                transformEnd: this.vertexEffect,
              },

              uniforms: {
                roughness: 0.75,
                time: {
                  mixed: true,
                  linked: true,
                  value: 0
                },
                progress: {
                  mixed: true,
                  linked: true,
                  value: 0.0
                }
              }  
        })

        this.triangleEffectMaterial.uniforms.diffuse.value = new THREE.Color(this.colorMaterial)
    }

    createTriangleGeometry() {
        this.triangleEffectGeometry = this.geometry.toNonIndexed()

        //Create Attributes
        let len = this.triangleEffectGeometry.attributes.position.count; // Number of vertices postion
        let randoms = new Float32Array(len);
        let centers = new Float32Array(len * 3);

        for (let i = 0; i < len; i+=3) {
            let r = Math.random();
      
            randoms[i] = r;
            randoms[i + 1] = r;
            randoms[i + 2] = r;
      
            //Triangle verteces positions
            let x = this.triangleEffectGeometry.attributes.position.array[i*3];
            let y = this.triangleEffectGeometry.attributes.position.array[i*3+1];
            let z = this.triangleEffectGeometry.attributes.position.array[i*3+2];
      
            let x1 = this.triangleEffectGeometry.attributes.position.array[i*3+3];
            let y1 = this.triangleEffectGeometry.attributes.position.array[i*3+4];
            let z1 = this.triangleEffectGeometry.attributes.position.array[i*3+5];
      
            let x2 = this.triangleEffectGeometry.attributes.position.array[i*3+6];
            let y2 = this.triangleEffectGeometry.attributes.position.array[i*3+7];
            let z2= this.triangleEffectGeometry.attributes.position.array[i*3+8];
      
            let center = new THREE.Vector3(x, y, z)
                            .add(new THREE.Vector3(x1, y1, z1))
                            .add(new THREE.Vector3(x2, y2, z2))
                            .divideScalar(3);
      
            centers.set([center.x, center.y, center.z], i*3);
            centers.set([center.x, center.y, center.z], (i+1)*3);
            centers.set([center.x, center.y, center.z], (i+2)*3);
        }

        this.triangleEffectGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
        this.triangleEffectGeometry.setAttribute('aCenter', new THREE.BufferAttribute(centers, 3));
    }

    createTriangleShadow(object) {
        object.customDepthMaterial = extendMaterial(THREE.MeshDepthMaterial, {
            template: this.triangleEffectMaterial
          });
    }

    //UPDATE
    update() {
        this.setting.time += 0.01;
        this.triangleEffectMaterial.uniforms.time.value = this.time;
    }
}