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

// R G B  2  H S V
vec3 rgb2HSV(vec3 _col){
  vec3 hsv;
  float mini = 0.0;
  float maxi = 0.0;
  if (_col.r < _col.g) mini = _col.r;
    else mini = _col.g;
  if (_col.b < mini) mini = _col.b;
  if (_col.r > _col.g) maxi = _col.r;
    else maxi = _col.g;
  if (_col.b > maxi) maxi = _col.b;
  hsv.z = maxi; //VALUE
  float delta = maxi - mini; //delta
  if (maxi > 0.0) hsv.y = delta / maxi; //SATURATION
    else hsv.y = 0.0;
  if (_col.r >= maxi) hsv.x = (_col.g - _col.b) / delta;
  else if (_col.g >= maxi) hsv.x = 2.0 + (_col.b - _col.r)/delta;
  else hsv.x = 4.0 + (_col.r - _col.g) / delta;
  hsv.x *= 60.0;
  if (hsv.x < 0.0) hsv.x += 360.0;
  return hsv;
}

// H S V  2  R G B
vec3 hsv2RGB(vec3 _hsv){
  float hh, p, q, t, ff;
  int i;
  vec3 rgb;
  if(_hsv.y <= 0.0){
    rgb.r = _hsv.z;
    rgb.g = _hsv.z;
    rgb.b = _hsv.z;
    return rgb;
  }
  hh = _hsv.x;
  if(hh >= 360.) hh = (hh/360.);
  hh /= 60.0;
  i = int(hh);
  ff = hh - float(i);
  p = _hsv.z * (1.0 - _hsv.y);
  q = _hsv.z * (1.0 - (_hsv.y * ff));
  t = _hsv.z * (1.0 - (_hsv.y * (1.0 - ff)));

  if (i == 0){
      rgb.r = _hsv.z;
      rgb.g = t;
      rgb.b = p;
      return rgb;
    }
  else if (i == 1){
      rgb.r = q;
      rgb.g = _hsv.z;
      rgb.b = p;
      return rgb;
    }
  else if (i == 2){
      rgb.r = p;
      rgb.g = _hsv.z;
      rgb.b = t;
      return rgb;
    }
  else if (i == 3){
      rgb.r = p;
      rgb.g = q;
      rgb.b = _hsv.z;
      return rgb;
    }
  else if (i == 4){
      rgb.r = t;
      rgb.g = p;
      rgb.b = _hsv.z;
      return rgb;
    }
  else if (i == 5){
      rgb.r = _hsv.z;
      rgb.g = p;
      rgb.b = q;
      return rgb;
    }
  else {
      rgb.r = _hsv.z;
      rgb.g = p;
      rgb.b = q;
    return rgb;
  }

}

vec3 rgb2DEF(vec3 _col){
  mat3 XYZ; // Adobe RGB (1998)
  XYZ[0] = vec3(0.5767309, 0.1855540, 0.1881852);
  XYZ[1] = vec3(0.2973769, 0.6273491, 0.0752741);
  XYZ[2] = vec3(0.0270343, 0.0706872, 0.9911085); 
  mat3 DEF;
  DEF[0] = vec3(0.2053, 0.7125, 0.4670);
  DEF[1] = vec3(1.8537, -1.2797, -0.4429);
  DEF[2] = vec3(-0.3655, 1.0120, -0.6104);

  vec3 xyz = _col.rgb * XYZ;
  vec3 def = xyz * DEF;
  return def;
}

vec3 def2RGB(vec3 _def){
  mat3 XYZ; 
  XYZ[0] = vec3(0.6712, 0.4955, 0.1540);
  XYZ[1] = vec3(0.7061, 0.0248, 0.5223);
  XYZ[2] = vec3(0.7689, -0.2556, -0.8645); 
  mat3 RGB; // Adobe RGB (1998)
  RGB[0] = vec3(2.0413690, -0.5649464, -0.3446944);
  RGB[1] = vec3(-0.9692660, 1.8760108, 0.0415560);
  RGB[2] = vec3(0.0134474, -0.1183897, 1.0154096);

  vec3 xyz = _def * XYZ;
  vec3 rgb = xyz * RGB;
  return rgb;
}
float getB(vec3 _def){
    float b = sqrt((_def.r*_def.r) + (_def.g*_def.g) + (_def.b*_def.b));
    // b *= .72; //normalize...not sure why i have to do this
    return b;
}
float getC(vec3 _def){
    vec3 def_D = vec3(1.,0.,0.);
    float C = atan(length(cross(_def,def_D)), dot(_def,def_D));
    return C;
}
float getH(vec3 _def){
    vec3 def_E_axis = vec3(0.,1.,0.);
    float H = atan(_def.z, _def.y) - atan(def_E_axis.z, def_E_axis.y) ;
    return H;
}
vec3 rgb2BCH(vec3 _col){
  vec3 DEF = rgb2DEF(_col);
  float B = getB(DEF);
  float C = getC(DEF);
  float H = getH(DEF);
  return vec3(B,C,H);
}
vec3 bch2RGB(vec3 _bch){
  vec3 def;
  def.x = _bch.x * cos(_bch.y);
  def.y = _bch.x * sin(_bch.y) * cos(_bch.z);
  def.z = _bch.x * sin(_bch.y) * sin(_bch.z);
  vec3 rgb = def2RGB(def);
  return rgb;
}

