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
void keyPressed() {
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