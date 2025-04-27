const Listing=require("../models/listing");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    let allListings=await Listing.find();
    res.render("listings/index",{allListings});
}

module.exports.createListingroute=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListinginDetails=async (req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author",}})
    .populate("owner");

    if(!listing){
       req.flash("error","Listing you are trying to access doesn't  exists" )
       return res.redirect("/listing");
    }
    res.render("listings/show.ejs",{listing});
}
//post route
module.exports.createListing=async (req,res)=>{
   
    let response= await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
      .send()
  console.log(response.body.features[0].geometry);
//   return res.send("done");
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,filename);
    let listing=new Listing(req.body.listing);
     listing.img={url,filename};
    listing.owner=req.user._id;
    listing.geometry=response.body.features[0].geometry;
     listing=await  listing.save()   
   console.log(listing);

    req.flash("success","New Listing Created!");
    res.redirect(`/listing/${listing._id}`);   
}

module.exports.editFormforListing=async (req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are trying to access doesn't  exists" )
        res.redirect("/listing")
     }
    res.render("listings/edit.ejs",{listing});
}

module.exports.editRoute=async (req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.img={url,filename};
        console.log(req.body.listing);
         await listing.save();
    }

    req.flash("success"," Listing Updated!");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyRoute=async (req,res)=>{
    let {id}=req.params;
    let listing =await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listing");
    
 }