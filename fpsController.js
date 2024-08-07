import * as THREE from 'three';
import clamp, * as UTILS from './utils.js';

const defaultInfos = {
    speed: 75,
    sensitivity: 20,
    in_focus: true
}

export default class fpsController {
    constructor(camera, domElement, physicsController) {
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
        document.addEventListener('pointerlockchange', () => {
            this.properties_.in_focus = document.pointerLockElement === this.canvas_;
        });
        this.mouseDelta_ = {
            x: 0,
            y: 0
        };
        this.phi_ = 0;
        this.theta_ = 0;
        this.physicsController_ = physicsController;
        this.scene_ = null;
    }

    onKeyDown(event) {
        this.inputs_[event.key] = true;
    }

    onKeyUp(event) {
        this.inputs_[event.key] = false;
    }

    update(deltaTime) {
        if (this.properties_.in_focus === false) {
            return;
        }
        //Check inputs for movement
        this.headMove(deltaTime);
        //Apply headbob
        this.headBob();
        //Check mouseDelta for rotation
        this.headRotate();
        //Reset mouseDelta
        this.mouseDelta_ = {
            x: 0,
            y: 0
        }
    }

    requestPointerLock() {
        this.requestPointerLock = this.requestPointerLock || this.mozRequestPointerLock || this.webkitRequestPointerLock;
        this.requestPointerLock();
    }

    updateMouseDelta(event) {
        this.mouseDelta_ = {
            x: event.movementX,
            y: event.movementY
        }
    }

    headMove(deltaTime) {
        const forwardVelocity = (this.inputs_['z'] ? 1 : 0) + (this.inputs_['s'] ? -1 : 0)
        const strafeVelocity = (this.inputs_['q'] ? 1 : 0) + (this.inputs_['d'] ? -1 : 0)

        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);

        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(qx);
        forward.multiplyScalar(forwardVelocity * deltaTime * this.properties_.speed);

        const left = new THREE.Vector3(-1, 0, 0);
        left.applyQuaternion(qx);
        left.multiplyScalar(strafeVelocity * deltaTime * this.properties_.speed);

        forward.add(left);

        this.physicsController_.velocity_.add(forward);
    }

    headRotate() {
        const xh = this.mouseDelta_.x / window.innerWidth;
        const yh = this.mouseDelta_.y / window.innerHeight;

        this.phi_ += -xh * this.properties_.sensitivity;
        this.theta_ = clamp(this.theta_ + -yh * this.properties_.sensitivity, -Math.PI / 3, Math.PI / 3);

        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
        const qz = new THREE.Quaternion();
        qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta_);

        const q = new THREE.Quaternion();
        q.multiply(qx);
        q.multiply(qz);

        this.camera_.quaternion.copy(q);
    }

    headBob() {
        //TODO
    }

    fireLookRay() {
        if (this.scene_ === null) {
            return;
        }
        // get camera direction
        const direction = new THREE.Vector3();
        this.camera_.getWorldDirection(direction);
        const origin = this.camera_.position;

        // create raycaster
        const raycaster = new THREE.Raycaster(origin, direction);
        const intersects = raycaster.intersectObjects(this.scene_.children);
        return intersects;
    }
}
