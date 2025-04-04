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


// export const createJWT=(res,userId)=>{
//     const token=jwt.sign({userId},process.env.JWT_SECRET,{
//         expires:"1d",
//     });

//     res.cookie("token",token,{
//         httpOnly:true,
//         secure:process.env.NODE_ENV!="development",
//         samesite:"Strict",
//         maxAge:1*24*60*60*1000,//1 day

//     });


// }



export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
