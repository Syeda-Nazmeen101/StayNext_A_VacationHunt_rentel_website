// const express = require("express");
// const app = express();
// const users = require("./routes/users.js");
// const posts = require("./routes/post.js");
// const cookieparser = require("cookie-parser");

// //parser
// // app.use(cookieparser());

// // app.get("/getcookies",(req,res)=>{
// //     res.cookie("greet","hello");
// //     res.cookie("madeIn","india");
// //     res.send("We send you a cookie");
// // });

// //signed cookies
// app.use(cookieparser("secretcode"));

// app.get("/getcookies",(req,res)=>{
//     res.cookie("color","red",{signed : true});
//     res.send("done");
// });

// //verify 
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });


// app.get("/",(req,res)=>{
//     console.log(req.cookies);
//     res.send("hi,iam in root");
// });

// app.use("/users",users);
// app.use("/posts",posts);

// app.listen(3000,()=>{
//     console.log("server is running");
// });

//Express session

const express = require("express");
const app = express();
const users = require("./routes/users.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions = {
    secret:"mysupersecretstring", 
    resave:false, 
    saveUninitialized:true
};
app.use(session(sessionOptions));
app.use(flash());

//res locals in middelware
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name
    if(name === "anonymous"){
        req.flash("error","some error occured");
    }else{
    req.flash("success","user registered successfully");
    }
    // res.send(name);
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    // res.send(`Hello ${req.session.name} Welcome to your courses`);
    
    res.render("page.ejs",{name : req.session.name});

});

    // app.get("/reqcount",(req,res)=>{
    //     req.session.count = 1;
    //     res.send(`you req the site ${req.session.count} time`);
    // });

app.get("/test",(req,res)=>{
    res.send("test successful");
});

app.listen(3000,()=>{
    console.log("server is running");
});
