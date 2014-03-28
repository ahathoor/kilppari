var express = require("express");
var logfmt = require("logfmt");
var fs = require('fs');
var codes = {};
var nextIndex = 0;
var app = express();

app.use(logfmt.requestLogger());
app.use(express.urlencoded());
app.use("/js", express.static(__dirname + "/public_html/js"));

//app.get('/js/:path', function(req,res) {
//   res.sendFile('public_html/' + req.query.path); 
//});
app.get('/', function(req, res) {
    res.sendfile('public_html/index.html');
});

app.get('/code.js', function(req, res) {
    res.sendfile('public_html/code.js');
});

app.get('/style.css', function(req, res) {
    res.sendfile('public_html/style.css');
});

app.get('/:index', function(req, res) {
    res.sendfile('public_html/index.html');
});

app.get('/retrieve/:index', function(req, res) {
    if (codes[req.params.index])
        res.json(codes[req.params.index]);
    else
        res.json("NOT FOUND");
});

app.post('/save', function(req, res) {
    codes[nextIndex] = req.body.code;
    nextIndex += 1;
    save(nextIndex - 1);
    res.redirect('/' + (nextIndex - 1));
});

var save = function(i) {
    var path = 'server_save/' + i;
    fs.writeFile(path, codes[i]);
};

var port = Number(process.env.PORT || 5000);
var startListening = function() {
    app.listen(port, function() {
        console.log("Listening on " + port);
    });
};

var loadFile = function(i) {
    fs.readFile('server_save/' + i, 'utf-8', function(err, data) {
        if (err) {
            console.log("Loaded " + (i) + " saved elements");
            nextIndex = i;
            startListening();
        }
        else {
            codes[i] = data;
            loadFile(i + 1);
        }
    });
};
loadFile(0);