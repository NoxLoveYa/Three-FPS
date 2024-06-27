import * as THREE from 'three';
import clamp, * as UTILS from './utils.js';

const defaultInfos = {
    gravity: -9.81,
    height: 0.4,
    jumpForce: 5,
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
        this.jump(deltaTime);
        this.applyGravity(deltaTime);
        this.applyVelocity(deltaTime);
    }

    isOnFloor() {
        //Raycast to check if the player is on the floor
        const direction = new THREE.Vector3(0, -1, 0).normalize();
        //Get the origin of the ray
        const origin = this.camera_.position.clone();

        const raycaster = new THREE.Raycaster(origin, direction);
        const intersects = raycaster.intersectObjects(this.scene_.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].distance.toFixed(4) <= this.properties_.height) {
                this.camera_.position.y += this.properties_.height - intersects[i].distance;
                return true;
            }
        }
        return false;
    }

    applyVelocity(deltaTime) {
        // Check for collisions
        const bufferDistance = 0.25;

        const velocityClone = this.velocity_.clone();
        velocityClone.y = 0; // Ignore vertical velocity

        const direction = this.velocity_.clone().normalize();
        direction.y = 0; // We're only concerned with horizontal collisions

        // Calculate the potential future position
        const futurePosition = this.camera_.position.clone().add(velocityClone.clone().multiplyScalar(deltaTime));
        const origin = this.camera_.position.clone();
        origin.y += this.properties_.height;

        // Set up the raycaster
        const raycaster = new THREE.Raycaster(origin, direction);
        const intersects = raycaster.intersectObjects(this.scene_.children);

        for (let i = 0; i < intersects.length; i++) {
            const intersect = intersects[i];
            const distanceToIntersection = intersect.distance;

            // Calculate the distance we would travel in the next frame
            const distanceToTravel = velocityClone.length() * deltaTime;

            // Check if there's an intersection within the distance we would travel
            if (distanceToIntersection < distanceToTravel + bufferDistance  ) {
                // A collision is imminent, so stop the character's movement
                this.velocity_.x = 0;
                this.velocity_.z = 0;
                break;
            }
        }

        //Apply velocity to the camera
        this.camera_.position.x += this.velocity_.x * deltaTime;
        if (this.isOnFloor_) {
            if (!this.isJumping_)
                this.velocity_.y = 0;
        }
        this.camera_.position.y += this.velocity_.y * deltaTime;
        this.camera_.position.z += this.velocity_.z * deltaTime;
        this.velocity_.x = 0;
        this.velocity_.z = 0;
    }

    applyGravity(deltaTime) {
        this.velocity_.y += this.properties_.gravity * deltaTime;
    }

    jump(deltaTime) {
        if (this.inputs_[" "] && this.isOnFloor_ && !this.isJumping_) {
            this.velocity_.y += this.properties_.jumpForce;
            this.isJumping_ = true;
            return;
        }
        this.isJumping_ = false;
    }
}