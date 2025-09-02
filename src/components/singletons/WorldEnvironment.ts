import { Scene, HemisphericLight, Vector3, Color3 } from "@babylonjs/core";

let instance: _WorldEnvironment;

type TWorldBoundaries = {
    min: Vector3,
    max: Vector3,
}

class _WorldEnvironment {
    scene!: Scene;
    sunLight!: HemisphericLight;
    moveSpeed: number = 10 / 1000;
    worldBoundaries: TWorldBoundaries = {
        min: new Vector3(-100, 0, -30),
        max: new Vector3(100, 100, 30)
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
        this.sunLight.groundColor = new Color3(1, 0, 0);
    }
}

const WorldEnvironment = new _WorldEnvironment();
export default WorldEnvironment;