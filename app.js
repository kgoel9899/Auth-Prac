var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var PORT = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://test:test123@ds231961.mlab.com:31961/kshdb", { useNewUrlParser: true });

//Use auth-routes


//PASSPORT CONFIG

//express-session
app.use(require("express-session")({
  secret: "Authentication done",
  resave: false,
  saveUninitialized: false
}));

//must use lines
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});


// var schema = new mongoose.Schema({
//   name: String,
//   image: String,
//   description: String
// });
//
// var Campground = mongoose.model("Campground", schema);
// moved --

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

app.get("/campgrounds", isLoggedIn, function(req, res) {
  console.log(req.user);
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {campgrounds: allCampgrounds, currentUser: req.user});
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

app.get("/campgrounds/new", isLoggedIn, function(req, res) {
  res.render("new");
});

app.get("/campgrounds/:id", isLoggedIn, function(req, res) {
  console.log(req.params.id);
  Campground.findById(req.params.id, function(err, found) {
    if(err) {
      console.log(err);
    } else {
      res.render("show", {campground: found});
    }
  });
});

//AUTHENTICATION STARTING

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if(err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

app.get("/login", function(req, res) {
  res.render("login");
});

//Middleware
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res) {
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) {
    console.log("Came1");
    return next();
  }
  console.log("Came1");
  res.redirect("/login");
}

app.listen(PORT, function(){
  console.log("Server started");
});
