const mongoose =require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review");
const User=require("./user") ;
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    img:{
        url:String,
        filename:String,
    },
    location:{
        type:String,
        required:true,
    },
    price:Number,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
})

listingSchema.post("findOneAndDelete",async ( listing)=>{
    if(listing){
      let res=await Review.deleteMany( {_id: { $in: listing.reviews}} );
    //   console.log(res);
    }
 })

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;