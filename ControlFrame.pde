/*
  ControlFrame class containing the secondary control window with
  knobs and sliders.
*/

ControlFrame addControlFrame(String theName, int theWidth, int theHeight) {
  Frame f = new Frame(theName);
  ControlFrame p = new ControlFrame(this, theWidth, theHeight);
  f.add(p);
  p.init();
  f.setTitle(theName);
  f.setSize(p.w, p.h);
  f.setLocation(100, 100);
  f.setResizable(false);
  f.setVisible(true);
  return p;
}

// the ControlFrame class extends PApplet, so we 
// are creating a new processing applet inside a
// new frame with a controlP5 object loaded
public class ControlFrame extends PApplet {

  int w, h;

  int abc = 100;
  
  public void setup() {
    size(w, h);
    frameRate(25);
    cp5 = new ControlP5(this);

    // Set up capture coordinates and window dimensions
    cp5.addSlider("x").setRange(0, 1440).setPosition(cp5_mx,10+cp5_my);
    cp5.addSlider("y").plugTo(parent,"x").setRange(0, 900).setPosition(cp5_mx,20+cp5_my);

    cp5.addSlider("width").setRange(4, 1440).setValue(640).setPosition(cp5_mx,40+cp5_my);
    cp5.addSlider("height").setRange(4, 900).setValue(480).setPosition(cp5_mx,50+cp5_my);
    
    // Set up RGB cc sliders and reset buttons
    red_slider = cp5.addSlider("red").setRange(-1.0, 1.0).setValue(0.0).setPosition(cp5_mx,80+cp5_my);
    green_slider = cp5.addSlider("green").setRange(-1.0, 1.0).setValue(0.0).setPosition(cp5_mx,90+cp5_my);
    blue_slider = cp5.addSlider("blue").setRange(-1.0, 1.0).setValue(0.0).setPosition(cp5_mx,100+cp5_my);
    
    cp5.addButton("redB") .setPosition(int(cp5_mx*.25),80+cp5_my)
                          .setSize(9,9)
                          .setLabelVisible(false)
                          ;
    cp5.addButton("greenB").setPosition(int(cp5_mx*.25),90+cp5_my)
                          .setSize(9,9)
                          .setLabelVisible(false)
                          ;
    cp5.addButton("blueB").setPosition(int(cp5_mx*.25),100+cp5_my)
                          .setSize(9,9)
                          .setLabelVisible(false)
                          ;          

    // Set up additional color correction options with toggles
    checkbox_toggles = cp5.addCheckBox("checkbox_toggles").setPosition(int(cp5_mx*.25), 120+cp5_my)
                                .addItem("brightness_tog", 0)
                                .addItem("contrast_type", 0)
                                .addItem("threshold_tog", 0)
                                .setItemsPerRow(1)
                                .hideLabels()
                                ;
    // CC sliders
    cp5.addSlider("brightness").setRange(-100, 100.0).setValue(0.0).setPosition(cp5_mx,120+cp5_my);
    cp5.addSlider("contrast").setRange(-100, 100.0).setValue(0.0).setPosition(cp5_mx,130+cp5_my);
    cp5.addSlider("threshold").setRange(0.0, 1.0).setValue(1.0).setPosition(cp5_mx,140+cp5_my);
    cp5.addSlider("exposure").setRange(0.0, 4.0).setValue(1.0).setPosition(cp5_mx,150+cp5_my);
  }

  void controlEvent(ControlEvent theEvent) {
    if (theEvent.isFrom(cp5.getController("x"))) {
      capture_window_posX = round(theEvent.getController().getValue());
    }
    if (theEvent.isFrom(cp5.getController("y"))) {
      capture_window_posY = round(theEvent.getController().getValue());
    }
    if (theEvent.isFrom(cp5.getController("width"))) {
      capture_window_width = round(theEvent.getController().getValue());
      if (capture_window_width <= 4) capture_window_width = 4;
      update_capture_window = true;
    }
    if (theEvent.isFrom(cp5.getController("height"))) {
      capture_window_height = round(theEvent.getController().getValue());
      if (capture_window_height <= 4) capture_window_height = 4;
      update_capture_window = true;
    }  

    if (theEvent.isFrom(red_slider)) {
      red_val = (theEvent.getController().getValue());
    }
    if (theEvent.isFrom(green_slider)) {
      green_val = (theEvent.getController().getValue());
    }
    if (theEvent.isFrom(blue_slider)) {
      blue_val = (theEvent.getController().getValue());
    }

    // B U T T O N S
    if (theEvent.isFrom(cp5.getController("redB"))) {
      red_slider.setValue(0.0);
      red_val = 0.0;
    }
    if (theEvent.isFrom(cp5.getController("greenB"))) {
      green_slider.setValue(0.0);
      green_val = 0.0;
    }
    if (theEvent.isFrom(cp5.getController("blueB"))) {
      blue_slider.setValue(0.0);
      blue_val = 0.0;
    }

    // F X   T O G G L E S
    if (theEvent.isFrom(checkbox_toggles)) {
      int size = checkbox_toggles.getArrayValue().length;
      fx_toggle = new int[size];

      for (int i = 0; i < size; i++) {
        int n = (int)checkbox_toggles.getArrayValue()[i];
        fx_toggle[n] = (int)checkbox_toggles.getArrayValue()[n];
        print(fx_toggle[n]+", ");
        }

        // update brightness appropriately
        float cur_brightness = cp5.getController("brightness").getValue();
        if (fx_toggle[0]==0) brightness_val = cur_brightness / 100;
        else if (fx_toggle[0]==1) brightness_val = cur_brightness / 100.0;

        // update contrast appropriately
        float cur_contrast = cp5.getController("contrast").getValue();
        if (fx_toggle[1]==0) contrast_val = pow((100 + cur_contrast) / 100, 2.0);
        else if (fx_toggle[1]==1) contrast_val = cur_contrast / 100.0;
    }

    // A D J U S T M E N T   S L I D E R S
    if (theEvent.isFrom(cp5.getController("brightness"))) {
      float cur_brightness = theEvent.getController().getValue();
      if (fx_toggle[0]==0) brightness_val = cur_brightness / 100;
      else if (fx_toggle[0]==1) brightness_val = cur_brightness / 100.0;
    }
    if (theEvent.isFrom(cp5.getController("contrast"))) {
      float cur_contrast = theEvent.getController().getValue();
      if (fx_toggle[1]==0) contrast_val = pow((100 + cur_contrast) / 100, 2.0);
      else if (fx_toggle[1]==1) contrast_val = cur_contrast / 100.0;
    }
    if (theEvent.isFrom(cp5.getController("threshold"))) {
      threshold_val = (theEvent.getController().getValue());
    }
    if (theEvent.isFrom(cp5.getController("exposure"))) {
      exp_val = (theEvent.getController().getValue());
    }
  }





  public void draw() {
    background(abc);
    textFont(font1);
    text(fps, 5,10);
  }
  
  private ControlFrame() {
  }

  public ControlFrame(Object theParent, int theWidth, int theHeight) {
    parent = theParent;
    w = theWidth;
    h = theHeight;
  }


  public ControlP5 control() {
    return cp5;
  }
  
  ControlP5 cp5;
  Object parent;
}