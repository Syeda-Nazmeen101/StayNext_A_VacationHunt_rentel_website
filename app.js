if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}

// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");

const listingsrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret : "mysupersecretsession",
    resave:false,
    saveUninitialized: true,
    cookie : {
        // expires: new Date(Date.now() + 7 * 24 * 60 * 60 *1000),
        maxAge : 7 * 24 * 60 * 60 *1000,
        httpOnly : true
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then((res) =>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username:"sigma-student"
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listing", listingsrouter);
app.use("/listing/:id/reviews" ,reviewrouter);
app.use("/",userrouter);

// app.get("/",(req,res)=>{
//     res.send("iam in root");
// });

// app.get("/testlisting",async(req,res)=>{
//     let sampleListing = new Listing({
//        title: "My new Villa",
//        description: "By the beach",
//        price: 1200,
//        location : "Calangute goa",
//        country : "India"
//     });
//     await sampleListing.save();
//     console.log('sample was saves');
//     res.send('successful testing');
// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Somthing went wrong!"} = err;
    res.render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is working on port 8080");
});