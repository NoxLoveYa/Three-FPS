import * as THREE from 'three';
import clamp, * as UTILS from './utils.js';

const defaultInfos = {
    healthPoints: 100,
}

export default class entity extends THREE.SkinnedMesh {
    constructor(geometry, material, type) {
        super(geometry, material);
        this.type_ = type;
        this.properties_ = defaultInfos;
    }

    update(deltaTime) {
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
}

export class hostileEntity extends entity {
    constructor(geometry, material, type) {
        super(geometry, material, type);
    }

    update(deltaTime) {
        console.log("Hostile entity update");
    }
}
