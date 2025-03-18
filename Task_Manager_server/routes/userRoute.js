import express from 'express';
import { isAdminRoute, protectRoute } from '../middlewares/authMiddleware.js';
import { registerUser } from '../controllers/userController.js';

// import { 
//     registerUser, 
//     loginUser, 
//     logoutUser, 
//     getTeamList, 
//     getNotificationList, 
//     updateUserProfile, 
//     markNotificatonRead, 
//     changeUserPassword, 
//     deleteUserProfile 
// } from "../controllers/userController.js";


const router=express.Router();

router.post("/register",registerUser)
// router.post("/login",loginUser)
// router.post("/logout",logoutUser)

// router.get("/get-team",protectRoute,isAdminRoute,getTeamList);
// router.get("/notifications",protectRoute,getNotificationList);

// router.put("/profile",protectRoute,updateUserProfile);
// router.put("/read-noti",protectRoute,markNotificatonRead);
// router.put("/change-password",protectRoute,changeUserPassword);

// // for admin only -Admin routes

// router
// .route("/:id")
// .put(protectRoute,isAdminRoute,getTeamList)
// .delete(protectRoute,isAdminRoute,deleteUserProfile);

export default router;