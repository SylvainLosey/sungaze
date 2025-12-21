/**
 * Fragment shader for realistic sun with fractal noise surface, glow, and Fresnel effects.
 * Based on fractal Brownian motion for gas-like surface animation.
 */

export const sunFragmentShader = /* glsl */ `
uniform float u_time;
uniform vec3 u_color;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vNormalModel;
varying vec3 vNormalView;
varying vec3 vPosition;

float random(in vec3 st) {
  return fract(sin(dot(st, vec3(12.9898, 78.233, 23.112))) * 12943.145);
}

float noise(in vec3 _pos) {
  vec3 i_pos = floor(_pos);
  vec3 f_pos = fract(_pos);

  float i_time = floor(u_time * 0.2);
  float f_time = fract(u_time * 0.2);

  float aa = random(i_pos + i_time);
  float ab = random(i_pos + i_time + vec3(1.0, 0.0, 0.0));
  float ac = random(i_pos + i_time + vec3(0.0, 1.0, 0.0));
  float ad = random(i_pos + i_time + vec3(1.0, 1.0, 0.0));
  float ae = random(i_pos + i_time + vec3(0.0, 0.0, 1.0));
  float af = random(i_pos + i_time + vec3(1.0, 0.0, 1.0));
  float ag = random(i_pos + i_time + vec3(0.0, 1.0, 1.0));
  float ah = random(i_pos + i_time + vec3(1.0, 1.0, 1.0));

  float ba = random(i_pos + (i_time + 1.0));
  float bb = random(i_pos + (i_time + 1.0) + vec3(1.0, 0.0, 0.0));
  float bc = random(i_pos + (i_time + 1.0) + vec3(0.0, 1.0, 0.0));
  float bd = random(i_pos + (i_time + 1.0) + vec3(1.0, 1.0, 0.0));
  float be = random(i_pos + (i_time + 1.0) + vec3(0.0, 0.0, 1.0));
  float bf = random(i_pos + (i_time + 1.0) + vec3(1.0, 0.0, 1.0));
  float bg = random(i_pos + (i_time + 1.0) + vec3(0.0, 1.0, 1.0));
  float bh = random(i_pos + (i_time + 1.0) + vec3(1.0, 1.0, 1.0));

  vec3 t = smoothstep(0.0, 1.0, f_pos);
  float t_time = smoothstep(0.0, 1.0, f_time);

  return mix(
    mix(
      mix(mix(aa, ab, t.x), mix(ac, ad, t.x), t.y),
      mix(mix(ae, af, t.x), mix(ag, ah, t.x), t.y),
      t.z
    ),
    mix(
      mix(mix(ba, bb, t.x), mix(bc, bd, t.x), t.y),
      mix(mix(be, bf, t.x), mix(bg, bh, t.x), t.y),
      t.z
    ),
    t_time
  );
}

#define NUM_OCTAVES 6
float fBm(in vec3 _pos, in float sz) {
  float v = 0.0;
  float a = 0.2;
  _pos *= sz;

  vec3 angle = vec3(-0.001 * u_time, 0.0001 * u_time, 0.0004 * u_time);
  mat3 rotx = mat3(1.0, 0.0, 0.0,
                   0.0, cos(angle.x), -sin(angle.x),
                   0.0, sin(angle.x), cos(angle.x));
  mat3 roty = mat3(cos(angle.y), 0.0, sin(angle.y),
                   0.0, 1.0, 0.0,
                   -sin(angle.y), 0.0, cos(angle.y));
  mat3 rotz = mat3(cos(angle.z), -sin(angle.z), 0.0,
                   sin(angle.z), cos(angle.z), 0.0,
                   0.0, 0.0, 1.0);

  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(_pos);
    _pos = rotx * roty * rotz * _pos * 2.0;
    a *= 0.8;
  }
  return v;
}

void main() {
  vec3 st = vNormalModel;

  vec3 q = vec3(0.0);
  q.x = fBm(st, 5.0);
  q.y = fBm(st + vec3(1.2, 3.2, 1.52), 5.0);
  q.z = fBm(st + vec3(0.02, 0.12, 0.152), 5.0);

  float n = fBm(st + q + vec3(1.82, 1.32, 1.09), 5.0);

  vec3 color = vec3(0.0);
  color = mix(vec3(1.0, 0.4, 0.0), vec3(1.0, 1.0, 1.0), n * n);
  color = mix(color, vec3(1.0, 0.0, 0.0), q * 0.7);
  color *= u_color;
  color *= 1.6;

  float raw_intensity = max(dot(vPosition, vNormalView), 0.0);
  float glow_intensity = pow(raw_intensity, 4.0);
  color += u_color * glow_intensity * 0.5;

  float fresnel_inner = 0.2 - 0.7 * min(dot(vPosition, vNormalView), 0.0);
  fresnel_inner = pow(fresnel_inner, 5.0);

  float fresnel_outer = 1.0 + dot(normalize(vPosition), normalize(vNormalView));
  fresnel_outer = pow(fresnel_outer, 2.0);

  float fresnel = fresnel_inner + fresnel_outer;
  color += u_color * fresnel * 0.3;

  gl_FragColor = vec4(color, 1.0);
}
`;
