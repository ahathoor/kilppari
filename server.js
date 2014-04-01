var express = require("express");
var logfmt = require("logfmt");
var fs = require('fs');

var mongoUri = process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        'mongodb://localhost/mydb';
var mongoose = require('mongoose');
mongoose.connect(mongoUri);
var ObjectID = require('mongodb').ObjectID;
var Code = mongoose.model('Code', {code: String});
ObjectId = mongoose.Types.ObjectId;

var codes = {};
var nextIndex = 0;
var app = express();

app.use(logfmt.requestLogger());
app.use(express.urlencoded());
app.use("/js", express.static(__dirname + "/public_html/js"));

app.get('/', function(req, res) {
    res.sendfile('public_html/index.html');
});

app.get('/code.js', function(req, res) {
    res.sendfile('public_html/code.js');
});

app.get('/style.css', function(req, res) {
    res.sendfile('public_html/style.css');
});

app.get('/:id', function(req, res) {
    res.sendfile('public_html/index.html');
});

app.get('/retrieve/:id', function(req, res) {
    var id = ObjectId(req.params.id);
    Code.find({"_id": id}, function(err, rs) {
        if (!rs)
            res.json("Not found");
        else
            res.json(rs[0].code);
    });
});

app.post('/save', function(req, res) {
    var code = new Code({code: req.body.code});
    code.save(function(err) {
        if (!err)
            res.redirect("/" + code._id);
    })
});

var port = Number(process.env.PORT || 5000);
var startListening = function() {
    app.listen(port, function() {
        console.log("Listening on " + port);
    });
};

startListening();