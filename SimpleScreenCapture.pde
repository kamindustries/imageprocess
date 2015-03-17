void SimpleScreenCapture() {
  Robot robot;
  
  // begin infite loop for thread action
  while (!capture_pause) {

    // update at ~24fps
    if (millis()%40==0) {
      try {
        robot = new Robot();
        display = new PImage(robot.createScreenCapture(new Rectangle(capture_window_posX, capture_window_posY, 
                          capture_window_width, capture_window_height)));
        
      }
      catch (AWTException e) {
        display = new PImage(null);
        println(e);
      }
    }
  }
  

}