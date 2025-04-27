if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET); 
const express=require("express");
const app=express();
const mongoose =require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;
const path =require("path");
const methodOverride=require("method-override");
const EjsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./router/listing.js");
const reviewRouter=require("./router/review.js");
const userRouter=require("./router/user.js");

const cookieParser = require('cookie-parser')
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,
  })
  
  store.on("error",()=>{
   console.log("ERROR in MOngo session store", err);
  })

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash());
//Authentication part

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main() {
   await mongoose.connect(dbUrl);
}
main().then((res)=>{
    console.log("Connection with DB Successful");
}).catch(e=>{
    console.log(e);
})

app.use(cookieParser("cookie"))
app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",EjsMate);

app.use(express.static(path.join(__dirname,"/public")));

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/register",async (req,res)=>{
//     let fakeuser=new User({
//         email:"abc@gmail.com",
//         username:"demo",
//     })
//     let registerUser=await User.register(fakeuser,"hello");
//     res.send(registerUser);
// })
app.use("/", userRouter);
// listing route
app.use("/listing", listingRouter);
//Review route
app.use("/listing/:id/review", reviewRouter)


app.all("*", (req,res,next) => {
    next(new ExpressError(404,"page not fount"));
})
 
app.use((err,req,res,next)=>{
    let{status=400,message="Something Went Wrong"}=err; 
     res.status(status).render("error.ejs",{err});
  
})
// app.get("/",(req,res)=>{
//     res.send("Hi i am root");
// })

app.listen(8080,()=>{
    console.log("Server have started");
})