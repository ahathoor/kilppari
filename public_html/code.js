/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var enhanceTextArea = function() {
    $("textarea").keydown(function(e) {
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
    var color = "rgb(255,255,0)";

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
        return my;
    };

    my.run = function() {
        eval($(codebox).val());
    };
    my.color = function(new_color, x) {
        if (new_color === "random" || !new_color) {
            new_color = "rgb(" +
                    Math.floor(255 * Math.random()) + "," +
                    Math.floor(255 * Math.random()) + "," +
                    Math.floor(255 * Math.random()) +
                    ")";
        }
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
        if (penDown) {
            ctx.beginPath();
            ctx.moveTo(pos[0] + 0, pos[1] + 0);
        }
        pos[0] += Math.sin(angle) * amount;
        pos[1] += Math.cos(angle) * amount;
        if (penDown) {
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
    my.center = function() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        pos = [w / 2, h / 2];
    };
    return my;
})();

var STEPPINGTURTLE = function() {
    var queue = new Array();
    var speed = 1000;
    var my = {};
    var turtle = undefined;
    var interval;

    my.start = function() {
        setInterval(step, 5);
    };
    my.stop = function() {
        clearInterval(interval);
        queue = new Array();
        forwardRunner.reset();
    };
    my.setTurtle = function(t) {
        turtle = t;
    };
    var step = function() {
        forwardRunner.charge();
        if (forwardRunner.working()) {
            forwardRunner.work(); // Unfinished business
        }
        if(queue.length === 0) {
            forwardRunner.reset();
        }
        while (queue.length !== 0 && forwardRunner.hasCharge()) {
            var command = queue.shift();
            switch (command.command) {
                case "forward":
                    forwardRunner.giveWork(command.amount);
                    forwardRunner.work();
                    break;
                case "left":
                    turtle.left(command.amount);
                    break;
                case "right":
                    turtle.right(command.amount);
                    break;
                case "up":
                    turtle.up();
                    break;
                case "down":
                    turtle.down();
                    break;
                case "clear":
                    turtle.clear();
                    break;
                case "fade":
                    turtle.fade(command.amount);
                    break;
                case "color":
                    turtle.color(command.color);
                    break;
                case "center":
                    turtle.center();
                    break;
            }
        }
    };
    var forwardRunner = (function() {
        var my = {};
        var toGo = 0;
        var went = 0;
        var lastTick;
        var charge = 0;
        my.charge = function() {
            var deltaT = Date.now() - lastTick;
            lastTick = Date.now();
            charge = (speed * deltaT) / 1000;
        };
        my.work = function() {
            if (charge + went > toGo) {
                turtle.forward(toGo);
                charge -= toGo;
                toGo = 0;
            } else {
                turtle.forward(charge);
                toGo -= charge;
                charge = 0;
            }
        };
        my.working = function() {
            return (toGo > 0);
        };
        my.hasCharge = function() {
            return (charge > 0);
        };
        my.giveWork = function(amount) {
            toGo = amount;
        };
        my.reset = function() {
            charge = 0;
            toGo = 0;
            lastTick = undefined;
        };
        return my;
    })();
    my.setSpeed = function(s) {
        speed = s;
    };
    my.up = function() {
        queue.push({command: "up"});
    };
    my.down = function() {
        queue.push({command: "down"});
    };
    my.forward = function(amount) {
        queue.push({command: "forward", amount: amount});
    };
    my.right = function(amount) {
        queue.push({command: "right", amount: amount});
    };
    my.left = function(amount) {
        queue.push({command: "left", amount: amount});
    };
    my.clear = function() {
        queue.push({command: "clear"});
    };
    my.fade = function(amount) {
        queue.push({command: "fade", amount: amount});
    };
    my.color = function(color) {
        queue.push({command: "color", color: color});
    };
    my.center = function() {
        queue.push({command: "center"});
    };
    return my;
}();

$("body").ready(function() {
    enhanceTextArea();
    TURTLE.initialize("code", "canvas");
    STEPPINGTURTLE.setTurtle(TURTLE);
    turtle = TURTLE;
    if (document.location.pathname !== "/") {
        $.get('/retrieve' + document.location.pathname, function(data) {
            $("#code").val(data);
        });
    }
    $("#hidecode").click(function() {
        $("#code").toggle();
        $("#codetitle").toggle();
        $("input").toggle();
        $("#ghlink").toggle();
    });
});

var speed = function(speed) {
    if (!speed || speed === 0) {
        turtle = TURTLE;
        STEPPINGTURTLE.stop();
    }
    else {
        STEPPINGTURTLE.setSpeed(speed);
        if (turtle !== STEPPINGTURTLE) {
            turtle = STEPPINGTURTLE;
            STEPPINGTURTLE.start();
        }
    }
};

var f = function(x) {
    turtle.forward(x);
};
var r = function(x) {
    turtle.right(x);
};
var l = function(x) {
    turtle.left(x);
};
var c = function(x) {
    turtle.color(x);
};
var d = function() {
    turtle.down();
};
var u = function() {
    turtle.up();
};
var clear = function() {
    turtle.clear();
};
var fade = function(x) {
    turtle.fade(x);
};
var center = function() {
    turtle.center();
};
range = _.range;
var PI = Math.PI;


