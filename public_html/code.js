/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var TURTLE = (function() {
    var my = {};
    var codebox = undefined;
    var ctx = undefined;
    var pos = undefined;
    var angle = 0.0;
    var color = "#FFFFFF";

    var fixTab = function() {
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
                        + "\t"
                        + value.substring(end));

                // put caret at right position again (add one for the tab)
                this.selectionStart = this.selectionEnd = start + 1;

                // prevent the focus lose
                e.preventDefault();
            }
        });
    };

    my.initialize = function(codebox_id, canvas_id) {
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
        fixTab();
    };
    my.run = function() {
        eval($(codebox).val());
    };
    my.color = function(new_color) {
        ctx.strokeStyle = color;
        color = new_color;
    };
    my.clear = function() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = color;
    };
    my.forward = function(amount) {
        ctx.beginPath();
        ctx.moveTo(pos[0] + 0, pos[1] + 0);
        pos[0] += Math.sin(angle) * amount;
        pos[1] += Math.cos(angle) * amount;
        ctx.lineTo(pos[0], pos[1]);
        ctx.stroke();
        ctx.closePath();
    };
    my.left = function(degrees) {
        angle += degrees / 180 * Math.PI;
    };
    my.right = function(degrees) {
        my.left(-degrees);
    };
    return my;
})();

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
var clear = function() {
    TURTLE.clear();
};


