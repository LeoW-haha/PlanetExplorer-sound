#include "lygia/generative/fbm.glsl"

varying vec3 v_vertexPos;
varying vec3 v_vertexNormal;
varying vec4 v_tangent;

uniform float u_Time;
uniform float u_zoom;
uniform vec3 u_color1;
uniform float u_radius;

void main()
{
    float pat = snoise(v_vertexPos * (u_zoom / u_radius) * u_Time) - u_radius;
    vec3 newPos = v_vertexPos + v_vertexNormal * pat; 

    gl_FragColor = vec4(vec3(u_color1) + vec3(newPos.x), 1.0f);
}
