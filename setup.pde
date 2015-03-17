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
  
  fx_toggle = new int[3]; //1: brightness type, 2: contrast type
  

  // grid = box(0,0,capture_window_width, capture_window_height, display);
  bwShader = loadShader("shader.frag");
  println("loaded shader");

  // Start thread to capture screen
  thread("SimpleScreenCapture");
  println("started screen capture thread");


}