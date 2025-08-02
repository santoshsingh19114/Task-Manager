import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { toast } from "sonner";
import { useRegisterMutation } from "../redux/slices/apis/authApiSlice";
import { useUpdateUserMutation } from "../redux/slices/apis/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";

const AddUser = ({ open, setOpen, userData , refetchUsers}) => {
  // console.log("AddUser dialog state:", open);

  let defaultValues = userData ?? {};
  // console.log("defaultvalues:" ,defaultValues);
  const { user } = useSelector((state) => state.auth);

  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // ✅ yeh add kar
  } = useForm({
    defaultValues: {
      name: "",
      title: "",
      email: "",
      role: "",
    },
  });

  // import { useEffect } from "react";

useEffect(() => {
  if (userData) {
    reset({
      name: userData.name || "",
      title: userData.title || "",
      email: userData.email || "",
      role: userData.role || "",
    });
  }
}, [userData, reset]);


  const dispatch=useDispatch();

  const [addNewUser,{isLoading}]=useRegisterMutation();

  const [updateUser,{isLoading:isUpdating}]=useUpdateUserMutation();

  const handleOnSubmit = async(data) => {
    try{


      if (data.email !== userData.email) {
        toast.warning("Email can't be updated. Only Name, Title, and Role can be changed.");
        return;
      }


      if(userData){
        // userData console.log karke dekh
// console.log("userData:", userData);

// data bhi dekh le
// console.log("form data:", data);

      // console.log("handle on submit if ke ander ja rha h ")
      const result = await updateUser({ ...data, _id: userData._id }).unwrap();


      // console.log("form data:", { ...data, _id: userData._id });
        

        toast.success(result?.message)

        if(userData?._id===user?._id){
          dispatch(setCredentials({...result.user}))
        }

        if (refetchUsers) {
          refetchUsers();  // 🔁 User list refresh yahin se hoga
        }

      }
      else{
        const result=await addNewUser({...data,password:data.email}).unwrap();

        toast.success("User Added succesfully");
      }
      
      setTimeout(()=>{
        setOpen(false);
      },1500);

      

    }catch(error){
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
        <Dialog.Title
          as='h2'
          className='text-base font-bold leading-6 text-gray-900 mb-4'
        >
          {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
        </Dialog.Title>
        <div className='mt-2 flex flex-col gap-6'>
          <Textbox
            placeholder='Full name'
            type='text'
            name='name'
            label='Full Name'
            className='w-full rounded'
            register={register("name", {
              required: "Full name is required!",
            })}
            error={errors.name ? errors.name.message : ""}
          />
          <Textbox
            placeholder='Title'
            type='text'
            name='title'
            label='Title'
            className='w-full rounded'
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />
          <Textbox
            placeholder='Email Address'
            type='email'
            name='email'
            label='Email Address'
            className='w-full rounded'
            register={register("email", {
              required: "Email Address is required!",
            })}
            error={errors.email ? errors.email.message : ""}
            
          />

          <Textbox
            placeholder='Role'
            type='text'
            name='role'
            label='Role'
            className='w-full rounded'
            register={register("role", {
              required: "User role is required!",
            })}
            error={errors.role ? errors.role.message : ""}
          />
        </div>

        {isLoading || isUpdating ? (
          <div className='py-5'>
            <Loading />
          </div>
        ) : (
          <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
            <Button
              type='submit'
              className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
              label='Submit'
            />
            <Button
              type='button'
              className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
              onClick={() => setOpen(false)}
              label='Cancel'
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddUser;
