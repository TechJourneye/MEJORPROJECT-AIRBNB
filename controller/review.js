const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview= async (req,res)=>{
    console.log(req.params.id)
    let listing=await Listing.findById(req.params.id);
    let review=new Review(req.body.review);
    review.author=req.user._id;
    listing.reviews.push(review);

    await listing.save();
    await review.save();
    req.flash("success"," Review Added!");
    res.redirect(`/listing/${req.params.id}`)
 }

 module.exports.destroyReview=async (req,res)=>{
     let {id,reviewId}=req.params;
      let listing=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})   ;
      let review=await Review.findByIdAndDelete(reviewId);
      req.flash("success","Review Deleted!!");
      res.redirect(`/listing/${req.params.id}`)
  }