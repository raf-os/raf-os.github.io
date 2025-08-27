import { type Scene, MeshBuilder, Mesh } from "@babylonjs/core";
import { IMeshObject } from "./IMeshObject";

const HighRise: IMeshObject = (scene: Scene) => {
    const base = MeshBuilder.CreateBox("buildingBase", { width: 8, depth: 8, height: 20 }, scene);
    base.position.y = 10;

    const middle = MeshBuilder.CreateBox("buildingMiddle", { width: 6, depth: 6, height: 30 }, scene);
    middle.position.y = 35;

    const mesh = Mesh.MergeMeshes([base, middle], true) as Mesh;

    return mesh;
}

export default HighRise;