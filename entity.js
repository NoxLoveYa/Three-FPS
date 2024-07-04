import * as THREE from 'three';
import clamp, * as UTILS from './utils.js';

const defaultInfos = {
    isOnFloor: false
}

const enemyInfos = {
    isOnFloor: false,
    baseHealthPoints: 100,
    healthPoints: 100,
    damage: 10,
    attackSpeed: 1,
    lastAttack: 0,
    attackRange: 1,
    movementSpeed: 0.35
}

const healthPackInfos = {
    healAmount: 50,
    healRadius: 0.2
}

export default class entity extends THREE.Mesh {
    constructor(geometry, material, physicsController = null, fpsController = null, scene = null, type) {
        super(geometry, material);
        this.type_ = type;
        this.properties_ = defaultInfos;
        this.velocity_ = new THREE.Vector3(0, 0, 0);
        this.physicsController_ = physicsController;
        this.fpsController_ = fpsController;
        this.scene_ = scene;
    }

    update(deltaTime) {
        if (this.scene_ !== null) {
            this.properties_.isOnFloor = this.isOnFloor();
        }
        if (this.physicsController_ !== null && this.properties_.isOnFloor === false) {
            this.applyGravity(deltaTime);
        }
        this.checkCollisions(deltaTime)
        this.applyVelocity(deltaTime);
    }

    getProperties() {
        return this.properties_;
    }

    isOnFloor() {
        //Raycast to check if the player is on the floor
        const direction = new THREE.Vector3(0, -1, 0).normalize();
        //Get the origin of the ray
        const origin = this.position.clone();

        const raycaster = new THREE.Raycaster(origin, direction);
        const intersects = raycaster.intersectObjects(this.scene_.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].distance.toFixed(4) <= this.geometry.parameters.height / 2) {
                return true;
            }
        }
        return false;
    }

    checkCollisions(deltaTime) {
        const velocityClone = this.velocity_.clone();
        velocityClone.y = 0; // Ignore vertical velocity

        const direction = this.velocity_.clone().normalize();
        direction.y = 0; // We're only concerned with horizontal collisions

        const origin = this.position.clone();

        // Set up the raycaster
        var raycaster = new THREE.Raycaster(origin, direction);
        var intersects = raycaster.intersectObjects(this.scene_.children);

        for (let i = 0; i < intersects.length; i++) {
            const intersect = intersects[i];
            const distanceToIntersection = intersect.distance;

            // Calculate the distance we would travel in the next frame
            const distanceToTravel = velocityClone.length() * deltaTime;

            // Check if there's an intersection within the distance we would travel
            if (distanceToIntersection < distanceToTravel + this.geometry.parameters.width / 2) {
                // A collision is imminent, so stop the character's movement
                this.velocity_.x = 0;
                this.velocity_.z = 0;
                return true;
            }
        }

        origin.y -= this.geometry.parameters.height / 2;

        raycaster = new THREE.Raycaster(origin, direction);
        intersects = raycaster.intersectObjects(this.scene_.children);

        for (let i = 0; i < intersects.length; i++) {
            const intersect = intersects[i];
            const distanceToIntersection = intersect.distance;

            // Calculate the distance we would travel in the next frame
            const distanceToTravel = velocityClone.length() * deltaTime;

            // Check if there's an intersection within the distance we would travel
            if (distanceToIntersection < this.geometry.parameters.width / 2) {
                // A collision is imminent, so stop the character's movement
                this.velocity_.x = 0;
                this.velocity_.z = 0;
                return true;
            }
        }

        origin.y += this.geometry.parameters.height / 2;

        raycaster = new THREE.Raycaster(origin, direction);
        intersects = raycaster.intersectObjects(this.scene_.children);

        for (let i = 0; i < intersects.length; i++) {
            const intersect = intersects[i];
            const distanceToIntersection = intersect.distance;

            // Calculate the distance we would travel in the next frame
            const distanceToTravel = velocityClone.length() * deltaTime;

            // Check if there's an intersection within the distance we would travel
            if (distanceToIntersection < this.geometry.parameters.width / 2) {
                // A collision is imminent, so stop the character's movement
                this.velocity_.x = 0;
                this.velocity_.z = 0;
                return true;
            }
        }
        return false;
    }

    applyGravity(deltaTime) {
        this.velocity_.y += this.physicsController_.properties_.gravity;
    }

    applyVelocity(deltaTime) {
        if (this.properties_.isOnFloor)
            this.velocity_.y = 0;
        this.position.add(this.velocity_.clone().multiplyScalar(deltaTime));
        this.velocity_.x = 0;
        this.velocity_.z = 0;
    }
}

export class hostileEntity extends entity {
    constructor(geometry, material, physicsController = null, fpsController = null, scene = null, type) {
        super(geometry, material, physicsController, fpsController, scene, type);
        this.properties_ = enemyInfos;
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (this.isAlive() === false) {
            this.die();
            return;
        }
        const healthPercentage = this.properties_.healthPoints / this.properties_.baseHealthPoints;
        const blue = Math.round(255 * (1 - healthPercentage));
        const green = Math.round(255 * healthPercentage);
        const color = new THREE.Color(0, green / 255, blue / 255);
        this.material.color = color;
        this.attack();
    }

    isAlive() {
        return this.properties_.healthPoints > 0;
    }

    takeDamage(damage) {
        this.properties_.healthPoints -= damage;
        if (this.properties_.healthPoints <= 0) {
            this.die();
        }
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

    die() {
        this.scene_.remove(this);
    }

    attack() {
        const playerPosition = this.fpsController_.camera_.position;
        const direction = playerPosition.clone().sub(this.position).normalize();
        const distance = playerPosition.distanceTo(this.position);

        if (distance <= this.properties_.attackRange) {
            if (Date.now() - this.properties_.lastAttack < this.properties_.attackSpeed * 1000) {
                return;
            }
            console.log("Attack");
            this.properties_.lastAttack = Date.now();
        } else
            this.velocity_ = direction.multiplyScalar(this.properties_.movementSpeed);
    }
}

export class healthPackEntity extends entity {
    constructor(geometry, material, fpsController = null, scene = null, type) {
        super(geometry, material, null, fpsController, scene, type);
        this.properties_ = healthPackInfos
    }

    update(deltaTime) {
        const playerPosition = this.fpsController_.camera_.position;
        const distance = playerPosition.distanceTo(this.position);

        if (distance <= 1) {
            console.log("Healed Player by " + this.properties_.healAmount);
            this.die();
        }
    }

    die() {
        this.scene_.remove(this);
    }
}
