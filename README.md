Turtle graphics in HTML5 & node
===

### Overview
![Screenshot](http://i.imgur.com/ndEKLLZ.png)

JS turtle fiddle draws turtle graphics using JavaScript and canvas from user supplied code.
The project also contains a small server that can be used to save and share the code snippets.

I have a copy hosted at http://188.166.135.82/html/turtlefiddle/index.html

### Usage

The turtle code is just JavaScript code that is evaluated when the user presses the run button. The turtle can be steered using the following commands:

     f(x)         moves the turtle forwards by x
     r(x), l(x)   turn the turtle x degrees clockwise and counterclockwise
     u(), d()     raise and lower the turtle's tail
     c(x)         set the color of the drawn line. Valid formats for x: *'red'*, *'rgba(43,255,12,0.5)'*
     c()          sets a random color
     clear()      clears the screen
     fade(x)      fades the screen by x*100 percent
     center()     centers the turtle
     speed(0)     instantaneous drawning. 
     speed(x>0)   The drawing speed is set to x pixels per second.
                  

### Server

To run the server, install Node.js and issue the commands

    npm install
    node server.js

at project the project folder. Then navigate to http://localhost:5000 with your browser.


