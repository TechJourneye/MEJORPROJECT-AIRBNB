const express=require("express");
const { route } = require("./listing");
const User=require("../models/user")
const wrapAsync=require("../utils/WrapAsync");
const passport = require("passport");
const { savedUrl } = require("../middleware");
const userController=require("../controller/user");

const router=express.Router({mergeParams:true});

router.route("/signup")
.get(userController.signUpForm)
.post( wrapAsync(userController.signUp));
//log in route
router.route("/login")
.get(userController.loginForm)
.post(savedUrl,    
passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }), userController.login)

router.get("/logout", userController.logout);
module.exports=router;