const Listing=require("./models/listing");
const Review=require("./models/review.js");

const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}= require("./Schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You have to log in");
    return res.redirect("/login");
  }
  next();
}  

module.exports.savedUrl=(req,res,next)=>{
   if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
   }
   next();
}

module.exports.isOwner= async (req,res,next)=>{
   let {id}=req.params;
    let listing=  await Listing.findById(id);
    if( res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)){
     req.flash("error"," you have no permission to access this part")
     return res.redirect(`/listing/${id}`);
  }
  next();
}

module.exports.isOwnerReview= async (req,res,next)=>{
  let {id,reviewId}=req.params;
   let review= await Review.findById(reviewId)  ;
   if( res.locals.currUser && !review.author.equals(res.locals.currUser._id)){
    req.flash("error"," you are not owner of this review!!")
    return res.redirect(`/listing/${id}`);
 }
 next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
     