/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var enhanceTextArea = function() {
        $("textarea").keydown(function(e) {
            localStorage.setItem("code",$(this).val());
            if (e.keyCode === 9) { // tab was pressed
                // get caret position/selection
                var start = this.selectionStart;
                var end = this.selectionEnd;

                var $this = $(this);
                var value = $this.val();

                // set textarea value to: text before caret + tab + text after caret
                $this.val(value.substring(0, start)
                        + "  "
                        + value.substring(end));

                // put caret at right position again (add one for the tab)
                this.selectionStart = this.selectionEnd = start + 1;

                // prevent the focus lose
                e.preventDefault();
            }
        });
    };

var TURTLE = (function() {
    
    var my = {};
    var codebox = undefined;
    var ctx = undefined;
    var pos = undefined;
    var angle = 0.0;
    var penDown = true;
    var color = "#FFFFFF";

    my.initialize = function(codebox_id,canvas_id) {
        $("#draggable").draggable();
        codebox = '#' + codebox_id;
        var canvas = document.getElementById(canvas_id);
        rescale = function() {
            var w = window.innerWidth;
            var h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
            my.clear();
            pos = [w / 2, h / 2];
        };
        ctx = canvas.getContext('2d');
        $(window).resize(rescale);
        rescale();
        return my;
    };
    
    my.run = function() {
        eval($(codebox).val());
    };
    my.color = function(new_color) {
        if (new_color === "random") {
            new_color = "rgb(" + 
                    Math.floor(255*Math.random()) + "," +
                    Math.floor(255*Math.random()) + "," +
                    Math.floor(255*Math.random()) +
                    ")";
        };
        color = new_color;
        ctx.strokeStyle = color;
    };
    my.clear = function() {
        my.fade(1);
    };
    my.fade = function(amount) {  
        ctx.fillStyle = 'rgba(0,0,0,' + amount + ')';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = color;
    };
    my.forward = function(amount) {
        if(penDown) {
            ctx.beginPath();
            ctx.moveTo(pos[0] + 0, pos[1] + 0);
        }
        pos[0] += Math.sin(angle) * amount;
        pos[1] += Math.cos(angle) * amount;
        if(penDown) {
            ctx.lineTo(pos[0], pos[1]);
            ctx.stroke();
            ctx.closePath();
        }
    };
    my.down = function() {
        penDown = true;
    };
    my.up = function() {
        penDown = false;
    };
    my.left = function(degrees) {
        angle += degrees / 180 * Math.PI;
    };
    my.right = function(degrees) {
        my.left(-degrees);
    };
    return my;
})();

var STEPPINGTURTLE = function() {
   var queue = new Array();
   var speed = 0.5;
   var my = {};
   
};

$("body").ready(function() {
    enhanceTextArea();
    TURTLE.initialize("code","canvas");
});

var f = function(x) {
    TURTLE.forward(x);
};
var r = function(x) {
    TURTLE.right(x);
};
var l = function(x) {
    TURTLE.left(x);
};
var c = function(x) {
    TURTLE.color(x);
};
var d = function() {
    TURTLE.down();
};
var u = function() {
    TURTLE.up();  
};
var clear = function() {
    TURTLE.clear();
};
var fade = function(x) {
    TURTLE.fade(x);
};


