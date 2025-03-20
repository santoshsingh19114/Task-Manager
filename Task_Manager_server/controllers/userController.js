import Notice from "../models/notification.js";
import User from "../models/user.js";
import { createJWT } from "../utils/index.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin, role, title } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        status: false,
        msg: "User already exist",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      role,
      title,
    });

    if (user) {
      isAdmin ? createJWT(req, user._id) : null;

      user.password = undefined;

      res.status(201).json(user);
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid  user data" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, message: "Error registering user" });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }

    if (!user?.isActive) {
      return res.status(401).json({
        status: false,
        message: "Your account is not active, please contact the admin",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (user && isMatch) {
      createJWT(res, user._id);
      user.password = undefined;

      res.status(200).json(user);
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(400).json({ status: false, message: "Error login user" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "logout successful" });
  } catch (error) {
    return res.status(400).json({ status: false, message: "Error logoutUser" });
  }
};

export const getTeamList = async (req, res) => {
  try {
    const users = await user.find().select("name title role email isActive");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "Error getTeamList " });
  }
};

export const getNotificationList = async (req, res) => {
  try {
    const { userId } = req.user;

    const notice = await Notice.find({
      team: userId,
      isRead: { $nin: [userId] },
    }).populate("task", "title");
    res.status(201).json(notice);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "Error getNotificationList " });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { _id } = req.body;

    const id =
      isAdmin && userId === _id
        ? userId
        : isAdmin && userId !== _id
        ? _id
        : userId;

    const user = await User.findById(id);

    if (user) {
      user.name = req.body.name || user.name;
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;

      const updatedUser = await User.Save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: "profile updated successfully",
        user: updatedUser,
      });
    }
    else{
        return res
      .status(404)
      .json({ status: false, message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ status: false, message:error.message });
  }
};

export const markNotificatonRead =async(req,res)=>{
    try{
        const userId=req.user;

        const {isReadType,id}=req.query;

        if(isReadType=="all"){
            await Notice.updateMany({team:userId,isRead:{$nin:[userId]}, 
            $push:{isRead:userId}},
            {new:true}
        );
        }else{
            awaitNotice.findOneAndUpdate(
                {_id:id,isRead:{$nin:[userId]}},
                {$push:{isRead:userId}},
                {new:true}
            );
        }

        res.status(201).json({status:true,message:"Done"});
    }
    catch(error){
        console.log(error);
       return res.status(400).json({status:false,message:"Error markNotificatonRead"})
    }
};



export const changeUserPassword =async(req,res)=>{
    try{
        const {userId}=req.user;
        const user=await User.findById(userId);

        if(user){
            user.password=req.body.password;
            await user.save();
            user.password=undefined;
            res.status(201).json({
                status:true,
                message:'password changed successfully',
            });
        }
        else{
            res.status(404).json({status:false,message:"User not Found"});
        }


    }
    catch(error){
        console.log(error);
        return res.status(400).json({status:false,message:"Error changing password"})
      
    }
};


export const activateUserProfile =async(req,res)=>{
    try{
        const {id}=req.params;

        const user=await User.findById(id);

        if(user){
            user.isActive=req.body.isActive; //!user,isActive
            await user.save();
            
            res.status(201).json({
                status:true,
                message:`user account has been ${user?.isActive?"activated":"disabled"}`,
            });
        }
        else{
            res.status(404).json({status:false,message:"User not Found"});
        }


    }
    catch(error){
       return res.status(400).json({status:false,message:error.message});
    }
};


export const deleteUserProfile =async(req,res)=>{
    try{
        const {id}=req.params;
        await User.findByIdAndDelete(id);

        res
        .status(200)
        .json({status:true,message:"User deleted successfully"});


    }
    catch(error){
       return res.status(400).json({status:false,message:error.message})
    }
};