// B R I G H T N E S S
vec3 brightness(vec3 _col, float _f){
  if (brightness_type==0){
    // float legacy_b = (brightness_val*2.) - 1.;
    // _f = (_f/10.);
    _col.rgb = (_col.rgb + (_col.rgb * _f));
    return _col;
  } else {

    vec3 hsv = rgb2HSV(_col);
    vec3 def = rgb2DEF(_col);
    float b = getB(def);
    vec3 b3 = vec3(b,b,b);
    float x = pow((_f + 1.)/2.,2.);
    x = _f;
    _col = _col + (b3 * x)/3.;
    // _col = b3;
    return _col;
  }
}

// C O N T R A S T  
vec3 contrast(vec3 _col, float _f){
  if (contrast_type==0){
    _col = (( _f * (_col - 0.5 )) + 0.5) ;
    return _col;

  } else {

    vec3 def = rgb2DEF(_col);
    float B = getB(def);
    float C = getC(def);
    float H = getH(def);
    
    // H += brightness_val * 3.1415*2.; //hue rotation


    B = B * pow(B*(1.-C), _f);
    // b = _avg * pow(b/_avg,_f);
    // B = B * pow(B/(C+H), _f);
    // B = ( (_f + C * 2.) * (B - 0.5 )) + 0.5;

    def.x = B * cos(C);
    def.y = B * sin(C) * cos(H);
    def.z = B * sin(C) * sin(H);


    _col.rgb = def2RGB(def);


    // _col.rgb=vec3(b_contrast,b_contrast,b_contrast);
    return _col;
  }
}

// S H A R P E N   
vec3 sharpen(vec3 _col, float _f, int _n, float _spread){
  vec3 HSV = rgb2HSV(_col);
  vec3 def = rgb2DEF(_col);
  float B = getB(def);
  float C = getC(def);
  float H = getH(def);
  float spread = float(_n) * _spread;
  // get B average
  // B = B * pow(B*(1.-C), -.1);

  float b_avg = 0.;
  int n = _n;
  if (n >= 16) n = 16;
  float n_f = float(n);
  for (int i = -_n; i < _n; i++){
    for (int j = -_n; j < _n; j++){
      // float offset_i = (float(i)/n_f)/100.;
      float offset_i = (float(i)/spread);
      float offset_j = (float(j)/spread);

      vec2 st_offset = vec2( vertTexCoord.s+offset_i, vertTexCoord.t+offset_j );
      vec4 col_offset = texture2D(texture, st_offset);
      vec3 def_offset = rgb2DEF(col_offset.rgb);
      b_avg += getB(def_offset);
    }
  }
  b_avg = b_avg/((n_f*2.)*(n_f*2.));

  // B = b_avg * pow(B/b_avg, (_f *2.)-1.);
  B = b_avg * pow(B/b_avg, (_f *2.));
  

  // B = B * pow(B*(1.-C), _f);

  def.x = B * cos(C);
  def.y = B * sin(C) * cos(H);
  def.z = B * sin(C) * sin(H);



  // vec3 rgb = rgb2DEF(def);
  _col.rgb = def2RGB(def);
  // _col.rgb = vec3(b_avg,b_avg,b_avg);
  // _col.rgb=vec3(b_contrast,b_contrast,b_contrast);
  return _col;
}



