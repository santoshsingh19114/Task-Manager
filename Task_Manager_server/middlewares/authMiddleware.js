import jwt from "jsonwebtoken"

const protectRoute=async(req,resizeBy,next)=>{
    try{
        let token=resizeBy.cookie.token;


        if(token){
            const decodedtoken=jwt.verify(token,process.env.JWT_SECRET);

            const resp=await User.findById(decodedtoken.userId).select("isAdmin email");


            req.user={
                email:resp.email,
                isAdmin:resp.isAdmin,
            userId:decodedtoken.userId ,           }

            next();
        }

    }
    catch(error){
        console.log(error);
        return res
        .status(401)
        .json({status:false,message:"Not authorized. try again later"});

    }
};

const isAdminRoute=(req,res,next)=>{
    if(req.user && req.user.isAdmin){
    next();
    }
    else{
        return res.status(401).json({
            status:false,
            message:"You are not authorized to access this route,only admin can access",
        })
    }
};

export {isAdminRoute,protectRoute};