import { type Scene, TransformNode, InstancedMesh, Vector3, Observer } from "@babylonjs/core";
import MeshLoader from "../singletons/MeshLoader";
import WorldEnvironment from "../singletons/WorldEnvironment";
import { v4 as uuid } from "uuid";

export default class Building extends TransformNode {
    observer: Observer<Scene>;
    mesh!: InstancedMesh;

    constructor(scene: Scene, initialPos: Vector3) {
        super(`BUILDING-${uuid()}`, scene);
        this.gotoInitialPosition(initialPos);

        this.setMesh(MeshLoader.request.HighRise());

        this.observer = scene.onBeforeRenderObservable.add(() => this.updatePosition());
    }

    gotoInitialPosition(initialPos: Vector3) {
        this.position = initialPos;
    }

    setMesh(mesh: Building['mesh']) {
        this.mesh = mesh;
        mesh.parent = this;
    }

    updatePosition() {
        const deltaTime = this.getScene().deltaTime;
        const newPos = this.position.x - WorldEnvironment.moveSpeed * deltaTime;
        this.position.x = newPos;

        if (this.getAbsolutePosition().x < WorldEnvironment.worldBoundaries.min.x) {
            this.kill();
        }
    }

    kill() {
        this.getScene().onBeforeRenderObservable.remove(this.observer);
        this.mesh.dispose();
        this.dispose();
    }
}