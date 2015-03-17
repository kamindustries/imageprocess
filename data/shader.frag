#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

#define PROCESSING_TEXTURE_SHADER

uniform sampler2D texture;
uniform float ttime;

uniform int brightness_type;
uniform int contrast_type;
uniform int threshold_tog;

uniform float brightness_val;
uniform float contrast_val;
uniform float threshold;
uniform float exp_val;

uniform float red;
uniform float green;
uniform float blue;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec4 lumcoeff = vec4(0.299, 0.587, 0.114, 0);

// Patterns
const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float noise( in vec2 x ) {
  return sin(2.5*x.x)*sin(1.5*x.y);
  // return sin((1.5*(s+x.x)))*sin(1.5*(s+x.y));
  // return sin((s*(1.5*x.x)))*sin(s*(1.5*x.y));
  // return sin((1.5*(s+x.x)))*sin(1.5*(s+x.y));
  // return sin((s+(99999999.0*x.x)))*sin(s+(1.0*x.y));
}

float fbm2( vec2 p ) {    
    float f = 0.0;
    f += 0.3333*noise( p ); p = m*p*2.01;
    f += 0.6667*noise( p ); p = m*p*2.03;
    return f/.90;
}
float fbm4( vec2 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}
float fbm6( vec2 p ) {
    float f = 0.0;
    f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
    f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
    f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
    f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.015625*(0.5+0.5*noise( p ));
    return f/0.96875;
}
float func( vec2 q, out vec4 ron )
{
  // animation speed
  float s = ttime * 0.2;

  float ql = length( q );
  q.x += 0.05*sin(0.27+ql*4.1);
  q.y += 0.05*sin(0.23+ql*4.3);
  q *= 0.5;

  vec2 o = vec2(0.0);
    o.x = 0.5 + 0.5*fbm4( vec2(2.0*q          )  );
    o.y = 0.5 + 0.5*fbm4( vec2(2.0*q+vec2(5.2))  );

  float ol = length( o );
    o.x += s + 0.02*sin(0.12+ol)/ol;
    o.y += s + 0.02*sin(0.14+ol)/ol;

    vec2 n;
    n.x = fbm4( vec2(4.0*o+vec2(9.2))  );
    n.y = fbm4( vec2(4.0*o+vec2(5.7))  );

    vec2 p = 4.0*q + 4.0*n;

    float f = 0.5 + 0.5*fbm4( p );

    f = mix( f, f*f*f*3.5, f*abs(n.x) );

    float g = 0.5 + 0.5*sin(4.0*p.x)*sin(4.0*p.y);
    f *= 1.0-0.5*pow( g, 8.0 );

    ron = vec4( o, n );
  
    return f;
}
vec2 pattern(vec2 p, float _mult, out float f) {
  vec2 q = p;
  vec4 on = vec4(0.0);
  f = func(q, on);

  // scale original mix with noise
  f = f * _mult;
  return vec2(q.x+f, q.y+f);
}
// vec3 grade(vec3 col, float f) { 
//   // col = mix( vec3(0.2,0.1,0.4), vec3(0.3,0.05,0.05), f );
//   // col = mix( col, vec3(0.9,0.9,0.9), dot(on.zw,on.zw) );
//   // col = mix( col, vec3(0.4,0.3,0.3), 0.5*on.y*on.y );
//   // col = mix( col, vec3(0.0,0.2,0.4), 0.5*smoothstep(1.2,1.3,abs(on.z)+abs(on.w)) );
//   // col = clamp( col*f*2.0, 0.0, 1.0 );
  
//   // vec3 nor = normalize( vec3( dFdx(f)*640.0, 6.0, dFdy(f)*480.0 ) );
//   vec3 nor = vec3(1.0,1.0,1.0);
//   vec3 lig = normalize( vec3( .9, 0.2, 0.4 ) );
//   // float dif = clamp( 0.3+0.7*dot( nor, lig ), 0.0, 1.0 );
//   // float dif = clamp( 0.3+0.7*1.0, 0.0, 1.0 );
//   float dif = 1.0;
//   vec3 bdrf;
//   bdrf  = vec3(1.0,1.0,1.0)*(nor.y*0.5+0.5);
//   bdrf += vec3(red, green, blue)*dif;
//   col *= bdrf;
//   float power = 1.0;
//   col *= vec3(pow(col.r,power),pow(col.g,power),pow(col.b,power));
//   // col = 1.0-col;
//   return col;
// }
vec3 exposure(vec3 _col, float _f){
  float f = 1./_f;
  vec3 f_power = vec3(pow(_col.r, f),pow(_col.g, f),pow(_col.b, f));
  // vec3 f_power = vec3(log(_col.r*f),log(_col.g*f),log(_col.b*f));
  return f_power;
}

