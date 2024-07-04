import entity, * as entityTypes from './entity.js';

const defaultInfos = {
}

export default class entityController {
    constructor(scene) {
        this.scene_ = scene;
    }

    addEntity(entity) {
        this.scene_.add(entity);
    }

    removeEntity(entity) {
        this.scene_.remove(entity);
    }

    update(deltaTime) {
        this.scene_.children.forEach(obj => {
            if (obj.update !== undefined && typeof obj.update === 'function' && obj.type_ !== undefined) {
                obj.update(deltaTime);
            }
        });
    }

    getEntities() {
        var entities = [];
        this.scene_.children.forEach(obj => {
            if (obj.update !== undefined && typeof obj.update === 'function' && obj.type_ !== undefined) {
                entities.push(obj);
            }
        });
        return entities;
    }

    getEntitiesByType(type) {
        var entities = [];
        this.scene_.children.forEach(obj => {
            if (obj.type_ === type) {
                entities.push(obj);
            }
        });
        return entities;
    }
}
