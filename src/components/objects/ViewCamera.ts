import { ArcRotateCamera, Animation, CubicEase, EasingFunction, Vector3, setAndStartTimer, type Scene } from "@babylonjs/core";

export default class ViewCamera {
    scene: Scene;
    cameraObj: ArcRotateCamera;

    cameraInitialHeight: number = 80;
    cameraFinalHeight: number = 5;
    animDuration: number = 2;
    framerate: number = 30;

    lowerCameraAnim!: Animation;

    constructor(scene: Scene) {
        this.scene = scene;

        this.cameraObj = new ArcRotateCamera("MainCamera", Math.PI * 1.5, Math.PI / 2, 50, new Vector3(0, this.cameraInitialHeight, 0), this.scene);
        // DEBUG ONLY:
        // this.cameraObj.attachControl(this.scene.getEngine().getRenderingCanvas(), true);

        this._setupAnims();
    }

    private _setupAnims() {
        const framerate: number = 30;
        this.lowerCameraAnim = new Animation("lowerCameraAnim", "target.y", framerate, Animation.ANIMATIONTYPE_FLOAT);

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