/*
This is based on combining ControlP5 Controlframe with a screen capture
technique. 

ControlP5 Controlframe is a way of generating two windows so that we can 
have one window to display the video and one to display the controls.

The screen capture technique is an implementation of a comment someone
left on the github for "ScreenCapturer", a once-popular Processing library
to generate live screen capture data. The library is several years old though 
and no longer works due to an update to Java's way of handling transparent 
windows.

Most of the comments come from the copied code.

Original Github comment:

https://github.com/onformative/ScreenCapturer/issues/2


BCH Color Coordinate System. S. Bezryadin, P. Bourov:

http://www.slideserve.com/orien/color-coordinate-
systems-for-accurate-color-image-editing-software

http://web.archive.org/web/20130810054448/http://
www.kweii.com/site/color_theory/2007_LV/BrightnessCalculation.pdf


Pixel sorting by Kim Asendorf:

kimasendorf.com/mountain-tour/

 */

import java.awt.Frame;
import java.awt.BorderLayout;
import java.awt.Robot;
import java.awt.Rectangle;
import java.awt.AWTException;
import controlP5.*;

private ControlP5 cp5;

ControlFrame cf;

PImage display;
PImage capture_img;
color pixel_value;

// S O R T I N G
//MODE:
//0 -> black
//1 -> bright
//2 -> white
int sort_mode = 0;
int loops = 1;
int blackValue = -10000000;
int brigthnessValue = 60;
int whiteValue = -6000000;
int row = 0;
int column = 0;
boolean saved = false;

int capture_window_posX = 0;
int capture_window_posY = 0;
int capture_window_width = 1150;
int capture_window_height = 480;
boolean capture_pause = false;
boolean update_capture_window = true;
int update_image;

boolean update_sliders = true;
int cc_toggle; 
int[] fx_toggle; 
int[] sort_toggle;
boolean sort_masterToggle = false;
int party_toggle; 
/*  FX TOGGLE LEGEND:
    0: brightness mode 
    1: contrast mode
    2: hue mode
    3: saturation mode
    4: sharpen
    5: fancy contrast
*/
float ui_red = 0.;
float ui_green = 0.;
float ui_blue = 0.;
float ui_brightness = 0.;
float ui_contrast = 0.;
float ui_hue = 0.;
float ui_saturation = 0.;
float ui_sharpen = 0.;
float ui_niceContrast = 0.;
int ui_sortBlackVal = -10000000;
int ui_sortBrightVal = 60;
int ui_sortWhiteVal = -6000000;
float ui_party = 0.;
int update_shader = 0;

CheckBox checkbox_cc;
CheckBox checkbox_fx;
CheckBox checkbox_sort;
CheckBox checkbox_party;
CheckBox checkbox_updateShader;
int cp5_mx = 30;
int cp5_my = 10;
float fps;

PShape grid;
PShader bwShader;

PFont font1 = createFont("monaco", 10, true);
