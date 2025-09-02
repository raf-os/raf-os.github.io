import { Scene, LoadAssetContainerAsync, Color3, type Mesh, type AssetContainer, PBRMaterial } from "@babylonjs/core";
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";

let instance: _MeshLoader;

type TMeshes = {
    name: string,
    mesh: Mesh,
};

// mesh loader singleton
export class _MeshLoader {
    scene!: Scene;
    _HighRise!: AssetContainer;
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

    async loadAssets(callback?: () => void) {
        this._HighRise = await LoadAssetContainerAsync("/assets/HighRise.glb", this.scene);
        this._TestBuilding = await LoadAssetContainerAsync("/assets/testBuilding.glb", this.scene);

        this.onAssetsLoaded(callback);
    }

    onAssetsLoaded(callback?: () => void) {
        callback?.();
    }

    request = {
        HighRise: () => {
            const instance = this._HighRise.instantiateModelsToScene().rootNodes[0];
            return instance;
        },

        TestBuilding: () => {
            return this._TestBuilding.instantiateModelsToScene().rootNodes[0];
        }
    }
}

const MeshLoader = new _MeshLoader();
export default MeshLoader;