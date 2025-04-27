const User=require("../models/user");

module.exports.signUpForm=(req,res)=>{
    res.render("users/signup")
}

module.exports.signUp=async (req,res)=>{
    try{
        let {email,username,password}=req.body;
        const newUser= new User({email, username});
        let registeredUser=await User.register(newUser,password);

        req.login(registeredUser,(err)=>{
            if(err) {
                console.log(err);
                return next(err)
            } ;
            req.flash("success","Welcome to Wanderlust!")
            res.redirect("/listing");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

}

module.exports.loginForm=(req,res)=>{
    res.render("users/login");
}

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome back to wanderlust!!");
    let redirectUrl=res.locals.redirectUrl ||"/listing";
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err) {return next()};
        req.flash("success","Logged out successfully");
        return res.redirect("/listing");
    })

}