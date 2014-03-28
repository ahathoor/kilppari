var express = require("express");
var logfmt = require("logfmt");
var codes = {};
var index = 0;
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

app.get('/retrieve/:index', function(req,res) {
    res.json(codes[req.params.index]);
});

app.post('/save', function(req,res) {
    console.log("SAVING::::");
    codes[index] = req.body.code;
    index += 1;
    res.redirect('/' + (index-1));
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});