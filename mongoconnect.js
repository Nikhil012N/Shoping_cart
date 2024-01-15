require("dotenv").config()
const mongoose=require("mongoose");
const mongoUrl = process.env.MONGO_URL;

const MongoDbConnect=()=>{
    return mongoose.connect(mongoUrl,{
    
    })
}

module.exports=MongoDbConnect;