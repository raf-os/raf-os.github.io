import { MeshBuilder, GroundMesh, Vector2, StandardMaterial, Color3, type Scene } from "@babylonjs/core";

export default class Ground {
    scene: Scene;
    mesh: GroundMesh;
    material: StandardMaterial;
    dimensions: Vector2 = new Vector2(500, 200);

    constructor(scene: Scene) {
        this.scene = scene;

        this.mesh = MeshBuilder.CreateGround("ground", { width: this.dimensions.x, height: this.dimensions.y }, this.scene);
        this.material = new StandardMaterial("groundMaterial", this.scene);
        this.material.diffuseColor = new Color3(0, 0, 0);
        this.mesh.material = this.material;
    }
}