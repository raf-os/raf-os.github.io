import Building from "./Building";
import WorldEnvironment from "../singletons/WorldEnvironment";
import { type Scene, Vector3, TransformNode } from "@babylonjs/core";

const maxLanes = 6;
const spawnTime = 2000;
const spawnChance = 0.9;
const spawnOffset = 10;

export default class BuildingSpawner extends TransformNode {
    lanes: Lane[] = [];

    constructor(scene: Scene) {
        super("buildingSpawner", scene);

        for (let i=0;i<maxLanes;i++) {
            const newLane = new Lane(this.getScene(), i);
            this.addChild(newLane);
        }
    }
}

export class Lane extends TransformNode {
    lPos: number;

    constructor(scene: Scene, lanePos: number) {
        super(`laneNode-${lanePos}`, scene);
        this.lPos = lanePos;
        const wb = WorldEnvironment.worldBoundaries;
        const _lPos = Math.round(lanePos * (wb.max.z - wb.min.z) / maxLanes);
        this.position = new Vector3(wb.max.x, 0, wb.min.z + _lPos);

        this.beginTimer();
    }

    beginTimer() {
        setTimeout(
            () => { this.spawnBuilding() },
            spawnTime
        );
    };

    spawnBuilding() {
        if (this.getScene()) {
            const willSpawn: boolean = Math.random() <= spawnChance;
            if (willSpawn) {
                const newPos = Vector3.Zero();
                newPos.copyFrom(this.position);
                newPos.x += (spawnOffset / 2) + (Math.random() * spawnOffset);
                const building = new Building(this.getScene(), newPos);
                this.addChild(building);
            }
        }
        this.beginTimer();
    }
}