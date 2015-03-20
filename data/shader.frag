#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

#define PROCESSING_TEXTURE_SHADER

// internal variables
uniform sampler2D texture;
varying vec4 vertColor;
varying vec4 vertTexCoord;

// my variables
uniform float ui_red;
uniform float ui_green;
uniform float ui_blue;
uniform float ui_brightness;
uniform float ui_contrast;
uniform float ui_hue;
uniform float ui_saturation;
uniform float ui_sharpen;
uniform float ui_niceContrast;
uniform float ui_sortBlackVal;
uniform float ui_sortBrightVal;
uniform float ui_sortWhiteVal;
uniform float ui_party;

uniform int cc_mode;
uniform int brightness_mode;
uniform int contrast_mode;
uniform int hue_mode;
uniform int saturation_mode;
uniform int sharpening_mode;
uniform int niceContrast_mode;
uniform int party_mode;

uniform float ttime;

const vec4 lumcoeff = vec4(0.299, 0.587, 0.114, 0);

///////////////////////////////////////////////////////////////////////
// F U N C T I O N S
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// C O L O R   F U N C T I O N S
///////////////////////////////////////////////////////////////////////

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
vec3 bch2RGB_altAxis(vec3 _bch){
  vec3 def;
  def.x = _bch.x * cos(_bch.y);
  def.y = _bch.x * sin(_bch.y) * cos(_bch.z);
  def.z = _bch.x * sin(_bch.y) * sin(_bch.z+(ttime*3.14159));
  vec3 rgb = def2RGB(def);
  return rgb;
}

vec3 colorCorrect(vec3 _col, float _red, float _green, float _blue){
  vec3 cc = vec3(_red,_green,_blue);
  if (cc_mode == 0){
    cc += _col;
    return cc;
  } 
  else {
    vec3 BCH = rgb2BCH(_col);
    vec3 cc;
    float bch_val = BCH.x;
    float bch_sat = BCH.y;
    // grab a section of the hue and multiply it by the sliders
    float bch_red = (cos(BCH.z) * (_red + 1.));
    float bch_green = (cos(BCH.z+4.188790) * (_green + 1.));;
    float bch_blue = (cos(BCH.z+2.094395) * (_blue + 1.));

    // add the hue-restricted mods to the saturation 
    bch_sat = BCH.y+bch_red+bch_green+bch_blue;

    // add all the slider values divided by 3^2 to the brightness
    bch_val += (_red + _green + _blue)/9.;

    // bring together and go back to RGB
    cc = vec3(bch_val, bch_sat, BCH.z);
    cc = bch2RGB(cc);

    return cc;
  }
}

// B R I G H T N E S S
vec3 Brightness(vec3 _col, float _f){
  if (brightness_mode==0){
    _col.rgb = (_col.rgb + (_col.rgb * _f));
    return _col;

  } else {
    vec3 BCH = rgb2BCH(_col);
    vec3 b3 = vec3(BCH.x,BCH.x,BCH.x);
    float x = pow((_f + 1.)/2.,2.);
    x = _f;
    _col = _col + (b3 * x)/3.;
    return _col;
  }
}

// C O N T R A S T  
vec3 Contrast(vec3 _col, float _f){
  if (contrast_mode==0){
    _col = (( _f * (_col - 0.5 )) + 0.5) ;
    return _col;

  } else {
    vec3 def = rgb2DEF(_col);
    float B = getB(def);
    float C = getC(def);
    float H = getH(def);
    
    B = B * pow(B*(1.-C), _f);

    def.x = B * cos(C);
    def.y = B * sin(C) * cos(H);
    def.z = B * sin(C) * sin(H);

    _col.rgb = def2RGB(def);
    return _col;
  }
}

vec3 Hue(vec3 _col, float _f){
  if (hue_mode==0){
    vec3 hsv = rgb2HSV(_col);  // to HSV
    float hue_mod = _f * 360.0;
    hue_mod = mod(hue_mod, 360.0); // go back to 0 if over 360 deg
    hsv.x += hue_mod;
    if (hsv.x >= 360.0) hsv.x -= 360.0;
    hsv = hsv2RGB(hsv);  // to RGB

    return hsv;
  }
  else {
    vec3 BCH = rgb2BCH(_col);
    BCH.z += _f * 3.1459 * 2.;
    BCH = bch2RGB(BCH);
    return BCH;
  }
}

