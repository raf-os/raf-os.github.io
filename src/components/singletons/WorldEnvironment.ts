import { Scene, HemisphericLight, Vector3 } from "@babylonjs/core";

let instance: _WorldEnvironment;

type TWorldBoundaries = {
    min: Vector3,
    max: Vector3,
}

class _WorldEnvironment {
    scene!: Scene;
    sunLight!: HemisphericLight;
    worldBoundaries: TWorldBoundaries = {
        min: new Vector3(-100, 0, -100),
        max: new Vector3(100, 100, 100)
    };

    constructor() {
        if (instance) {
            throw new Error("Attempted to create multiple WorldEnvironment instances.");
        }
        instance = this;
    }

    getInstance() { return this; }

    setup(scene: Scene) {
        this.scene = scene;
        this.sunLight = new HemisphericLight("sun", new Vector3(1, 1, 0), this.scene);
    }
}

const WorldEnvironment = new _WorldEnvironment();
export default WorldEnvironment;