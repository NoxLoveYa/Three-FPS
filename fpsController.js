import * as THREE from 'three';

const defaultInfos = {
    speed: 0.1
}

export default class fpsController {
    constructor(camera, domElement) {
        this.camera_ = camera;
        this.inputs_ = {
            z: false,
            s: false,
            q: false,
            d: false
        };
        this.properties_ = defaultInfos;
    }

    onKeyDown(event) {
        this.inputs_[event.key] = true;
    }

    onKeyUp(event) {
        this.inputs_[event.key] = false;
    }

    update() {
        var movement = new THREE.Vector3(0, 0, 0)
        if (this.inputs_['z']) {
            movement.z -= this.properties_.speed;
        }
        if (this.inputs_['s']) {
            movement.z += this.properties_.speed;
        }
        if (this.inputs_['q']) {
            movement.x -= this.properties_.speed;
        }
        if (this.inputs_['d']) {
            movement.x += this.properties_.speed;
        }
        movement.normalize();
        movement.multiplyScalar(this.properties_.speed);
        this.camera_.position.add(movement);
    }
}