vec3 Saturation(vec3 _col, float _f){
  if (saturation_mode==0){
    vec3 hsv = rgb2HSV(_col);  // to HSV
    hsv.y *= (_f + 1.);
    hsv = hsv2RGB(hsv);  // to RGB
    return hsv;
  }
  else {
    vec3 BCH = rgb2BCH(_col);
    BCH.y *= (_f + 1.);
    BCH = bch2RGB(BCH);
    return BCH;
  }
}

// S H A R P E N   
vec3 Sharpen(vec3 _col, float _f, int _n, float _spread){
  vec3 BCH = rgb2BCH(_col);
  float spread = float(_n) * _spread;
  float b_avg = 0.;
  int n = _n;
  if (n >= 16) n = 16;
  float n_f = float(n);

  // get avergae of pixels in a square kernel around the current pixel
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

  BCH.x = b_avg * pow(BCH.x/b_avg, (_f + 1.));
  
  _col.rgb = bch2RGB(BCH);
  return _col;
}

///////////////////////////////////////////////////////////////////////
// Fractal brownian motion
///////////////////////////////////////////////////////////////////////

const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float noise( in vec2 x ) {
  // ** P A R T Y ** 
  float s = ttime * ui_party * 100.;
  if (ui_party*100.>.9) s *= pow(ui_party*200.,3.);
  return sin(2.5*x.x-s)*sin(1.5*x.y+s);
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
float func( vec2 q, vec3 _col, out vec4 ron )
{
  // animation speed
  // ** P A R T Y ** 
  float s = pow(ui_party * 200., 4.);
  // s = 1.;
  // float s = (ttime * .1) - (2. * (ttime * .1));

  float ql = length( q );
  q.x += 0.05*sin(0.27+ql*4.1);
  q.y += 0.05*sin(0.23+ql*4.3);
  q *= 0.5;

  vec2 o = vec2(0.0);
    o.x = 0.5 + 0.5*fbm4( vec2(2.0*q +vec2(s*5000.)         )  );
    o.y = 0.5 + 0.5*fbm4( vec2(2.0*q+vec2(5.2) - vec2(s))  );

  float ol = length( o );
    o.x += s + 0.02*sin(0.12+ol)/ol;
    // o.x += 0.02*sin(0.12+ol)/ol;
    o.y += s + 0.02*sin(0.14+ol)/ol;
    // o.y += 0.02*sin(0.14+ol)/ol;

    vec2 n;
    n.x = fbm4( vec2(4.0*o+vec2(9.2))  );
    n.y = fbm4( vec2(4.0*o+vec2(5.7))  );

    // ** P A R T Y ** 
    vec2 p = 4.0*q + 4.0*n;

    // made this 0+ to compensate for processing's window coords
    float f = 0.0 + 0.5*fbm4( p );

    f = mix( f, f*f*f*3.5, f*abs(n.x) );

    float g = 0.5 + 0.5*sin(4.0*p.x)*sin(4.0*p.y);
    f *= 1.0-0.5*pow( g, 8.0 );

    ron = vec4( o, n );
  
    return f;
}
vec2 pattern(vec2 p, float _mult, vec3 _col, out float f) {
  vec2 q = p;
  vec4 on = vec4(0.0);
  f = func(q, _col, on);

  // scale original mix with noise
  // ** P A R T Y ** 
  // float b = getB(_col);
  // b = 1.-b;
  // b *= pow(ui_party,.1);
  // float mult = _mult*2.;
  float mult = _mult * pow(_mult*2., 2.);
  f = f * mult;
  return vec2(q.x+f, q.y+f);
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


void main() {

  float fbm = 0.0;
  vec4 col = texture2D(texture, vertTexCoord.st);
  if (ui_party>=0.0001){
    col = texture2D(texture, pattern(vertTexCoord.st, ui_party*100., col.rgb, fbm));
    col.rgb = Hue(col.rgb, ttime*ui_party*1000.+(ui_party*3.1415));
    if (ui_party*100. >= .9) col.rgb = Saturation(col.rgb, ttime + ui_party * 400.);
    // col = texture2D(texture, vec2(vertTexCoord.s+.1, sin(vertTexCoord.t)));
  } 
  
  ///////////////////////////////////////////////////////////////////////
  // B E G I N   A D J U S T M E N T S
  ///////////////////////////////////////////////////////////////////////

  // C O L O R   C O R R E C T
  col.rgb = colorCorrect(col.rgb, ui_red, ui_green, ui_blue);

  // B R I G H T N E S S
  if (ui_brightness >= 0.001 || ui_brightness <= -0.001) {
    col.rgb = Brightness(col.rgb, ui_brightness);
  }
  // C O N T R A S T
  if (ui_contrast >= 0.001 || ui_contrast <= -0.001) {
    col.rgb = Contrast(col.rgb, ui_contrast);
  }
  // H U E  
  if (ui_hue >= 0.001 || ui_hue <= -0.001) {
    col.rgb = Hue(col.rgb, ui_hue);
  }
  // S A T U R A T I O N  
  if (ui_saturation >= 0.001 || ui_saturation <= -0.001) {
    col.rgb = Saturation(col.rgb, ui_saturation);
  }
  // S H A R P E N
  if (ui_sharpen >= 0.001 || ui_sharpen <= -0.001) {
    col.rgb = Sharpen(col.rgb, ui_sharpen, 4, 300.);
  }  
  // N I C E   C O N T R A S T
  if (ui_niceContrast >= 0.001 || ui_niceContrast <= -0.001) {
    col.rgb = Sharpen(col.rgb, ui_niceContrast, 4, 10.);
  }
  

  ///////////////////////////////////////////////////////////////////////
  // H U E  D E M O 
  ///////////////////////////////////////////////////////////////////////
  vec3 BCH = rgb2BCH(col.rgb);
    BCH.z += ttime*10.;
    vec3 bch_rgb = bch2RGB(BCH);
    vec3 bch_rgb_altAxis = bch2RGB_altAxis(BCH);
  vec3 bch_rgb_h = vec3(bch_rgb.z,bch_rgb.z,bch_rgb.z);
  
  vec3 HSV = rgb2HSV(col.rgb);
    float hue_mod = ttime * 4. * 180.0 / 2.;
    hue_mod = mod(hue_mod, 360.0);
    HSV.x += hue_mod;
    if (HSV.x >= 360.0) HSV.x -= 360.0;
  vec3 hsv_rgb = hsv2RGB(HSV);  // to RGB
  vec3 hsv_rgb_h = vec3(hsv_rgb.z,hsv_rgb.z,hsv_rgb.z);

  // ***JUST MESS WITH THESE*** //
  // col.rgb = hsv_rgb;
  // col.rgb = bch_rgb;
  // col.rgb = bch_rgb_altAxis;
  
  ///////////////////////////////////////////////////////////////////////
  // END HUE DEMO
  ///////////////////////////////////////////////////////////////////////



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

  ///////////////////////////////////////////////////////////////////////
  // messing around
  ///////////////////////////////////////////////////////////////////////

  // vec3 BCH = rgb2BCH(col.rgb);
  // vec2 BCH_st = vec2( vertTexCoord.s+mod(BCH.x*.1,vertTexCoord.s*.5), 
  //                     vertTexCoord.t+mod(BCH.x*.1,vertTexCoord.s*.5));

  // float darks = BCH.z * pow(BCH.z, .8);
  // vec2 P = vec2(BCH.x, BCH.x);

  // col.rgb=vec3(BCH.x,BCH.x,BCH.x);
  // if (darks <= .15){
  // if (darks >= .15){
    // vec2 sort = vec2(vertTexCoord.s - pow((.3*(mod(BCH.x,.1))),.8), vertTexCoord.t);
    // vec2 sort = vec2(vertTexCoord.s - pow((.2*(mod(darks,mod(float(ttime),2.)))),2.), vertTexCoord.t);
    // vec4 slide = texture2D(texture, sort);
    // col.rgb = slide.rgb;
  // }


  // G R I D
  // vec2 vt = vec2(vertTexCoord.s, vertTexCoord.t);
  // vt.x = mod(vt.x,.02)*(1./.02);
  // vt.y = mod(vt.y,.02)*(1./.02);
  // col.rg = vec2(vt.x, vt.y);


  gl_FragColor = col;

  // T H R E S H O L D
  //   float lum = dot(col, lumcoeff);
  //   if (threshold < lum) {
  //     gl_FragColor = vertColor;
  //   } else {
  //     gl_FragColor = vec4(0, 0, 0, 1);
  //   }     

}
