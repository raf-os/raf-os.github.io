import { Scene, LoadAssetContainerAsync, type Mesh, type AssetContainer } from "@babylonjs/core";
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";

let instance: _MeshLoader;

type TMeshes = {
    name: string,
    mesh: Mesh,
};

// mesh loader singleton
export class _MeshLoader {
    scene!: Scene;
    _TestBuilding!: AssetContainer;

    constructor() {
        if (instance) {
            throw new Error("Attempted to create multiple MeshLoader instances.");
        }
        instance = this;

        registerBuiltInLoaders();
    }

    getInstance() {
        return this;
    }

    setScene(scene: Scene) {
        this.scene = scene;
    }

    async loadToMemory(path: string) {
        const container = await LoadAssetContainerAsync(path, this.scene, { pluginExtension: ".glb" });
        const entries = container.instantiateModelsToScene(); // load them into memory
        entries.rootNodes.map(node => node.setEnabled(false)); // make them invisible
        return container;
    }

    async loadAssets(callback?: () => void) {
        this._TestBuilding = await this.loadToMemory("/assets/testBuilding.glb");

        this.onAssetsLoaded(callback);
    }

    onAssetsLoaded(callback?: () => void) {
        callback?.();
    }

    request = {
        TestBuilding: () => {
            const mesh = this._TestBuilding.instantiateModelsToScene().rootNodes[0];
            return mesh;
        }
    }
}

const MeshLoader = new _MeshLoader();
export default MeshLoader;