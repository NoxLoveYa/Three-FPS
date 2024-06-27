import * as THREE from 'three';
import clamp, * as UTILS from './utils.js';

const defaultInfos = {
    healthPoints: 100,
    bufferDistance: 0.25
}

export default class entity extends THREE.SkinnedMesh {
    constructor(geometry, material, type) {
        super(geometry, material);
        this.type_ = type;
        this.properties_ = defaultInfos;
        this.velocity_ = new THREE.Vector3(0, 0, 0);
    }

    update(deltaTime) {
        checkCollisions();
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

    checkCollisions() {
        // Check for collisions
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
}

export class hostileEntity extends entity {
    constructor(geometry, material, type) {
        super(geometry, material, type);
    }

    update(deltaTime) {
        console.log("Hostile entity update");
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
