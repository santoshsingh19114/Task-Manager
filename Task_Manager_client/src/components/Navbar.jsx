import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  setOpenSidebar } from "../redux/slices/authSlice";
import { MdOutlineSearch } from "react-icons/md";
import UserAvatar from "./UserAvatar";
import Notification from "./Notification";
import { user } from "../assets/data";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // useEffect(()=>{
  //   console.log( "user is **********-----------" ,user)
  //   dispatch(setCredentials(user))
  // },[])
  

  return (
    <div className="flex justify-between items-center bg-white px-4 py-3 2xl:py-4 sticky z-10 top-0">


       <div className="flex gap-4">
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className="text:2xl tetx-grey-500 block md:hidden"
        >
          =
        </button>

        <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]">
            <MdOutlineSearch className="text-grey-500 text-xl"/>

            <input type="text" placeholder="search..." className=" flex-1 outline-none bg-transparent placeholder:text-grey-500 text-grey-800 "/>

        </div>
       </div>

       <div className="flex gap-2 items-center">
        <Notification/>

        <UserAvatar />
       </div>




    </div>
  );
};

export default Navbar;
