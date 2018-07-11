var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://test:test123@ds231961.mlab.com:31961/kshdb", { useNewUrlParser: true });

// var schema = new mongoose.Schema({
//   name: String,
//   image: String,
//   description: String
// });
//
// var Campground = mongoose.model("Campground", schema);

// Campground.create({
//   name: "Camping",
//   image: "https://farm8.staticflickr.com/7381/9705573948_3f342901d1.jpg",
//   description: "Camping photo"
// }, function(err, campground) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log("Created");
//   }
// });


// var campgrounds = [
//   {name: "Camping", image: "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?auto=compress&cs=tinysrgb&h=350"},
//   {name: "Camping", image: "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?auto=compress&cs=tinysrgb&h=350"},
//   {name: "Camping", image: "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?auto=compress&cs=tinysrgb&h=350"},
//   {name: "Camping", image: "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?auto=compress&cs=tinysrgb&h=350"},
//   {name: "Camping", image: "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?auto=compress&cs=tinysrgb&h=350"},
//   {name: "Camping", image: "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?auto=compress&cs=tinysrgb&h=350"}
// ]

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {campgrounds: allCampgrounds});
    }
  });
});

app.post("/campgrounds", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newOne = {name: name, image: image, description: description};
  // campgrounds.push(newOne);
  Campground.create(newOne, function(err, newlyCreated) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  })
  console.log("Sent a post req");
});

app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
  console.log(req.params.id);
  Campground.findById(req.params.id, function(err, found) {
    if(err) {
      console.log(err);
    } else {
      res.render("show", {campground: found});
    }
  });
});

app.listen(3000, function(){
  console.log("Server started");
});
