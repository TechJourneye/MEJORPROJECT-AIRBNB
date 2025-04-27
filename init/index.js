const mongoose =require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const initData=require("./data.js");
const Listing=require("../models/listing.js")

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then((res)=>{
    console.log("Connection with DB Successful");
}).catch(e=>{
    console.log(e);
})

const initDb= async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,owner:"680a23de10c76cba30bc7232"}));
    await Listing.insertMany(initData.data);
   console.log("data initialized");
}

initDb();
