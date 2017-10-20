var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");

// Create the structure of campgrounds in db
var campgroundShema = new mongoose.Schema({
    "name": String,
    "image": String,
    "description": String
});

// Create/use "campgrounds" db in mongodb - we refer to is as "Campground" in this file even though it is "campgrounds" in our db.
var Campground = mongoose.model("Campground", campgroundShema);

// Campground.create({
//     name: "Green Wonderland",
//     image: "https://s-i.huffpost.com/gen/1283372/images/o-NEW-ZEALAND-facebook.jpg",
//     description: "Unbelievably green and wonderful."
// }, function(err, newlyCreated){
//     if(err){
//         console.log(err)
//     }else{
//         console.log("sucess");
//     }
// });

app.get("/", function(req, res){
   res.render("landingpage"); 
});

// INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("index", {campgrounds:allCampgrounds});
        }
    });
});

//CREATE - Add new campground to database
app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else {
            res.redirect("/campgrounds");
        }
    });
    
});

// NEW - Get form to create new campground
// Important to have this above the "SHOW" route so that "new" isn't mistaken for an id
app.get("/campgrounds/new", function(req, res){
    res.render("newCampground");
});

// SHOW - Shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err)
        }else{
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server has started');
});

    
