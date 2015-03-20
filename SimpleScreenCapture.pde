void SimpleScreenCapture() {
  Robot robot;
  
  // begin infite loop for thread action
  while (!capture_pause) {

    // update at ~24fps
    if (millis()%40==0) {
    // if (frameCount%1==0) {
      try {
        robot = new Robot();
        capture_img = new PImage(robot.createScreenCapture(
                      new Rectangle(capture_window_posX, capture_window_posY, 
                                    capture_window_width, capture_window_height)));

        // Decide whether or not to pixel sort
        if (sort_masterToggle == false) {
          display = capture_img;
        }

        else if (sort_masterToggle == true) {
          ///////////////////////////////////////////////////////////////////////
          // Kim Aesendorf's pixel sorting
          ///////////////////////////////////////////////////////////////////////
          
          while(column < width-1) {
          capture_img.loadPixels(); 
          sortColumn();
          column++;
          // capture_img.updatePixels();
          }
          while(row < height-1) {
            capture_img.loadPixels(); 
            sortRow();
            row++;
          }

          saved = true;
          column = 0;
          row = 0;
          capture_img.updatePixels();

          display = capture_img;
        }
      }

      catch (AWTException e) {
        display = new PImage(null);
        // column = 0;
        // row = 0;
        println(e);
      }
    }




  }
  

}