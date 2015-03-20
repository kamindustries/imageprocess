void setup() {
  // size(capture_window_width, capture_window_height);
  size(capture_window_width, capture_window_height, P3D);
  frame.setResizable(true);
  cp5 = new ControlP5(this);
  fps = frameRate;

  // ControlFrame creates a new window
  cf = addControlFrame("src window ctrl", 200,350);
  println("added ControlFrame");

  // Set up initial values
  pixel_value = color(255,255,255,255);
  display = createImage(capture_window_width, capture_window_height, RGB);
  capture_img = createImage(capture_window_width, capture_window_height, RGB);
  
  cc_toggle = 0; // rgb cc mode
  fx_toggle = new int[6];
  /*  FX TOGGLE LEGEND:
    0: brightness mode 
    1: contrast mode
    2: hue mode
    3: saturation mode
    4: sharpen
    5: fancy contrast
*/
  sort_toggle = new int[3];
  party_toggle = 0;
  

  // grid = box(0,0,capture_window_width, capture_window_height, display);
  bwShader = loadShader("shader.frag");
  println("loaded shader");

  // Start thread to capture screen
  thread("SimpleScreenCapture");
  println("started screen capture thread");


}