// B R I G H T N E S S
vec3 brightness(vec3 _col, float _f){
  if (brightness_type==0){
    // float legacy_b = (brightness_val*2.) - 1.;
    // _f = (_f/10.);
    _col.rgb = (_col.rgb + (_col.rgb * _f));
    return _col;
  } else {
    mat3 XYZ;
    XYZ[0] = vec3(0.412453, 0.357580, 0.180423);
    XYZ[1] = vec3(0.212671, 0.715160, 0.072169);
    XYZ[2] = vec3(0.019334, 0.119193, 0.950227);
    mat3 DEF;
    DEF[0] = vec3(0.2053, 0.7125, 0.4670);
    DEF[1] = vec3(1.8537, -1.2797, -0.4429);
    DEF[2] = vec3(-0.3655, 1.0120, -0.6104);

    vec3 xyz = _col.rgb * XYZ;
    vec3 def = xyz * DEF;
    float b = sqrt((def.r*def.r) + (def.g*def.g) + (def.b*def.b));

    vec3 b3 = vec3(b,b,b);
    float l1 = length(b3);
    float l2 = length(_col.rgb);
    // _col.rgb = b * _col.rgb;
    // _col = _col + (b3 * _f)/(max(l1,l2)/2.);
    _col = _col + (b3 * _f)/l1;
    return _col;
  }

}

// C O N T R A S T  
// vec3 contrast(vec3 _col, float _f){
//   if (contrast_type==0){
//     // col = (((col - 0.5 ) * contrast) + 0.5) ;
//     float legacy_b = (contrast_val*2.) - 1.;
//     col.rgb = (col.rgb + (col.rgb*legacy_b));
//     gl_FragColor = col;
//   } else {
//     mat3 XYZ;
//     XYZ[0] = vec3(0.412453, 0.357580, 0.180423);
//     XYZ[1] = vec3(0.212671, 0.715160, 0.072169);
//     XYZ[2] = vec3(0.019334, 0.119193, 0.950227);
//     mat3 DEF;
//     DEF[0] = vec3(0.2053, 0.7125, 0.4670);
//     DEF[1] = vec3(1.8537, -1.2797, -0.4429);
//     DEF[2] = vec3(-0.3655, 1.0120, -0.6104);

//     vec3 xyz = col.rgb * XYZ;
//     vec3 def = xyz * DEF;
//     float b = sqrt((def.r*def.r) + (def.g*def.g) + (def.b*def.b));
//     float c = contrast_val;
//     // b = pow(b, c);
//     // b = b * c;

//     vec3 b3 = vec3(b,b,b);
//     float l1 = length(b3);
//     float l2 = length(col.rgb);
//     // col.rgb = b * col.rgb;
//     col.rgb = col.rgb + (b3 * c)/(max(l1,l2)/2.);
//   }
// }


void main() {
  // vec4 p = gl_FragCoord.st;
  // vec4 col = texture2D(texture, vertTexCoord.st);
  float fbm = 0.0;
  float tex_warp_mult = 0.0;
  // vec4 col = texture2D(texture, pattern(vertTexCoord.st, tex_warp_mult, fbm));
  vec4 col = texture2D(texture, vertTexCoord.st);
  col.rgb = brightness(col.rgb, brightness_val);
  col.rgb = exposure(col.rgb, exp_val);

  // vec4 col = texture2D(texture, vertTexCoord.st);
  // col.rgb = pattern(vertTexCoord.st, col.rgb);

  // C O L O R 
  vec3 cc = vec3(red,green,blue);
  col.rgb = col.rgb + cc;
  
  gl_FragColor = col;
  

  // T H R E S H O L D
  if (threshold_tog==1) {
    float lum = dot(col, lumcoeff);
    if (threshold < lum) {
      gl_FragColor = vertColor;
    } else {
      gl_FragColor = vec4(0, 0, 0, 1);
    }     
  }

}
