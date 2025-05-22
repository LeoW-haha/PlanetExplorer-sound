#include "lygia/generative/fbm.glsl"

uniform float u_Time;
uniform vec3 u_color1;
uniform vec3 u_color2;

void main()
{
    gl_FragColor = vec4(vec3(u_color1), 1.0f);
}
