const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {reviewSchema}= require("../Schema.js");
const WrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { isLoggedIn, isOwnerReview } = require("../middleware.js");
const ReviewController=require("../controller/review.js");



const validateReviews=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// Review Route
router.post("/",isLoggedIn, validateReviews,WrapAsync(ReviewController.createReview));
 //deleting review route
router.delete("/:reviewId",isLoggedIn, isOwnerReview, WrapAsync (ReviewController.destroyReview))

 module.exports=router;