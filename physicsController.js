import * as THREE from 'three';
import clamp, * as UTILS from './utils.js';

const defaultInfos = {
    gravity: -9.81,
    height: 0.2,
    jumpHeight: 0.05,
    jumpForce: 15,
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
        this.isJumping_ = false;
        this.velocity_ = new THREE.Vector3(0, 0, 0);
    }

    onKeyDown(event) {
        this.inputs_[event.key] = true;
    }

    onKeyUp(event) {
        this.inputs_[event.key] = false;
    }

    update(deltaTime) {
        this.isOnFloor_ = this.isOnFloor();
        // this.jump(deltaTime);
        this.applyGravity(deltaTime);
        this.applyVelocity(deltaTime);
    }

    isOnFloor() {
        //Raycast to check if the player is on the floor
        const direction = new THREE.Vector3(0, -1, 0).normalize();
        //Get the origin of the ray
        const origin = this.camera_.position.clone();
        origin.setY(origin.y - 1);

        const raycaster = new THREE.Raycaster(origin, direction);
        const intersects = raycaster.intersectObjects(this.scene_.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].distance <= this.properties_.height) {
                return true;
            }
        }
        return false;
    }

    applyVelocity(deltaTime) {
        this.camera_.position.x += this.velocity_.x * deltaTime;
        this.camera_.position.y += this.velocity_.y * deltaTime;
        this.camera_.position.z += this.velocity_.z * deltaTime;
    }

    applyGravity(deltaTime) {
        if (this.isOnFloor_) {
            this.velocity_.y = 0;
            return;
        }
        this.velocity_.y += this.properties_.gravity * deltaTime;
    }

    jump(deltaTime) {
        if (this.inputs_[" "] && this.isOnFloor_ && !this.isJumping_) {
            this.velocity_.y += this.properties_.jumpForce;
            this.isJumping_ = true;
        }
        if (this.isJumping_) {
            this.velocity_.y += this.properties_.gravity * deltaTime;
            if (this.camera_.position.y < this.properties_.height) {
                this.camera_.position.y = this.properties_.height;
                this.velocity_.y = 0;
                this.isJumping_ = false;
            }
        }
    }
}