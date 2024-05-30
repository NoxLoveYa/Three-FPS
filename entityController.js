import entity, * as entityTypes from './entity.js';

const defaultInfos = {
}

export default class entityController {
    constructor(scene) {
        this.scene_ = scene;
        this.entities_ = [];
    }

    addEntity(entity) {
        this.entities_.push(entity);
        this.scene_.add(entity);
    }

    removeEntity(entity) {
        this.entities_.splice(this.entities_.indexOf(entity), 1);
        this.scene_.remove(entity);
    }

    update(deltaTime) {
        this.entities_.forEach(entity => {
            entity.update(deltaTime);
        });
    }

    getEntities() {
        return this.entities_;
    }

    getEntity(index) {
        return this.entities_[index];
    }

    getEntitiesByType(type) {
        return this.entities_.filter(entity => entity.type === type);
    }
}
