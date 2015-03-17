void draw() {
  if (frameCount==0) println("started drawing");
  background(0);

  // Update size of display window because a slider was adjusted
  frame.setResizable(true);
  if (update_capture_window == true) {
    frame.setSize(capture_window_width, capture_window_height);
    update_capture_window = false;
  }

  // render the image
  if (frameCount%24==0) bwShader = loadShader("shader.frag");
  bwShader.set("brightness_val", brightness_val);
  bwShader.set("contrast_val", contrast_val);
  bwShader.set("threshold", threshold_val);
  bwShader.set("exp_val", exp_val);
  bwShader.set("red", red_val);
  bwShader.set("green", green_val);
  bwShader.set("blue", blue_val);
  bwShader.set("brightness_type", fx_toggle[0]);
  bwShader.set("contrast_type", fx_toggle[1]);
  bwShader.set("threshold_tog", fx_toggle[2]);
  bwShader.set("ttime", float(millis())*.0001);
  shader(bwShader);

  // noStroke();
  // fill(0);
  image(display, 0, 0, capture_window_width, capture_window_height);
  // texture(display);
  // box(capture_window_width, capture_window_height, 1);  
  
  resetShader();

  
  stroke(0);
  textFont(font1);
  fill(0);
  text(frameRate, capture_window_width - 50, 10);  
  // shape(grid);



}