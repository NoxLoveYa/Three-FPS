import * as THREE from 'three';
import clamp, * as UTILS from './utils.js';

const defaultInfos = {
    speed: 2,
    sensitivity: 20,
    in_focus: true
}

export default class physicsController {
    constructor(camera, domElement) {
        this.camera_ = camera;
        this.inputs_ = {
            " ": false
        };
        this.properties_ = defaultInfos;
        this.canvas_ = domElement;
    }

    onKeyDown(event) {
        this.inputs_[event.key] = true;
    }

    onKeyUp(event) {
        this.inputs_[event.key] = false;
    }

    update(deltaTime) {
    }
}