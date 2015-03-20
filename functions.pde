float EaseIn(float _value, float _target, float _speed){
  float x = _value;
  float d = _target - _value;
  x = d * _speed;
  return x;
}
float EaseCtrl(float _value, float _target, float _speed){
  float x = _value;
  float d = _target - _value;
  x = d * _speed;
  return x;
}
void updateShaderVariables(){
    bwShader.set("ui_red", ui_red);
    bwShader.set("ui_green", ui_green);
    bwShader.set("ui_blue", ui_blue);
    bwShader.set("ui_brightness", ui_brightness);
    bwShader.set("ui_contrast", ui_contrast);
    bwShader.set("ui_hue", ui_hue);
    bwShader.set("ui_saturation", ui_saturation);
    bwShader.set("ui_sharpen", ui_sharpen);
    bwShader.set("ui_niceContrast", ui_niceContrast);
    // bwShader.set("ui_sortBlackVal", ui_sortBlackVal);
    // bwShader.set("ui_sortBrightVal", ui_sortBrightVal);
    // bwShader.set("ui_sortWhiteVal", ui_sortWhiteVal);
    bwShader.set("ui_party", ui_party);
    bwShader.set("cc_mode",   cc_toggle);
    bwShader.set("brightness_mode",   fx_toggle[0]);
    bwShader.set("contrast_mode",     fx_toggle[1]);
    bwShader.set("hue_mode",          fx_toggle[2]);
    bwShader.set("saturation_mode",   fx_toggle[3]);
    bwShader.set("sharpening_mode",   fx_toggle[4]);
    bwShader.set("niceContrast_mode", fx_toggle[5]);
    bwShader.set("party_mode",   party_toggle);
    bwShader.set("ttime", float(millis())*.0001);

    update_sliders=false;
}
void keyPressed() {
 if (key == ' '){
    println("ui_red: " + ui_red);
    println("ui_green: " + ui_green);
    println("ui_blue: " + ui_blue);
    println("ui_brightness: " + ui_brightness);
    println("ui_contrast: " + ui_contrast);
    println("ui_hue: " + ui_hue);
    println("ui_saturation: " + ui_saturation);
    println("ui_sharpen: " + ui_sharpen);
    println("ui_niceContrast: " + ui_niceContrast);
    println("ui_sortBlackVal: " + ui_sortBlackVal);
    println("ui_sortBrightVal: " + ui_sortBrightVal);
    println("ui_sortWhiteVal: " + ui_sortWhiteVal);
    println("ui_party: " + ui_party);
    println("");
    println("cc_mode: " +   cc_toggle);
    println("brightness_mode: " +   fx_toggle[0]);
    println("contrast_mode: " +     fx_toggle[1]);
    println("hue_mode: " +          fx_toggle[2]);
    println("saturation_mode: " +   fx_toggle[3]);
    println("sharpening_mode: " +   fx_toggle[4]);
    println("niceContrast_mode: " + fx_toggle[5]);
    println("party_mode: " +   party_toggle);
    println("sort: black: " + sort_toggle[0]);
    println("sort: value: " + sort_toggle[1]);
    println("sort: white: " + sort_toggle[2]);
    println("sort master toggle: " + sort_masterToggle);
    println("");

  }
 if (key == '.'){
    int y = year();   // 2003, 2004, 2005, etc.
    int m = month();  // Values from 1 - 12
    int d = day();    // Values from 1 - 31
    int h = hour();    // Values from 0 - 23
    int i = minute();  // Values from 0 - 59
    int s = second();  // Values from 0 - 59
    String filename = "images/naturalreject."+y+m+d+"."+h+m+s+".png";
    saveFrame(filename);
  }
}