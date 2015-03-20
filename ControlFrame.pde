/*
  ControlFrame class containing the secondary control window with
  knobs and sliders.
*/

int pos_window_x_start = 100;
int pos_window_y_start = 100;

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

    ///////////////////////////////////////////////////////////////////////
    // T O G G L E S
    ///////////////////////////////////////////////////////////////////////
    checkbox_cc = cp5.addCheckBox("checkbox_cc")
                      .setPosition(cp5_mx-14-10, 70+cp5_my)
                      .addItem("cc_mode", 0)
                      .setItemsPerRow(1)
                      .hideLabels()
                      ;                      
    checkbox_fx = cp5.addCheckBox("checkbox_fx")
                      .setPosition(cp5_mx-14-10, 110+cp5_my)
                      .addItem("brightness_mode", 0)
                      .addItem("contrast_mode", 0)
                      .addItem("hue_mode", 0)
                      .addItem("saturation_mode", 0)
                      .addItem("sharpen_mode", 0)
                      .addItem("niceContrast_mode", 0)
                      .setItemsPerRow(1)
                      .hideLabels()
                      ;
    checkbox_sort = cp5.addCheckBox("checkbox_sort")
                      .setPosition(cp5_mx-14-10, 180+cp5_my)
                      .addItem("sort_black_mode", 0)
                      .addItem("sort_value_mode", 0)
                      .addItem("sort_white_mode", 0)
                      .setItemsPerRow(1)
                      .hideLabels()
                      ;
    checkbox_party = cp5.addCheckBox("checkbox_party")
                      .setPosition(cp5_mx-14-10, 250+cp5_my)
                      .addItem("party_mode", 0)
                      .setItemsPerRow(1)
                      .hideLabels()
                      ;
    checkbox_updateShader = cp5.addCheckBox("checkbox_updateShader")
                      .setPosition(cp5_mx-14-10, 220+cp5_my)
                      .addItem("update shader", 0)
                      .setItemsPerRow(1)
                      // .hideLabels()
                      ;                    

    ///////////////////////////////////////////////////////////////////////
    // C A P T U R E   C O N T R O L
    ///////////////////////////////////////////////////////////////////////
    cp5.addSlider("x")
      .setRange(0, 1440)
      .setPosition(cp5_mx,10+cp5_my)
      .setValue(pos_window_x_start)
      ;
    cp5.addSlider("y")
      .plugTo(parent,"x")
      .setRange(0, 900)
      .setPosition(cp5_mx,20+cp5_my)
      .setValue(pos_window_y_start)
      ;

    cp5.addSlider("width")
      .setRange(4, 1440)
      .setValue(1150)
      .setPosition(cp5_mx,35+cp5_my)
      ;
    cp5.addSlider("height")
      .setRange(4, 900)
      .setValue(480)
      .setPosition(cp5_mx,45+cp5_my)
      ;
    
    ///////////////////////////////////////////////////////////////////////
    // R E S E T   B U T T O N S
    ///////////////////////////////////////////////////////////////////////
    cp5.addButton("red_reset") 
        .setPosition(int(cp5_mx-12),70+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("green_reset")
        .setPosition(int(cp5_mx-12),80+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("blue_reset")
        .setPosition(int(cp5_mx-12),90+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("brightness_reset")
        .setPosition(int(cp5_mx-12),110+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("contrast_reset")
        .setPosition(int(cp5_mx-12),120+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("hue_reset")
        .setPosition(int(cp5_mx-12),130+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("saturation_reset")
        .setPosition(int(cp5_mx-12),140+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("sharpen_reset")
        .setPosition(int(cp5_mx-12),150+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("niceContrast_reset")
        .setPosition(int(cp5_mx-12),160+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("sort_black_reset")
        .setPosition(int(cp5_mx-12),180+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("sort_value_reset")
        .setPosition(int(cp5_mx-12),190+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("sort_white_reset")
        .setPosition(int(cp5_mx-12),200+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;
    cp5.addButton("party_reset")
        .setPosition(int(cp5_mx-12),250+cp5_my)
        .setSize(9,9)
        .setLabelVisible(false)
        ;

    ///////////////////////////////////////////////////////////////////////
    // S L I D E R S
    ///////////////////////////////////////////////////////////////////////
    cp5.addSlider("red")
      .setPosition(cp5_mx,70+cp5_my)
      .setRange(-1.0, 1.0)
      .setValue(0.0)
      ;
    cp5.addSlider("green")
      .setPosition(cp5_mx,80+cp5_my)
      .setRange(-1.0, 1.0)
      .setValue(0.0)
      ;
    cp5.addSlider("blue")
      .setPosition(cp5_mx,90+cp5_my)
      .setRange(-1.0, 1.0)
      .setValue(0.0)
      ;
    cp5.addSlider("brightness")
      .setPosition(cp5_mx,110+cp5_my)
      .setRange(-100, 100.0)
      .setValue(0.0)
      ;
    cp5.addSlider("contrast")
      .setPosition(cp5_mx,120+cp5_my)
      .setRange(-100, 100.0)
      .setValue(0.0)
      ;
    cp5.addSlider("hue")
      .setPosition(cp5_mx,130+cp5_my)
      .setRange(-100, 100.0)
      .setValue(0.0)
      ;
    cp5.addSlider("saturation")
      .setPosition(cp5_mx,140+cp5_my)
      .setRange(-100, 100.0)
      .setValue(0.0)
      ;
    cp5.addSlider("sharpen")
      .setPosition(cp5_mx,150+cp5_my)
      .setRange(-100, 100.0)
      .setValue(0.0)
      ;
    cp5.addSlider("niceContrast")
      .setPosition(cp5_mx,160+cp5_my)
      .setRange(-100, 100.0)
      .setValue(0.0)
      ;
    cp5.addSlider("sort: black")
      .setPosition(cp5_mx,180+cp5_my)
      .setRange(-20000000, -6000000)
      .setValue(-10000000)
      ;
    cp5.addSlider("sort: value")
      .setPosition(cp5_mx,190+cp5_my)
      .setRange(0.001, 255)
      .setValue(60)
      ;
    cp5.addSlider("sort: white")
      .setPosition(cp5_mx,200+cp5_my)
      .setRange(-10000000, 0)
      .setValue(-6000000)
      ;
    cp5.addSlider("party")
      .setPosition(cp5_mx,250+cp5_my)
      .setRange(-1., 1.)
      .setValue(0.0)
      ;


  }

  void controlEvent(ControlEvent theEvent) {
    ///////////////////////////////////////////////////////////////////////
    // Window Controls
    ///////////////////////////////////////////////////////////////////////
    if (theEvent.isFrom(cp5.getController("x"))) {
      capture_window_posX = round(theEvent.getController().getValue());
    }
    if (theEvent.isFrom(cp5.getController("y"))) {
      capture_window_posY = round(theEvent.getController().getValue());
    }
    if (theEvent.isFrom(cp5.getController("width"))) {
      // turn off sorting so it doesn't crash
      sort_toggle[0] = 0;
      sort_toggle[1] = 0;
      sort_toggle[2] = 0;
      sort_masterToggle = false;
      checkbox_sort.setArrayValue(float(sort_toggle));
      // make the width change
      capture_window_width = round(theEvent.getController().getValue());
      if (capture_window_width <= 4) capture_window_width = 4;
      update_capture_window = true;
    }

    if (theEvent.isFrom(cp5.getController("height"))) {
      // turn off sorting so it doesn't crash
      sort_toggle[0] = 0;
      sort_toggle[1] = 0;
      sort_toggle[2] = 0;
      sort_masterToggle = false;
      checkbox_sort.setArrayValue(float(sort_toggle));
      // make the height change
      capture_window_height = round(theEvent.getController().getValue());
      if (capture_window_height <= 4) capture_window_height = 4;
      update_capture_window = true;
    }



    ///////////////////////////////////////////////////////////////////////
    // A D J U S T M E N T   S L I D E R S
    ///////////////////////////////////////////////////////////////////////
    if (theEvent.isFrom(cp5.getController("red"))) {
      ui_red = (theEvent.getController().getValue());
      update_sliders=true;
    }
    if (theEvent.isFrom(cp5.getController("green"))) {
      ui_green = (theEvent.getController().getValue());
    }
    if (theEvent.isFrom(cp5.getController("blue"))) {
      ui_blue = (theEvent.getController().getValue());
    } 
    if (theEvent.isFrom(cp5.getController("brightness"))) {
      float b = theEvent.getController().getValue();
      ui_brightness = b / 100.0;
    }
    if (theEvent.isFrom(cp5.getController("contrast"))) {
      float c = theEvent.getController().getValue();
      if (fx_toggle[1]==0) ui_contrast = pow((100 + c) / 100, 2.0);
      else if (fx_toggle[1]==1) ui_contrast = c / 100.0;
    }
    if (theEvent.isFrom(cp5.getController("hue"))) {
      float b = theEvent.getController().getValue();
      ui_hue = b / 100.0;
    }
    if (theEvent.isFrom(cp5.getController("saturation"))) {
      float b = theEvent.getController().getValue();
      ui_saturation = b / 100.0;
    }
    if (theEvent.isFrom(cp5.getController("sharpen"))) {
      float b = theEvent.getController().getValue();
      ui_sharpen = b / 100.0;
    }
    if (theEvent.isFrom(cp5.getController("niceContrast"))) {
      float b = theEvent.getController().getValue();
      ui_niceContrast = b / 100.0;
    }

    if (theEvent.isFrom(cp5.getController("sort: black"))) {
      ui_sortBlackVal = int((theEvent.getController().getValue()));
    }
    if (theEvent.isFrom(cp5.getController("sort: value"))) {
      ui_sortBrightVal = int((theEvent.getController().getValue()));
    }
    if (theEvent.isFrom(cp5.getController("sort: white"))) {
      ui_sortWhiteVal = int((theEvent.getController().getValue()));
    }

    if (theEvent.isFrom(cp5.getController("party"))) {
      float b = theEvent.getController().getValue();
      ui_party = b / 100.0;
    }

    ///////////////////////////////////////////////////////////////////////
    // R E S E T   B U T T O N S
    ///////////////////////////////////////////////////////////////////////
    if (theEvent.isFrom(cp5.getController("red_reset"))) {
      cp5.getController("red").setValue(0.0);
      ui_red = 0.0;
    }
    if (theEvent.isFrom(cp5.getController("green_reset"))) {
      cp5.getController("green").setValue(0.0);
      ui_green = 0.0;
    }
    if (theEvent.isFrom(cp5.getController("blue_reset"))) {
      cp5.getController("blue").setValue(0.0);
      ui_blue = 0.0;
    }
    if (theEvent.isFrom(cp5.getController("brightness_reset"))) {
      cp5.getController("brightness").setValue(0.0);
      ui_brightness = 0.0;
    }
    if (theEvent.isFrom(cp5.getController("contrast_reset"))) {
      cp5.getController("contrast").setValue(0.0);
      ui_contrast = 0.0;
    }
    if (theEvent.isFrom(cp5.getController("hue_reset"))) {
      cp5.getController("hue").setValue(0.0);
      ui_hue = 0.0;
    }
    if (theEvent.isFrom(cp5.getController("saturation_reset"))) {
      cp5.getController("saturation").setValue(0.0);
      ui_saturation = 0.0;
    }
    if (theEvent.isFrom(cp5.getController("sharpen_reset"))) {
      cp5.getController("sharpen").setValue(0.0);
      ui_sharpen = 0.0;
    }
    if (theEvent.isFrom(cp5.getController("niceContrast_reset"))) {
      cp5.getController("niceContrast").setValue(0.0);
      ui_niceContrast = 0.0;
    }
    if (theEvent.isFrom(cp5.getController("sort_black_reset"))) {
      cp5.getController("sort: black").setValue(-10000000);
      ui_sortBlackVal = -10000000;
    }
    if (theEvent.isFrom(cp5.getController("sort_value_reset"))) {
      cp5.getController("sort: value").setValue(60);
      ui_sortBrightVal = 60;
    }
    if (theEvent.isFrom(cp5.getController("sort_white_reset"))) {
      cp5.getController("sort: white").setValue(-6000000);
      ui_sortWhiteVal = -6000000;
    }
    if (theEvent.isFrom(cp5.getController("party_reset"))) {
      cp5.getController("party").setValue(0.0);
      ui_party = 0.0;
    }


    ///////////////////////////////////////////////////////////////////////
    // F X   T O G G L E S
    ///////////////////////////////////////////////////////////////////////
    if (theEvent.isFrom(checkbox_fx)) {
      int size = checkbox_fx.getArrayValue().length;
      fx_toggle = new int[size];

      for (int i = 0; i < size; i++) {
        int n = (int)checkbox_fx.getArrayValue()[i];
        fx_toggle[n] = (int)checkbox_fx.getArrayValue()[n];
      }

      float value;
      // update brightness
      value = cp5.getController("brightness").getValue();
      ui_brightness = value / 100.0;

      // update contrast
      value = cp5.getController("contrast").getValue();
      if (fx_toggle[1]==0) ui_contrast = pow((100 + value) / 100, 2.0);
      else if (fx_toggle[1]==1) ui_contrast = value / 100.0;
      
      // update the rest...
      value = cp5.getController("hue").getValue(); 
      ui_hue = value / 100.0;

      value = cp5.getController("saturation").getValue(); 
      ui_saturation = value / 100.0;
    
      value = cp5.getController("sharpen").getValue(); 
      ui_sharpen = value / 100.0;
    
      value = cp5.getController("niceContrast").getValue(); 
      ui_niceContrast = value / 100.0;
    }

    ///////////////////////////////////////////////////////////////////////
    // M O R E   T O G G L E S
    ///////////////////////////////////////////////////////////////////////
    if (theEvent.isFrom(checkbox_cc)) {
        cc_toggle = (int)checkbox_cc.getArrayValue()[0];
      }
    
    if (theEvent.isFrom(checkbox_party)) {
        party_toggle = (int)checkbox_party.getArrayValue()[0];
      }

    if (theEvent.isFrom(checkbox_fx)) {
      int size = checkbox_fx.getArrayValue().length;
      fx_toggle = new int[size];
      println("size: "+size);
      for (int i=0; i<size; i++){
        int n = (int)checkbox_fx.getArrayValue()[i];
        fx_toggle[i] = n;
      }
    }
    
    if (theEvent.isFrom(checkbox_sort)) {
      int incoming_0 = (int)checkbox_sort.getArrayValue()[0];
      int incoming_1 = (int)checkbox_sort.getArrayValue()[1];
      int incoming_2 = (int)checkbox_sort.getArrayValue()[2];
      if (incoming_0 != sort_toggle[0]) {
        sort_toggle[0] = (int)checkbox_sort.getArrayValue()[0];
        sort_toggle[1] = 0;
        sort_toggle[2] = 0;
        checkbox_sort.setArrayValue(float(sort_toggle));
        sort_mode = 0;
      }
      else if (incoming_1 != sort_toggle[1]) {
        sort_toggle[0] = 0;
        sort_toggle[1] = (int)checkbox_sort.getArrayValue()[1];
        sort_toggle[2] = 0;
        checkbox_sort.setArrayValue(float(sort_toggle));
        sort_mode = 1;
      }
      else if (incoming_2 != sort_toggle[2]) {
        sort_toggle[0] = 0;
        sort_toggle[1] = 0;
        sort_toggle[2] = (int)checkbox_sort.getArrayValue()[2];
        checkbox_sort.setArrayValue(float(sort_toggle));
        sort_mode = 2;
      }
      int x = 0;
      for (int i=0; i<3; i++){
        if (sort_toggle[i] > 0) x++;
      }
      if (x<=0) sort_masterToggle = false;
      else if (x>0) sort_masterToggle = true;
    }
    
    if (theEvent.isFrom(checkbox_updateShader)) {
      update_shader = (int)checkbox_updateShader.getArrayValue()[0];
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