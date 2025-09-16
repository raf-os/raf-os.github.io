import { UniversalCamera, Animation, CubicEase, EasingFunction, Vector3, setAndStartTimer, type Scene } from "@babylonjs/core";

export default class ViewCamera {
    scene: Scene;
    cameraObj: UniversalCamera;

    cameraInitialHeight: number = 2;
    cameraFinalHeight: number = 2;
    animDuration: number = 2;
    framerate: number = 30;

    lowerCameraAnim!: Animation;

    constructor(scene: Scene) {
        this.scene = scene;

        this.cameraObj = new UniversalCamera("MainCamera", new Vector3(0, this.cameraInitialHeight, 32), this.scene);
        this.cameraObj.setTarget(new Vector3(0, this.cameraInitialHeight, 0));
        this.cameraObj.fov = (75 / 180) * Math.PI;
        // DEBUG ONLY:
        // this.cameraObj.attachControl(this.scene.getEngine().getRenderingCanvas(), true);

        //this._setupAnims();
    }

    private _setupAnims() {
        const framerate: number = 30;
        this.lowerCameraAnim = new Animation("lowerCameraAnim", "position.y", framerate, Animation.ANIMATIONTYPE_FLOAT);

        const keyFrames = [{
            frame: 0,
            value: this.cameraInitialHeight
        }, {
            frame: this.animDuration * framerate,
            value: this.cameraFinalHeight
        }];

        this.lowerCameraAnim.setKeys(keyFrames);

        const easingFn = new CubicEase();
        easingFn.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
        this.lowerCameraAnim.setEasingFunction(easingFn);

        this.cameraObj.animations.push(this.lowerCameraAnim);
    }

    descentAnim() {
        return;
        setAndStartTimer({
            timeout: 2000,
            contextObservable: this.scene.onBeforeRenderObservable,
            breakCondition: () => {
                return this.scene.isDisposed;
            },
            onEnded: () => {
                this.scene.beginAnimation(this.cameraObj, 0, this.animDuration * this.framerate, false);
            }
        });
    }
}