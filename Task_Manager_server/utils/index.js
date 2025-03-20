import mongoose from "mongoose";
import jwt from "jsonwebtoken"


const dbConnection=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("DB is connected")
    }
    catch(error){
        console.log("DB Error:"+error);
    }
};

export default dbConnection;


export const createJWT=(res,userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expires:"Id",
    });

    res.cookie("token",token,{
        httpOnly:true,
        secure:ProcessingInstruction.env.NODE_ENV!="development",
        samesite:"strick",
        maxAge:1*24*60*60*1000,//1 day

    });
}