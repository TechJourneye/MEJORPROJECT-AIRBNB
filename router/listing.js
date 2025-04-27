const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const {listingSchema, reviewSchema}= require("../Schema.js");
const WrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const  listingController=require("../controller/listing.js")

const multer  = require("multer")
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })


//index route
router.route("/")
.get(WrapAsync(listingController.index))
.post(  isLoggedIn, upload.single("listing[img]"),validateListing,  WrapAsync(listingController.createListing));
// .post(  upload.single("listing[img]"),(req,res)=>{
//     console.log(req.file);
//     res.send(req.file);
// })
//create route
router.get("/new", isLoggedIn,listingController.createListingroute);

//show route
router.route("/:id")
.get( WrapAsync(listingController.showListinginDetails))
.put(isOwner, isLoggedIn,upload.single("listing[img]"), validateListing, WrapAsync(listingController.editRoute))
.delete( isOwner,isLoggedIn, WrapAsync(listingController.destroyRoute));
// Create Route


//edit & update route
router.get("/:id/edit", isOwner, isLoggedIn, WrapAsync(listingController.editFormforListing));


//  Delete route


module.exports=router;