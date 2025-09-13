import { type Scene, Mesh, MeshBuilder, Vector3, Effect, ShaderMaterial } from "@babylonjs/core";

const sunVertexShader = `#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 worldViewProjection;

out vec2 vUV;

void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);

    vUV = uv;
}`;

const sunFragmentShader = `#version 300 es
precision highp float;

in vec2 vUV;

uniform float time;

out vec4 fragColor;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.02),
                         _radius+(_radius*0.02),
                         dot(dist,dist)*4.0);
}

void main(void) {
    vec4 circleShape = vec4(circle(vUV, 0.8));
    vec4 sunColor = vec4(1.0, 0.8, 0.4, 1.0);

    float bottomHalf = smoothstep(0.59, 0.6, vUV.y);
    float yRemap = clamp(vUV.y - .5, 0., .5) *2.;
    float freq = 1. * pow(40./1., 1.0 - yRemap);
    float wave = sin((vUV.y) * (freq * 2.) + time * 2.);
    float thickness = mix(.6, .05, yRemap);
    sunColor -= smoothstep(-thickness, +thickness, wave) * bottomHalf;
    fragColor = vec4(circleShape * sunColor) * 1.5;
}`;

export default class Sun {
    scene: Scene;
    mesh: Mesh;
    material: ShaderMaterial;

    constructor(scene: Scene) {
        this.scene = scene;

        this.mesh = MeshBuilder.CreateGround("sunPlane", {width: 24, height: 24}, scene);
        this.mesh.rotate(new Vector3(1, 0, 0), Math.PI / 2);
        this.mesh.position = new Vector3(32, 26, -32);

        Effect.ShadersStore['sunVertexShader'] = sunVertexShader;
        Effect.ShadersStore['sunFragmentShader'] = sunFragmentShader;

        this.material = new ShaderMaterial("sunShader", scene, {
            vertex: "sun",
            fragment: "sun"
        }, {
            attributes: ["position", "normal", "uv"],
            uniforms: ["worldView", "worldViewProjection", "view", "projection", "time"],
            needAlphaBlending: true,
        });

        this.mesh.material = this.material;

        let time = 0;
        scene.onBeforeRenderObservable.add(() => {
            const deltaTime = scene.getEngine().getDeltaTime();
            time += (deltaTime * 0.001);
            this.material.setFloat("time", time);
        });
    }
}