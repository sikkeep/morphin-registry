export const textVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// One glyph per quad. The quad is the mask; the glyph slides up through it.
//
// At uReveal 0 the sample sits a full cell below the mask and every fragment
// is discarded, so the character is genuinely absent rather than transparent.
// At 1 it lines up exactly with the quad.
export const textFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform sampler2D uTex;
  uniform float uReveal;
  uniform vec3  uColor;
  uniform float uOpacity;

  void main() {
    float gy = vUv.y + 1.0 - uReveal;
    if (gy > 1.0 || gy < 0.0) discard;

    float a = texture2D(uTex, vec2(vUv.x, gy)).a;
    if (a <= 0.001) discard;

    gl_FragColor = vec4(uColor, a * uOpacity);
  }
`;
