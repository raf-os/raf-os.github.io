import Building from "./Building";
import WorldEnvironment from "../singletons/WorldEnvironment";
import { type Scene, Vector3, TransformNode, Observable } from "@babylonjs/core";

const maxLanes = 6;
const spawnTime = 2000;
const spawnChance = 0.9;
const spawnOffset = 10;

// TODO: Single timer, connect all lanes to an observable

export default class BuildingSpawner extends TransformNode {
    lanes: Lane[] = [];
    spawnObservable: Observable<void>;
    spawnTimer: NodeJS.Timeout | undefined;

    constructor(scene: Scene) {
        super("buildingSpawner", scene);

        this.spawnObservable = new Observable();

        for (let i=0;i<maxLanes;i++) {
            const newLane = new Lane(this.getScene(), i, this.spawnObservable);
            this.addChild(newLane);
        }

        this.signalSpawn();
    }

    signalSpawn() {
        this.spawnObservable.notifyObservers();
        this.spawnTimer = setTimeout(() => {
            this.signalSpawn();
        }, spawnTime);
    }
}

export class Lane extends TransformNode {
    lPos: number;
    private _observable: Observable<void>;

    constructor(scene: Scene, lanePos: number, observable: Observable<void>) {
        super(`laneNode-${lanePos}`, scene);
        this.lPos = lanePos;
        const wb = WorldEnvironment.worldBoundaries;
        const _lPos = Math.round(lanePos * (wb.max.z - wb.min.z) / maxLanes);
        this.position = new Vector3(wb.max.x, 0, wb.min.z + _lPos);

        this._observable = observable;
        this._observable.add(() => this.spawnBuilding());
    }

    spawnBuilding() {
        if (this.getScene() && this.getScene().isReady()) {
            const willSpawn: boolean = Math.random() <= spawnChance;
            if (willSpawn) {
                const newPos = Vector3.Zero();
                newPos.copyFrom(this.position);
                newPos.x += (spawnOffset / 2) + (Math.random() * spawnOffset);
                const building = new Building(this.getScene(), newPos);
                this.addChild(building);
            }
        }
    }
}