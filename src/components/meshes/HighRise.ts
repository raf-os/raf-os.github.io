import { type Scene, LoadAssetContainerAsync } from "@babylonjs/core";

const HighRise = async (scene: Scene) => {
    const container = await LoadAssetContainerAsync("/assets/HighRise.glb", scene);
    return container;
}

export default HighRise;