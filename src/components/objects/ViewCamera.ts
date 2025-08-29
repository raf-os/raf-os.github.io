import { ArcRotateCamera, Animation, CubicEase, EasingFunction, Vector3, type Scene } from "@babylonjs/core";

export default class ViewCamera {
    scene: Scene;
    cameraObj: ArcRotateCamera;

    cameraInitialHeight: number = 80;
    cameraFinalHeight: number = 10;
    animDuration: number = 8;
    framerate: number = 30;

    lowerCameraAnim!: Animation;

    constructor(scene: Scene) {
        this.scene = scene;

        this.cameraObj = new ArcRotateCamera("MainCamera", Math.PI / 2, Math.PI / 2.1, 100, new Vector3(0, this.cameraInitialHeight, 0), this.scene);

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
        setTimeout(() => {
            this.scene.beginAnimation(this.cameraObj, 0, this.animDuration * this.framerate, false);
        }, 2000);
    }
}