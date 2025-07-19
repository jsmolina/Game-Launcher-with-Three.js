    import * as THREE from 'three';

    // Class game
    export class Game {
        name = '';
        focus = false;
        zoom = false;
        position;
        rotation;
        scale;
        cameraOnFocus;
        mesh;
        constructor(name) {
            this.name = name;
            this.focus = false;
            this.position = new THREE.Vector3();
            this.rotation = new THREE.Vector3();
            this.scale = new THREE.Vector3();
            this.cameraOnFocus = new THREE.Vector3(); 
        }

        setPosition(x,y,z){
            this.position = new THREE.Vector3(x,y,z);
            this.mesh.position.set(this.position.x,this.position.y,this.position.z);
        }

        setRotation(x,y,z){
            this.rotation = new THREE.Vector3(x,y,z);
            this.mesh.rotation.set(this.rotation.x,this.rotation.y,this.rotation.z);
        }

        setScale(x,y,z){
            this.scale = new THREE.Vector3(x,y,z);
            this.mesh.scale.set(this.scale.x,this.scale.y,this.scale.z);
        }

        setCameraOnFocus(x,y,z){
            this.cameraOnFocus.x = x;
            this.cameraOnFocus.y = y;
            this.cameraOnFocus.z = z;
        }

        isFocused(){
            return this.focus;
        }

        isZoomed(){
            return this.zoom;
        }
    }

    