void main() {

  float fbm = 0.0;
  float tex_warp_mult = 0.0;
  // vec4 col = texture2D(texture, pattern(vertTexCoord.st, tex_warp_mult, fbm));
  vec4 col = texture2D(texture, vertTexCoord.st);
  // vec4 col = texture2D(texture, vec2(vertTexCoord.s+.1, sin(vertTexCoord.t)));


  // col.rgb = brightness(col.rgb, brightness_val);
  // col.rgb = contrast(col.rgb, contrast_val);

  // vec4 col = texture2D(texture, vertTexCoord.st);
  // col.rgb = pattern(vertTexCoord.st, col.rgb);

  // C O L O R 
  // vec3 cc = vec3(red,green,blue);
  // col.rgb = col.rgb + cc;

  // H S V   E D I T I N G
  // vec3 hsv = rgb2HSV(col.rgb);  // to HSV
  //   float hue_mod = exp_val * 180.0 / 2.;
  //   hue_mod = mod(hue_mod, 360.0);
  //   hsv.x += hue_mod;
  //   if (hsv.x >= 360.0) hsv.x -= 360.0;
  // col.rgb = hsv2RGB(hsv);  // to RGB
  

  ///////////////////////////////////////////////////////////////////////
  // sharpen & contrast demo
  ///////////////////////////////////////////////////////////////////////
  // col.rgb = contrast(col.rgb, contrast_val);
  // col.rgb = sharpen(col.rgb, contrast_val, 4, 300.);
  // col.rgb = sharpen(col.rgb, contrast_val, 4, 10.);


  vec3 BCH = rgb2BCH(col.rgb);
  // vec2 BCH_st = vec2( vertTexCoord.s+mod(BCH.x*.1,vertTexCoord.s*.5), 
  //                     vertTexCoord.t+mod(BCH.x*.1,vertTexCoord.s*.5));

  float darks = BCH.z * pow(BCH.z, .8);
  vec2 P = vec2(BCH.x, BCH.x);

  // col.rgb=vec3(BCH.x,BCH.x,BCH.x);
  // if (darks <= .15){
  // if (darks >= .15){
    // vec2 sort = vec2(vertTexCoord.s - pow((.3*(mod(BCH.x,.1))),.8), vertTexCoord.t);
    // vec2 sort = vec2(vertTexCoord.s - pow((.2*(mod(darks,mod(float(ttime),2.)))),2.), vertTexCoord.t);
    // vec4 slide = texture2D(texture, sort);
    // col.rgb = slide.rgb;
  // }

  // vec2 BCH_st = vec2(vertTexCoord.t, vertTexCoord.s);

  // vec4 warped = texture2D(texture, BCH_st);
  // col.rgb = warped.rgb;

  // G R I D
  // vec2 vt = vec2(vertTexCoord.s, vertTexCoord.t);
  // vt.x = mod(vt.x,.02)*(1./.02);
  // vt.y = mod(vt.y,.02)*(1./.02);
  // col.rg = vec2(vt.x, vt.y);



  ///////////////////////////////////////////////////////////////////////
  // H U E  D E M O 
  ///////////////////////////////////////////////////////////////////////
  // vec3 BCH = rgb2BCH(col.rgb);
  //   BCH.z += ttime*20.;
  //   vec3 bch_rgb = bch2RGB(BCH);
  // vec3 bch_rgb_h = vec3(bch_rgb.z,bch_rgb.z,bch_rgb.z);
  
  // vec3 HSV = rgb2HSV(col.rgb);
  //   float hue_mod = ttime * 8. * 180.0 / 2.;
  //   hue_mod = mod(hue_mod, 360.0);
  //   HSV.x += hue_mod;
  //   if (HSV.x >= 360.0) HSV.x -= 360.0;
  // vec3 hsv_rgb = hsv2RGB(HSV);  // to RGB
  // vec3 hsv_rgb_h = vec3(hsv_rgb.z,hsv_rgb.z,hsv_rgb.z);

  // col.rgb = bch_rgb;
  // // col.rgb = hsv_rgb;



  // col.r = vertTexCoord.s;
  // col.r = 0.;
  // col.g = 0.;
  // col.b = 0.;
  // if (vertTexCoord.s > 0.){
  //   for (int i = -4; i < 4; i++){
  //     for (int j = -4; j < 4; j++){
  //       col.r = vertTexCoord.s+((float(i)/4.)/100.);
  //       col.g = vertTexCoord.t+((float(j)/4.)/100.);
  //     }
  //   }
  // }
  // col.r = mod(vertTexCoord.s,.1)*10.;

  // if (vertTexCoord.s<=.0005){
  //   for (int i=0; i<100; i++){
  //     vec4 mash = texture2D(texture, vec2(vertTexCoord.s, vertTexCoord.t+(float(i)/100.)));

  //   }
  // }

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
