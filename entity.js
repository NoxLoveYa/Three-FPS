import * as THREE from 'three';
import clamp, * as UTILS from './utils.js';

const defaultInfos = {
    healthPoints: 100,
}

export default class entity extends THREE.SkinnedMesh {
    constructor(geometry, material, type) {
        super(geometry, material);
        this.type = type;
        this.properties_ = defaultInfos;
    }

    update(deltaTime) {
        //Update the entity
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

    heal(heal) {
        this.properties_.healthPoints += heal;
    }

    setHealth(health) {
        this.properties_.healthPoints = health;
    }

    getHealth() {
        return this.properties_.healthPoints;
    }
}
