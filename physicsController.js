import * as THREE from 'three';
import clamp, * as UTILS from './utils.js';

const defaultInfos = {
    gravity: -9.81,
    height: 1.8,
}

export default class physicsController {
    constructor(camera, scene, domElement) {
        this.camera_ = camera;
        this.canvas_ = domElement;
        this.scene_ = scene;
        this.inputs_ = {
            " ": false
        };
        this.properties_ = defaultInfos;
        this.isOnFloor_ = false;
    }

    onKeyDown(event) {
        this.inputs_[event.key] = true;
    }

    onKeyUp(event) {
        this.inputs_[event.key] = false;
    }

    update(deltaTime) {

        this.isOnFloor_ = this.isOnFloor();
        this.applyGravity(deltaTime);
    }

    isOnFloor() {
        //Raycast to check if the player is on the floor
        const direction = new THREE.Vector3(0, -1, 0);
        //Get the origin of the ray
        const origin = this.camera_.position;

        const raycaster = new THREE.Raycaster(origin, direction);
        const intersects = raycaster.intersectObjects(this.scene_.children);
        
        let isOnFloor = false;
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].distance < this.properties_.height) {
                isOnFloor = true;
                break;
            }
        }
        return isOnFloor;
    }

    applyGravity(deltaTime) {
        if (this.isOnFloor_)
            return;
        this.camera_.position.y += this.properties_.gravity * deltaTime;
    }
}