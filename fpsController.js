import * as THREE from 'three';

const defaultInfos = {
    speed: 20,
    in_focus: true
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
        this.canvas_ = domElement;
        this.canvas_.addEventListener('click', this.requestPointerLock);
        this.mouseDelta_ = {
            x: 0,
            y: 0
        };
    }

    onKeyDown(event) {
        this.inputs_[event.key] = true;
    }

    onKeyUp(event) {
        this.inputs_[event.key] = false;
    }

    update() {
        if (this.properties_.in_focus === false) {
            return;
        }
        //Check inputs for movement
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
        //Check mouseDelta for rotation
        this.camera_.rotateX(-this.mouseDelta_.y * 0.001 * this.properties_.speed);
        this.camera_.rotateY(-this.mouseDelta_.x * 0.001 * this.properties_.speed);
        //Reset mouseDelta
        this.mouseDelta_ = {
            x: 0,
            y: 0
        }
    }

    lockChangeAlert() {
        if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas) {
            document.body.style.cursor = "none";
        } else {
            document.body.style.cursor = "auto";
        }
    }

    requestPointerLock() {
        this.requestPointerLock = this.requestPointerLock || this.mozRequestPointerLock || this.webkitRequestPointerLock;
        this.requestPointerLock();
        document.addEventListener('pointerlockchange', this.lockChangeAlert, false);
    }

    updateMouseDelta(event) {
        this.mouseDelta_ = {
            x: event.movementX,
            y: event.movementY
        }
    }
}
