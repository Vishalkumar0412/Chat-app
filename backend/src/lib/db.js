import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({})
const connectDB=async()=>{
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("db is connected");
        
    }).catch((err)=>{
        console.log(err,"Fail to connect db");
        
    })
}
export default connectDB;