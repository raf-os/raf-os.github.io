import { Scene, type Mesh } from "@babylonjs/core";

import HighRise from "../meshes/HighRise";

let instance: _MeshLoader;

type TMeshes = {
    name: string,
    mesh: Mesh,
};

// mesh loader singleton
export class _MeshLoader {
    scene!: Scene;
    _HighRise!: Mesh;

    constructor() {
        if (instance) {
            throw new Error("Attempted to create multiple MeshLoader instances.");
        }
        instance = this;
    }

    getInstance() {
        return this;
    }

    setScene(scene: Scene) {
        this.scene = scene;
    }

    loadAssets() {
        this._HighRise = HighRise(this.scene as Scene);
        this._HighRise.isVisible = false;
    }

    private _clone(mesh: Mesh) {
        const newInstance = mesh.createInstance("meshClone");
        newInstance.isVisible = true;
        return newInstance;
    }

    request = {
        HighRise: () => { return this._clone(this._HighRise) },
    }
}

const MeshLoader = new _MeshLoader();
export default MeshLoader;