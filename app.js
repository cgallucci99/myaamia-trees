var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();

mongoose.connect('mongodb+srv://camg:201009@testing-kfdro.mongodb.net/trees?retryWrites=true', { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log(err);
    }
});

var treeSchema = new mongoose.Schema({
    english_name: String,
    myaamia_name: String,
    latin_name: String,
    location: String,
    description: String,
    img: String
});
var Tree = mongoose.model("Tree", treeSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.render("index");
});

app.get("/trees", function (req, res) {
    Tree.find({},function (err,trees) {
        if (err) {
            console.log(err);
        } else {
            res.render("trees",{trees:trees});
        }
    });
});

app.get("/tree/:name", function(req,res) {
    Tree.findOne({english_name: req.params.name}, function (err, foundTree){
        if (err) {
            console.log(err);
        } else {
            res.render("tree",{tree:foundTree});
        }
    });
});

app.post("/search", function (req, res) {
    Tree.find({$text: {$search: req.body.q},}, function (err, trees){
        if (err) {
            console.log(err);
        } else {
            res.render("trees",{trees:trees});
        }
    })
});

app.get("/addTree", function(req, res){
    res.render("create");
});

app.post("/addTree", function(req, res) {
    Tree.create(req.body.tree, function(err, newTree) {
        if(err) {
            res.render("create");
        } else {
            res.redirect("/trees");
        }
    });
});

app.get("*", function (req, res) {
    res.render("not-found");
});

var port = process.env.PORT || 3000;

app.listen(port, process.env.IP, function() {
    console.log("app is running on port " + port);
});