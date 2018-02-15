

//App Requirements
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var moment = require('moment');
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

//App configuration
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
moment().format('MMMM Do YYYY, h:mm:ss a');

// MongoDB configuration
// Step 1: Connect is used to connect to the existing db or create a db with the name specified
// Step 2: Create a Schema using mongoose.Schema
// Step 3: Create a model for the Schema using .model() function
mongoose.connect("mongodb://localhost/blogApp");
var BlogSchema = mongoose.Schema({
  title: String,
  image: String,
  created: {type: Date, default: Date.now},
  body: String
});
var blog = mongoose.model("blog", BlogSchema);

//Creating test data
// blog.create({
//   title: "First Test Blog",
//   image: "https://farm5.staticflickr.com/4265/35446305380_93d4fd86ce.jpg",
//   body: "This is the test blog post created initially. It is done using the modelname.create function"
// }, function(err, blog){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Succesfully Created");
//   }
// });

// Index route
app.get("/", function(req, res){
  res.redirect("/blog");
});

app.get("/blog", function(req, res){
  blog.find({}, function(err, all){
    if(err){
      console.log(err);
    }else {
      res. render("index", {all: all});
    }
  });
});

// New route
app.get("/blog/new", function(req, res){
  res.render("new");
});

//Create route
app.post("/blog", function(req, res){
  var title = req.body.title;
  var image = req.body.image;
  var body = req.body.body;
  body = req.sanitize(body);
  var dblog = {title: title, image: image, body: body};
  blog.create(dblog, function(err, nblog){
    if(err){
      res.render("new");
    }
    else {
      res.redirect("/blog");
    }
  });
});

// Show route
app.get("/blog/:id", function(req, res){
  blog.findById(req.params.id, function(err, fblog){
    if(err){
      console.log(err);
    }  else {
      res.render("show", {blog: fblog});
    }
  });
});

// Edit route
app.get("/blog/:id/edit", function(req, res){
  blog.findById(req.params.id, function(err, fblog){
    if(err){
      console.log(err);
    }else{
      res.render("edit", {blog: fblog});
    }
  });
});

app.put("/blog/:id", function(req, res){
  var title = req.body.title;
  var image = req.body.image;
  var body = req.body.body;
  body = req.sanitize(body);
  var dblog = {title: title, image: image, body: body};
  blog.findByIdAndUpdate(req.params.id, dblog, function(err, fblog){
    if(err){
      console.log(err);
    }else{
      res.redirect("/blog/" + req.params.id);
    }
  });
});

// Delete Route
app.delete("/blog/:id", function(req, res){
  blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blog");
    }else{
      res.redirect("/blog");
    }
  });
});

//Specify the port to connect
app.listen("3000", function(){
  console.log("Server started at 3000");
});
