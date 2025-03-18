

import express from 'express';
import userRoute from './userRoute.js';
import taskRoute from './taskRoute.js';


const router=express.Router();

router.use("/user",userRoute)//api/user/login
router.use("/task",taskRoute);








export default router;