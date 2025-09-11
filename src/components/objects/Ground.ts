import { MeshBuilder, Mesh, Vector2, ShaderMaterial, Effect, Color3, type Scene } from "@babylonjs/core";

const vertexShaderSample = `#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform float time;

// Varying
out vec2 vUV;
out vec3 vPos;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main(void) {
    float tt = time * .1;
    vec3 mPos = position;
    vec2 vMov = position.xz + tt;
    
    vec2 base = floor(vMov);
    vec2 offs = fract(vMov);
    
    float fx1 = noise(vec2(base.x, 0.));
    float fx2 = noise(vec2(base.x, 0.) + vec2(1., 0.));
    float fx = mix(fx1, fx2, offs.x);
    
    float fy1 = noise(vec2(0., base.y));
    float fy2 = noise(vec2(0., base.y) + vec2(0., 1.));
    float fy = mix(fy1, fy2, offs.y);
    
    mPos.y = (fx + fy) * 5.;
    gl_Position = worldViewProjection * vec4(mPos, 1.0);

    vUV = uv;
    vPos = position;
}`;

const fragmentShaderSample = `#version 300 es

precision highp float;

in vec2 vUV;
in vec3 vPos;

out vec4 fragColor;

void main(void) {
    vec2 coord = vUV;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y) / 2.;
    float color = 1.0 - min(line, 1.0);
    color = pow(color, 1.0 / 2.2);
    vec4 col = vec4(vec3(color) * vec3(0.7, 0., 1.0), 1.);
    fragColor = mix(vec4(0.1, 0.1, 0.125, 1.), col, color);
}`;

export default class Ground {
    scene: Scene;
    mesh: Mesh;
    material: ShaderMaterial;
    dimensions: Vector2 = new Vector2(200, 100);

    constructor(scene: Scene) {
        this.scene = scene;

        this.mesh = MeshBuilder.CreateTiledGround(
            "ground",
            {
                xmin: -this.dimensions.x,
                zmin: -this.dimensions.y,
                xmax: this.dimensions.x,
                zmax: this.dimensions.y,
                subdivisions: {
                    w: this.dimensions.x / 10,
                    h: this.dimensions.y / 10,
                },
                updatable: true,
            },
            this.scene
        );
        Effect.ShadersStore['gridVertexShader'] = vertexShaderSample;
        Effect.ShadersStore['gridFragmentShader'] = fragmentShaderSample;
        this.material = new ShaderMaterial("gridShader", this.scene, {
            vertex: "grid",
            fragment: "grid",
        }, {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time"]
        });
        //this.material.diffuseColor = new Color3(1, 1, 1);
        //this.material.backFaceCulling = true;
        this.mesh.material = this.material;
    }
}