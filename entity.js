import * as THREE from 'three';
import clamp, * as UTILS from './utils.js';

const defaultInfos = {
    healthPoints: 100,
    bufferDistance: 0.25,
    isOnFloor: false,
}

export default class entity extends THREE.Mesh {
    constructor(geometry, material, physicsController = null, scene = null, type) {
        super(geometry, material);
        this.type_ = type;
        this.properties_ = defaultInfos;
        this.velocity_ = new THREE.Vector3(0, 0, 0);
        this.physicsController_ = physicsController;
        this.scene_ = scene;
        this.position.set(0, 10, 0);
    }

    update(deltaTime) {
        if (this.scene_ !== null) {
            this.properties_.isOnFloor = this.isOnFloor();
            console.log(this.properties_.isOnFloor);
        }
        if (this.physicsController_ !== null && this.properties_.isOnFloor === false) {
            this.applyGravity(deltaTime);
        }

        this.applyVelocity(deltaTime);
    }

    getProperties() {
        return this.properties_;
    }

    isAlive() {
        return this.properties_.healthPoints > 0;
    }

    takeDamage(damage) {
        this.properties_.healthPoints -= damage;
    }

    heal(heal) {        //Update the entity
        this.properties_.healthPoints += heal;
    }

    setHealth(health) {
        this.properties_.healthPoints = health;
    }

    getHealth() {
        return this.properties_.healthPoints;
    }

    isOnFloor() {
        //Raycast to check if the player is on the floor
        const direction = new THREE.Vector3(0, -1, 0).normalize();
        //Get the origin of the ray
        const origin = this.position.clone();

        const raycaster = new THREE.Raycaster(origin, direction);
        const intersects = raycaster.intersectObjects(this.scene_.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].distance.toFixed(4) <= 0.5) {
                return true;
            }
        }
        return false;
    }

    checkCollisions() {
        // Check for collisionsentity
        const bufferDistance = this.properties_.bufferDistance;
        const origin = this.position.clone();
        const direction = this.velocity_.clone().normalize();
        const raycaster = new THREE.Raycaster(origin, direction);
        const intersects = raycaster.intersectObjects(this.scene_.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].distance.toFixed(4) <= bufferDistance) {
                
            }
        }
    }

    applyGravity(deltaTime) {
        this.velocity_.y += this.physicsController_.properties_.gravity * deltaTime;
    }

    applyVelocity(deltaTime) {
        if (this.properties_.isOnFloor)
            this.velocity_.y = 0;
        this.position.add(this.velocity_.clone().multiplyScalar(deltaTime));
    }
}

export class hostileEntity extends entity {
    constructor(geometry, material, physicsController = null, scene = null, type) {
        super(geometry, material, physicsController, scene, type);
    }

    update(deltaTime) {
        super.update(deltaTime);
    }
}

export class healthPackEntity extends entity {
    constructor(geometry, material, type) {
        super(geometry, material, type);
    }

    update(deltaTime) {
        console.log("Health pack update");
    }
}
