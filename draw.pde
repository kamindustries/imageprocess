void draw() {
  background(0);

  // Update size of display window because a slider was adjusted
  frame.setResizable(true);
  if (update_capture_window == true) {
    frame.setSize(capture_window_width, capture_window_height);
    update_capture_window = false;
  }

  // render the image
  if (update_shader > 0) {
    if (frameCount%48==0) bwShader = loadShader("shader.frag");
  }
  // update shader with slider settings
  updateShaderVariables();

  // apply shader and display the image
  shader(bwShader);
  image(display, 0, 0, capture_window_width, capture_window_height);
  resetShader();

  // display framerate at top right corner
  textFont(font1);
  noStroke();
  fill(0,210);
  rect(capture_window_width - 50, 0, 50, 10);
  fill(255,210);
  text(frameRate, capture_window_width - 50, 10); 

}