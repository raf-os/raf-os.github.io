import { MeshBuilder, Mesh, Vector2, ShaderMaterial, Effect, Color3, type Scene, Vector3, Animation } from "@babylonjs/core";

const vertexShaderSample = `#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform mat4 world;
uniform float time;
uniform float scale;

// Varying
out vec2 vUV;
out vec3 vPos;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

#define OCTAVES 3
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;

    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * snoise(st);
        st *= 3.;
        amplitude *= amplitude;
    }
    return value;
}

void main(void) {
    float tt = time;
    vec4 mPos = world * vec4(position - vec3(time * scale, 0., 0.), 1.);
    vec2 vMov = (mPos.xz);
    
    mPos.y = fbm(vMov * .1);
    gl_Position = worldViewProjection * vec4(position + vec3(0., mPos.y, 0.), 1.0);

    vUV = uv;
    vPos = position;
}`;

const fragmentShaderSample = `#version 300 es

precision highp float;

in vec2 vUV;
in vec3 vPos;

uniform float time;

out vec4 fragColor;

void main(void) {
    vec2 coord = vUV * 0.2;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y) / 2.;
    float color = 1.0 - min(line, 1.0);
    vec4 col = vec4(vec3(color) * vec3(0.7, 0., 1.0), 1.);
    fragColor = mix(vec4(0.1, 0.1, 0.125, 1.), col, color);
}`;

export default class Ground {
    scene: Scene;
    mesh: Mesh;
    material: ShaderMaterial;
    dimensions = new Vector2(64, 64);
    subdivisions = 64;

    constructor(scene: Scene) {
        this.scene = scene;

        this.mesh = MeshBuilder.CreateTiledGround(
            "ground",
            {
                xmin: -this.dimensions.x / 2,
                zmin: -this.dimensions.y / 2,
                xmax: this.dimensions.x / 2,
                zmax: this.dimensions.y / 2,
                subdivisions: {
                    w: this.subdivisions,
                    h: this.subdivisions,
                },
                updatable: true,
            },
            this.scene
        );
        // TODO: Make movement animation with node geometry, maybe?
        //this.mesh = MeshBuilder.CreateGround("ground", { width: 16, height: 16, subdivisions: 128}, this.scene);
        this.mesh.freezeNormals();
        Effect.ShadersStore['gridVertexShader'] = vertexShaderSample;
        Effect.ShadersStore['gridFragmentShader'] = fragmentShaderSample;
        this.material = new ShaderMaterial("gridShader", this.scene, {
            vertex: "grid",
            fragment: "grid",
        }, {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time", "scale"]
        });
        this.material.setFloat("time", 0);
        this.material.setFloat("scale", this.dimensions.x / (this.subdivisions / 2));
        let time = 0;
        this.scene.onBeforeRenderObservable.add(() => {
            const deltaTime = this.scene.getEngine().getDeltaTime();
            time += (deltaTime * 0.001);
            this.material.setFloat("time", time);
        });
        //this.material.diffuseColor = new Color3(1, 1, 1);
        this.mesh.material = this.material;

        const framerate = 10;
        const slideAnim = new Animation("slideAnim", "position.x", framerate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        const keyframes = [{
            frame: 0,
            value: -this.dimensions.x / (this.subdivisions),
        }, {
            frame: 10,
            value: this.dimensions.x / (this.subdivisions),
        }];
        slideAnim.setKeys(keyframes);
        this.mesh.animations.push(slideAnim);

        this.scene.onReadyObservable.addOnce(() => this.scene.beginAnimation(this.mesh, 0, 1 * framerate, true, 1));
    }
}