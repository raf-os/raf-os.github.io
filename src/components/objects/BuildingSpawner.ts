import Building from "./Building";
import WorldEnvironment from "../singletons/WorldEnvironment";
import { type Scene, Vector3, TransformNode, Observable, setAndStartTimer } from "@babylonjs/core";

const maxLanes = 6;
const spawnTime = 1500;
const spawnChance = 0.9;
const spawnOffset = 10;

// TODO: Single timer, connect all lanes to an observable

export default class BuildingSpawner extends TransformNode {
    lanes: Lane[] = [];
    spawnObservable: Observable<void>;
    spawnTimer: ReturnType<typeof setAndStartTimer> = null;

    constructor(scene: Scene) {
        super("buildingSpawner", scene);

        this.spawnObservable = new Observable();

        for (let i=0;i<maxLanes;i++) {
            const newLane = new Lane(this.getScene(), i, this.spawnObservable);
            this.addChild(newLane);
        }

        // TODO: Generate initial random building grid

        this.signalSpawn();
    }

    signalSpawn() {
        this.spawnObservable.notifyObservers();
        setAndStartTimer({
            timeout: spawnTime,
            contextObservable: this.getScene().onBeforeRenderObservable,
            onEnded: () => {
                this.signalSpawn();
            }
        });
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
        this.position = new Vector3(
            wb.max.x + Math.sin(lanePos) * (Math.PI / 4) * 10,
            0,
            wb.min.z + _lPos
        );

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