module.exports = [
{
 id:'00-start',title:'Meet your drawing machine',minutes:25,stage:'Start',diagram:'lifecycle',
 intro:[
  'A program is a set of instructions. JavaScript is the language in this workbook. p5.js is a library: a collection of ready-made instructions for drawing and interaction. A sketch is a small p5 program. You do not need to understand the workbook software to understand its sketches.',
  'Start here: press Run sketch below. Then change one number in the code box and run again. The numbered explanation underneath always describes the original example. Reset example restores that original. Your code edits are temporary; copy or download code you want to keep.',
  'For your own saved project, open editor.p5js.org, choose a new sketch, and replace the entire contents of sketch.js with one complete example. Press the triangle Run button. Stop with the square. Saving and sharing in the editor may require an account. The editor also has index.html and style.css: these provide the page and its styling; this course starts by editing sketch.js.',
  'The offline previews here use p5 2.3.4. To pin the same version in a new Web Editor project, open its file sidebar and choose index.html. Find the script tag whose src address loads the main p5 library. Change only that quoted address to https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.min.js . Src means the source address of a script file; the @2.3.4 part fixes the library version. Keep the separate script that loads sketch.js. For these silent exercises, remove any old p5.sound script tag rather than mixing v1 sound with v2. Return to sketch.js and run the example. The browser console can also report p5.VERSION when you want to check what actually loaded.',
  'New v2 code uses async setup and await; older v1 examples often use preload. Keep one version per sketch. Camera and video lessons are clearly marked as external exercises. The ZIP also includes a complete starter index.html and a setup guide explaining every HTML line; use these if you need a clean starting page.',
  'For image lessons in the Web Editor, log in so file upload is available. Open the Sketch Files navigation panel, open the options beside Sketch Files, and choose Upload file. The upload area says Drop files here or click to use the file browser. Select assets/sample.png from the extracted ZIP. After upload, confirm that sample.png appears beside sketch.js. The quoted filename in loadImage must match that name exactly. If you put the upload inside a folder, use that folder path in loadImage. The built-in workbook previews supply this image automatically.'
 ],
 lines:[
  ['function setup() {','Define a function named setup. A function is a named group of instructions. p5 calls setup once when the sketch starts. Parentheses hold inputs; these are empty. The opening curly brace begins the group.'],
  ['  createCanvas(320, 240);','Create a drawing area 320 pixels wide and 240 pixels tall. A pixel is a tiny unit of the digital picture. The comma separates two inputs. A semicolon ends this instruction.'],
  ['  background(240);','Paint the canvas light gray. In the default RGB color mode a single number means a gray value: 0 is black and 255 is white. This paint covers what was drawn before it.'],
  ['  fill(235, 90, 70);','Choose a red-orange fill for shapes drawn after this line. These three numbers are the red, green, and blue amounts. Choosing a fill does not draw a shape by itself.'],
  ['  circle(160, 120, 80);','Draw a circle centered at x=160, y=120 with diameter 80. A diameter is the full distance across a circle. The circle sits in the middle of this canvas.'],
  ['}','Close the setup group. Matching opening and closing braces tell JavaScript where a function begins and ends.']
 ],predict:'Before running: will the circle be centered, and will its diameter cover half the canvas width?',expect:'A red-orange circle at the center of a light gray canvas. Its diameter is 80, one quarter of the 320-pixel width.',
 practice:[
  {task:'Change only the diameter from 80 to 160. Predict the change, run it, and describe it without using the word bigger.',hint:'The last number in circle controls the diameter, not the radius.',solution:'Use circle(160, 120, 160). The diameter doubles. The center stays fixed. It now covers half the canvas width.'},
  {task:'Move the circle near the top-left corner while keeping the entire shape visible.',hint:'The center must stay at least half a diameter away from each edge.',solution:'With diameter 80, circle(40, 40, 80) just touches the top and left edges. A center of (0,0) would leave three quarters of the circle outside the canvas.'},
  {task:'Save a personal copy in the p5 editor and give it a name you can recognize tomorrow.',hint:'Copy the complete sketch, including its braces. Change only sketch.js for this exercise.',solution:'Run the copied sketch, save it, then stop and run again. Record the sketch link in your practice log. Seeing the same drawing after a restart is your first reproducibility check.'}
 ],check:[{q:'Does fill draw a shape?',a:'No. It changes the setting used by subsequent drawing instructions.'},{q:'What calls setup?',a:'p5 calls it once. You define its contents.'}],refs:['https://p5js.org/reference/p5/setup/','https://p5js.org/reference/p5/createCanvas/','https://p5js.org/tutorials/v2_transition/']
},
{
 id:'01-language',title:'Read code and name values',minutes:30,stage:'Foundations',diagram:'variables',
 intro:[
  'A value is a piece of information. 90 is a number, "circle" is a string of text, and true is a Boolean meaning yes. Quotes make text; they are not used around numeric drawing inputs. Variables give values names so you can use them in several places.',
  'let declares a variable whose value may be reassigned. const declares a binding that cannot be reassigned. The equals sign stores a value: it is assignment, not a question. A later expression such as x + 10 computes a new value. Variable names are case-sensitive: diameter and Diameter are different names.',
  'The two slashes introduce a comment for humans. A comment does not execute. Indentation helps you see groups; braces actually define them. If an error appears, start with the first message and the line it names. Fix one issue and run again.'
 ],lines:[
  ['function setup() {','Begin the one-time setup function.'],
  ['  createCanvas(320, 240);','Make a canvas with a known width and height.'],
  ['  const diameter = 90;','Create a constant named diameter and store the number 90. The name describes what that number means.'],
  ['  let x = 80;','Create a variable named x with initial value 80. It can be reassigned later.'],
  ['  x = x + 40;','Read the current x (80), add 40, then store the result (120) back in x. Read the right side before the assignment happens.'],
  ['  background(240);','Paint a light gray background.'],
  ['  fill(40, 130, 190);','Choose blue for the next shape.'],
  ['  // Draw with the named values.','This line is a comment. JavaScript ignores everything after the two slashes on this line.'],
  ['  circle(x, height / 2, diameter);','Use x=120, half of the current canvas height (120), and diameter=90. The / symbol divides. height is supplied by p5 after creating the canvas.'],
  ['}','Finish setup.']
 ],predict:'What value will x have when circle runs: 80, 40, or 120?',expect:'A blue circle centered at (120,120), with diameter 90.',
 practice:[{task:'Replace 40 with -20 in the assignment. Calculate x before running.',hint:'Adding a negative number subtracts.',solution:'80 + (-20) is 60. The circle center moves to x=60.'},{task:'Replace height / 2 with height * 0.75. Explain why this still adapts to a different canvas height.',hint:'An asterisk multiplies. 0.75 means three quarters.',solution:'The y position becomes 180 on this canvas. It remains three quarters down the canvas whenever height changes.'},{task:'Add a second circle that uses diameter / 2.',hint:'Repeat a circle instruction with a different position and a computed diameter.',solution:'After the first circle, add circle(250, 120, diameter / 2). It draws a circle 45 pixels across. Changing diameter now affects both circles.'}],check:[{q:'What is the difference between = and ===?',a:'= assigns a value. === compares two values for strict equality and produces true or false.'},{q:'Why use a name instead of repeating 90?',a:'The name explains intent and lets one change update every use.'}],refs:['https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Variables','https://p5js.org/reference/p5/height/']
},
{
 id:'02-coordinates',title:'Place shapes and control drawing order',minutes:30,stage:'Foundations',diagram:'coordinates',
 intro:['Canvas coordinates begin at the top-left corner: x increases to the right and y increases downward. A point has two coordinates (x,y). This differs from a school graph whose positive y often points upward.','By default, rect uses its top-left corner and a width and height. circle uses its center and diameter. Drawing order works like layers of paint: a later opaque shape covers an earlier one. stroke controls a shape outline; noStroke removes outlines.'],
 lines:[
  ['function setup() {','Start the one-time drawing instructions.'],
  ['  createCanvas(320, 240);','Create the coordinate space. Its left/top edges are at 0.'],
  ['  background(238, 229, 209);','Paint a warm background.'],
  ['  noStroke();','Remove outlines from subsequent shapes.'],
  ['  fill(40, 120, 110);','Choose a green fill.'],
  ['  rect(40, 40, 180, 140);','Draw a rectangle starting at (40,40), extending 180 right and 140 down.'],
  ['  fill(240, 160, 70);','Choose orange for subsequent shapes.'],
  ['  circle(220, 120, 100);','Draw an orange circle. It is drawn after the rectangle, so its overlapping part covers the rectangle.'],
  ['  stroke(30);','Set a dark outline color for later drawing.'],
  ['  strokeWeight(3);','Make the line thickness three canvas pixels.'],
  ['  line(0, height / 2, width, height / 2);','Draw a horizontal line from the left edge to the right edge at half the height. It is on top because it is drawn last.'],
  ['}','Finish setup.']
 ],predict:'Which color will be visible where the orange circle overlaps the green rectangle?',expect:'An orange circle partly covers a green rectangle. A dark horizontal line crosses both.',
 practice:[{task:'Swap the two shape groups: orange fill plus circle before green fill plus rect.',hint:'Move the fill together with its shape so colors stay attached.',solution:'The green rectangle now covers the overlapping part of the circle. The coordinates did not change; drawing order did.'},{task:'Place the rectangle so its center is at the canvas center.',hint:'Subtract half its width and height from the desired center.',solution:'Use rect(width / 2 - 90, height / 2 - 70, 180, 140). With the default rect mode, the first two inputs locate the corner.'},{task:'Make the line diagonal from top-left to bottom-right.',hint:'line takes x1, y1, x2, y2.',solution:'Use line(0, 0, width, height). Draw it last to keep it visible over both shapes.'}],check:[{q:'Where is (0,0)?',a:'At the top-left of the canvas.'},{q:'Does a later fill change an existing shape?',a:'No. It affects later drawing instructions; existing pixels stay as they were until painted again.'}],refs:['https://p5js.org/reference/p5/rect/','https://p5js.org/reference/p5/line/']
},
{
 id:'03-animation',title:'Understand setup draw and motion',minutes:35,stage:'Foundations',diagram:'lifecycle',
 intro:['setup runs once; draw is called repeatedly. Each draw call paints the current frame. Motion happens when a stored position changes between frames. A variable declared outside the functions survives from one call to the next.','A variable declared inside draw is newly created each time draw is called. If you put let x = 0 inside draw, you restart x every frame. A background inside draw clears the previous picture; leaving it outside draw lets marks accumulate. The speed in this example is pixels per frame, so it depends on frame rate. A later lesson uses elapsed time.'],
 lines:[
  ['let x = 0;','Store the horizontal position outside setup and draw so it persists across frames.'],
  ['function setup() {','Begin the one-time setup.'],
  ['  createCanvas(320, 240);','Create the canvas before animation starts.'],
  ['}','End setup.'],
  ['function draw() {','Define the repeated drawing instructions. p5 calls this function again for each frame.'],
  ['  background(240);','Clear the previous frame with light gray paint.'],
  ['  fill(220, 80, 90);','Choose the moving circle color.'],
  ['  circle(x, height / 2, 40);','Draw the circle at the current x position.'],
  ['  x = x + 2;','Increase x by two for the next frame. This changes stored state.'],
  ['  if (x > width) {','Ask whether x is beyond the right edge. The > symbol means greater than. Run the enclosed instructions only if the answer is true.'],
  ['    x = 0;','Move the stored position back to the left edge.'],
  ['  }','Close the conditional group.'],
  ['}','Close the repeated draw function.']
 ],predict:'Will the old circles remain visible after the circle moves?',expect:'One circle travels left to right and jumps back. background clears the old positions.',
 practice:[{task:'Change the step from 2 to 0.5 and compare its speed.',hint:'Fractional positions are allowed.',solution:'The circle moves one quarter as far per frame, so it travels about four times more slowly at the same frame rate.'},{task:'Move background(240) from draw into setup. Run again.',hint:'Think about which instructions repeat.',solution:'The first frame is cleared, but later frames add circles without erasing earlier marks. A trail accumulates.'},{task:'Temporarily move let x = 0 inside draw and predict the problem.',hint:'A local initialization executes every time its function is called.',solution:'The circle stays at x=0 because x is reset before each drawing. Restore the original global declaration to keep motion.'}],check:[{q:'What must persist to create motion?',a:'The changing position or another state value must survive across draw calls.'},{q:'Does frameRate(60) guarantee 60 drawings each second?',a:'No. It requests a rate; performance can be lower.'}],refs:['https://p5js.org/reference/p5/draw/','https://p5js.org/reference/p5/frameRate/']
},
{
 id:'04-decisions',title:'React to the mouse and make decisions',minutes:35,stage:'Foundations',diagram:'decision',
 intro:['An input is information from outside your program, such as the mouse position. mouseX and mouseY are supplied by p5. mouseIsPressed is a Boolean: true while a mouse button is held down and false otherwise.','if chooses whether a block runs. else chooses the alternative block. Comparisons such as x < 100 produce Booleans. === means strict equality; = means assignment. The && operator means both conditions must be true; || means at least one must be true. These logical tools let you define which region changes.','Interaction should be intentional. For the final assignment, plan where and when a person acts so the visual experience can be repeated. Mouse-dependent exercises here are practice; the final starter uses elapsed time.'],
 lines:[
  ['function setup() {','Start the one-time setup.'],
  ['  createCanvas(320, 240);','Create a canvas that can receive mouse input.'],
  ['}','Finish setup.'],
  ['function draw() {','Start the instructions repeated each frame.'],
  ['  background(240);','Clear the old mouse drawing.'],
  ['  if (mouseIsPressed) {','Choose this branch while a mouse button is held down over the preview.'],
  ['    fill(240, 90, 60);','Use orange when pressed.'],
  ['  } else {','End the pressed branch and begin the alternative branch.'],
  ['    fill(40, 130, 190);','Use blue when not pressed.'],
  ['  }','End the conditional. Only one of these two fill instructions ran.'],
  ['  circle(mouseX, mouseY, 50);','Draw a circle that follows the mouse using the currently selected fill.'],
  ['}','Finish draw.']
 ],predict:'What changes when you hold a mouse button: the circle position, its color, or both?',expect:'The circle follows the pointer. Pressing changes its color; pointer motion changes its position.',
 practice:[{task:'Replace the condition with mouseX < width / 2.',hint:'This asks whether the pointer lies in the left half.',solution:'The circle becomes orange on the left half and blue on the right, regardless of pressing.'},{task:'Make orange appear only in the top-left quarter.',hint:'Combine x and y tests with &&.',solution:'Use if (mouseX < width / 2 && mouseY < height / 2). Both comparisons must be true.'},{task:'Add function mousePressed() after draw and use it to log a message.',hint:'This event function runs on a press, while mouseIsPressed stays true during the hold.',solution:'Add function mousePressed() { console.log("pressed"); }. Open the editor console. Each press writes a message. The text is a quoted string.'}],check:[{q:'What does else do?',a:'Runs its block when the if condition is false.'},{q:'How is a held-state different from an event?',a:'A held-state can be checked every frame; an event function runs when the event occurs.'}],refs:['https://p5js.org/reference/p5/mouseIsPressed/','https://p5js.org/reference/p5/mousePressed/']
},
{
 id:'05-functions',title:'Reuse a rule with functions',minutes:35,stage:'Foundations',diagram:'functions',
 intro:['Functions package a rule so you can use it more than once. A parameter is a name for an input in a function definition. An argument is an actual value supplied when you call it. p5 supplies functions like circle; you can define your own.','A return statement sends a result back to the caller. A drawing function can simply paint without returning a useful value. Keeping a color or drawing rule in one function makes iterations easier because you have one place to edit.'],
 lines:[
  ['function setup() {','Start setup, the function that p5 automatically calls once.'],
  ['  createCanvas(320, 240);','Create the canvas.'],
  ['  background(240);','Clear the drawing surface.'],
  ['  drawDot(80, 120, 40);','Call our custom function with position 80,120 and size 40. JavaScript finds the definition below.'],
  ['  drawDot(220, 120, 80);','Call the same rule again with different arguments.'],
  ['}','Finish setup.'],
  ['function drawDot(x, y, diameter) {','Define a custom function with three parameters. On each call, these names receive that call\'s values.'],
  ['  fill(70, 145, 125);','Choose a green fill inside the reusable rule.'],
  ['  circle(x, y, diameter);','Draw using the values provided for this call.'],
  ['}','Finish drawDot.']
 ],predict:'How many times will the circle instruction run even though it is written only once?',expect:'Two green circles, with different positions and diameters.',
 practice:[{task:'Add a third dot with one additional function call.',hint:'Call drawDot in setup after the other calls.',solution:'For example, drawDot(160, 60, 25) adds a third dot. You reuse the existing rule instead of rewriting its body.'},{task:'Add a parameter named redAmount and use it in fill.',hint:'Add the parameter to the definition and supply it in every call.',solution:'Define drawDot(x, y, diameter, redAmount), use fill(redAmount, 145, 125), then call drawDot(80, 120, 40, 200). Each call now controls its red channel.'},{task:'Write a function that returns half of a number, then use it as a diameter.',hint:'The pattern is function half(value) { return value / 2; }.',solution:'Add function half(value) { return value / 2; } below the other functions. Calling drawDot(160, 200, half(60)) produces a diameter of 30.'}],check:[{q:'Is x inside drawDot the same stored variable as another function\'s local x?',a:'No. Parameters are local to their function call.'},{q:'Does defining a custom function automatically draw its contents?',a:'No. It needs to be called, unless it is a special lifecycle or event function p5 calls for you.'}],refs:['https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Functions']
},
{
 id:'06-mapping',title:'Convert one range into another',minutes:30,stage:'Foundations',diagram:'mapping',
 intro:['The mouse position may range from 0 to 320, but a circle diameter might need to range from 10 to 120. map converts proportionally between ranges. It does not automatically clamp values: input outside the source range can produce output outside the destination range. constrain limits a number to a minimum and maximum.','This relationship matters for image work: a coordinate on a large fullscreen canvas may need to refer to a much smaller source image. Source coordinates and destination coordinates are different spaces.'],
 lines:[
  ['function setup() {','Start setup.'],
  ['  createCanvas(320, 240);','Create the canvas and establish width and height.'],
  ['}','Finish setup.'],
  ['function draw() {','Repeat this mapping and drawing as the mouse moves.'],
  ['  background(240);','Clear the previous circle.'],
  ['  let diameter = map(mouseX, 0, width, 10, 120);','Convert the pointer\'s horizontal position into a diameter. The five inputs are value, source minimum, source maximum, destination minimum, destination maximum.'],
  ['  diameter = constrain(diameter, 10, 120);','Keep the resulting diameter between 10 and 120, even if the pointer moves beyond an edge.'],
  ['  fill(160, 90, 190);','Choose a purple fill.'],
  ['  circle(width / 2, height / 2, diameter);','Keep the center fixed and change only the diameter.'],
  ['}','Finish draw.']
 ],predict:'At the middle of the canvas, what diameter lies halfway between 10 and 120?',expect:'The diameter changes from 10 at the left to 120 at the right. At the middle it is 65.',
 practice:[{task:'Reverse the direction so moving right shrinks the circle.',hint:'Swap the destination endpoints.',solution:'Use map(mouseX, 0, width, 120, 10). Keep constrain(diameter, 10, 120). Left gives 120 and right gives 10.'},{task:'Map mouseY into a gray background value from 0 to 255.',hint:'Store a second mapped value and pass it to background.',solution:'Inside draw, use let gray = constrain(map(mouseY, 0, height, 0, 255), 0, 255); then background(gray). The top becomes black and the bottom white.'},{task:'Calculate where source coordinate 80 lands when a 160-pixel-wide image is displayed 640 pixels wide.',hint:'80 is halfway across the source.',solution:'map(80, 0, 160, 0, 640) is 320. The point stays halfway across, but its numerical coordinate changes.'}],check:[{q:'Does map restrict the result to its destination range?',a:'Not by default. Use constrain or the documented optional clamp argument when appropriate.'},{q:'Why avoid fixed placement numbers for fullscreen work?',a:'Proportional placement stays related to the canvas when the window changes size.'}],refs:['https://p5js.org/reference/p5/map/','https://p5js.org/reference/p5/constrain/']
},
{
 id:'07-loops',title:'Repeat instructions across a grid',minutes:40,stage:'Foundations',diagram:'grid',
 intro:['A for loop repeats a block while its condition remains true. Its header has three parts: initialize a variable; test a condition; change the variable after each repetition. x += 40 means x = x + 40. x++ means add one.','A nested loop is one loop inside another. Here, for each y row we visit every x column. That is the basic pattern for inspecting an image. Use < rather than <= when visiting array or pixel positions: the last valid integer x is width - 1.','Keep a positive step and ensure the counter changes toward the end condition. A loop that never ends can freeze its preview. If you create one while practicing, stop or reload the preview and restore the increment.'],
 lines:[
  ['function setup() {','Run this grid once.'],
  ['  createCanvas(320, 240);','Create a canvas whose dimensions divide neatly by 40.'],
  ['  background(240);','Clear the canvas.'],
  ['  noStroke();','Remove outlines from dots.'],
  ['  fill(45, 130, 150);','Choose one color for all dots.'],
  ['  for (let y = 20; y < height; y += 40) {','Begin row centers at 20. Continue while y is below height. Add 40 after each complete row.'],
  ['    for (let x = 20; x < width; x += 40) {','For this row, begin at x=20 and move across in steps of 40. This whole inner loop runs again for every row.'],
  ['      circle(x, y, 18);','Draw one dot at the current column and row.'],
  ['    }','Finish the inner column loop.'],
  ['  }','Finish the outer row loop.'],
  ['}','Finish setup after all dots have been drawn.']
 ],predict:'How many columns and rows are there, and how many circles altogether?',expect:'Eight columns and six rows produce 48 circles. x takes values 20,60,100,140,180,220,260,300.',
 practice:[{task:'Change both steps from 40 to 80. Count the result.',hint:'Keep the starts at 20 for this comparison.',solution:'There are four columns and three rows, so 12 dots. Doubling both steps reduces the number to one quarter.'},{task:'Replace circles with 30 by 30 squares centered at the same grid points.',hint:'rect uses a corner by default.',solution:'Use rect(x - 15, y - 15, 30, 30). Subtracting half the side keeps the square centered at the original point.'},{task:'Use x to control the red channel and y to control the blue channel.',hint:'Move fill inside the inner loop and map each coordinate into 0..255.',solution:'Before the shape, use fill(map(x, 0, width, 0, 255), 80, map(y, 0, height, 0, 255)). Each dot now has a color related to its position.'}],check:[{q:'Which loop must finish for y to increase?',a:'The complete inner x loop.'},{q:'If width is 320, is x=320 a valid image pixel column?',a:'No. Integer pixel columns are 0 through 319.'}],refs:['https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for']
},
{
 id:'08-collections',title:'Store lists and related information',minutes:35,stage:'Foundations',diagram:'arrays',
 intro:['An array is an ordered list. Its positions, called indices, start at zero. The first item is list[0]. list.length reports how many items exist, so the last valid index is list.length - 1. Square brackets create arrays and access their items.','An object groups named properties. A dot accesses a property such as spot.x. Curly braces can define an object as well as a function block; their meaning depends on the surrounding expression. Lists of objects let you describe many positions without inventing a separate variable for each one.','In later pixel work, pixels is a long array of numbers. In time-delay video, an array can hold captured frames, but each retained image costs memory. Keep the number of stored frames bounded.'],
 lines:[
  ['const spots = [','Start an array stored under the name spots. The constant binding will continue to refer to this array.'],
  ['  { x: 70, y: 120, size: 30 },','The first item is an object with named x, y, and size properties. The colon separates a property name from its value; the comma separates items.'],
  ['  { x: 160, y: 120, size: 60 },','The second item is another object. It is at index 1, not index 2.'],
  ['  { x: 250, y: 120, size: 90 }','The third and last object is at index 2.'],
  ['];','Close the array and finish its declaration.'],
  ['function setup() {','Start setup.'],
  ['  createCanvas(320, 240);','Create the canvas.'],
  ['  background(240);','Clear the canvas.'],
  ['  fill(210, 110, 50);','Choose orange.'],
  ['  for (let i = 0; i < spots.length; i++) {','Visit each item, from index 0 up to but not including the array length. Increase i by one after each visit.'],
  ['    const spot = spots[i];','Read the object at the current index and name it spot for this loop iteration.'],
  ['    circle(spot.x, spot.y, spot.size);','Read the object\'s three named properties and use them to draw one circle.'],
  ['  }','End the loop.'],
  ['}','Finish setup.']
 ],predict:'What are spots.length and the last valid index?',expect:'Three orange circles with diameters 30,60,90. The list length is 3; its last index is 2.',
 practice:[{task:'Change only the second object so its circle moves to y=60.',hint:'The second item is spots[1]. You can edit its y property in the data.',solution:'Change its object to { x: 160, y: 60, size: 60 }. Other circles stay in place.'},{task:'Add a fourth item and let the loop draw it automatically.',hint:'Add a comma after the current last object before inserting a new one.',solution:'Add { x: 160, y: 200, size: 25 }. The loop reads spots.length, which is now 4, so it includes the new item.'},{task:'Read spots[3] in the original three-item list. Explain the result without trying to draw it.',hint:'The fourth item is beyond the last valid index.',solution:'It gives undefined, meaning no value exists there. Trying to read undefined.x causes an error. The i < spots.length condition prevents this in the loop.'}],check:[{q:'What is the first index?',a:'Zero.'},{q:'Does const make every property of an object or array unchangeable?',a:'No. It prevents reassigning the binding. The contents can still be changed.'}],refs:['https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Arrays','https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_basics']
},
{
 id:'09-color',title:'Use color to direct attention',minutes:40,stage:'Foundations',diagram:'color',
 intro:['RGB mixes red, green, and blue light. HSB separates hue (color family), saturation (intensity), and brightness (lightness within this model). Alpha controls opacity. We set ranges explicitly so the numbers have a clear meaning. A fully saturated color can still be dark; saturation and brightness are different controls.','Complementary hues sit opposite each other around a hue circle. Analogous hues are neighbors. A useful experiment is to keep the object constant and change its surrounding color: appearance depends on context. Compare your perception and record observations rather than assuming one palette always attracts attention.','Raw image pixel arrays remain RGBA even when colorMode is HSB. Convert or extract color properties deliberately if your image algorithm needs hue or saturation. This lesson changes drawing settings; later lessons change source image colors.'],
 lines:[
  ['function setup() {','Start setup.'],
  ['  createCanvas(320, 240);','Create the canvas.'],
  ['  colorMode(HSB, 360, 100, 100, 1);','Interpret future color inputs as hue 0..360, saturation 0..100, brightness 0..100, alpha 0..1. This makes the chosen scale explicit.'],
  ['  background(210, 35, 25);','Paint a dark, slightly saturated blue background.'],
  ['  noStroke();','Remove shape outlines so color blocks can be compared.'],
  ['  fill(30, 90, 90);','Choose a bright saturated orange.'],
  ['  rect(40, 60, 100, 120);','Draw the orange block on the left.'],
  ['  fill(30, 15, 90);','Keep hue and brightness, but reduce saturation.'],
  ['  rect(180, 60, 100, 120);','Draw the less saturated block on the right.'],
  ['}','Finish setup.']
 ],predict:'Will both blocks share the same brightness input even though they look different?',expect:'Two blocks share hue=30 and brightness=90. Their saturation differs: 90 on the left and 15 on the right.',
 practice:[{task:'Keep saturation fixed at 90 and compare brightness 90 versus 30.',hint:'First set the second block saturation to 90, matching the first block. Then change only its brightness, the third fill input, from 90 to 30.',solution:'Use fill(30, 90, 30) before the right block. Both blocks now have hue 30 and saturation 90; only brightness differs. Compare how darkness differs from the original desaturation.'},{task:'Compare orange against both a blue and an orange background.',hint:'Change only the hue in background while keeping the blocks unchanged.',solution:'Run with background(210,35,25), then background(30,35,25). Write where your attention goes first in each version. This is an observation exercise with no mandatory perceptual answer.'},{task:'Create one experiment changing only hue, one only saturation, and one only brightness. Record actual observations.',hint:'Save screenshots or separate sketches so the comparison is reliable.',solution:'For example compare H=30/210 at S=90,B=90; compare S=15/90 at H=30,B=90; compare B=30/90 at H=30,S=90. Record which visual property changed and what you noticed.'}],check:[{q:'Does colorMode(HSB) turn pixels[] into hue values?',a:'No. pixels[] stays RGBA.'},{q:'Why change only one variable during an experiment?',a:'It makes the relationship between the rule and its effect easier to identify.'}],refs:['https://p5js.org/reference/p5/colorMode/','https://p5js.org/reference/p5/fill/','https://github.com/ITPNYU/ICM-2026-Media/blob/main/weeks/02_pixels.md']
}
];
