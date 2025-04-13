import { apiSlice } from "../apiSlice"

const Auth_URL="/user"

export const authApiSlice=apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        login:builder.mutation({
            query: (data)=>({
               url:`${Auth_URL}/login`,
               method:"POST",
               body:data,
               credentials:"include",
            }),
        }),
        register:builder.mutation({
            query: (data)=>({
               url:`${Auth_URL}/register`,
               method:"POST",
               body:data,
               credentials:"include",
            }),
        }),
        logout:builder.mutation({
            query: (data)=>({
               url:`${Auth_URL}/logout`,
               method:"POST",
               credentials:"include",
            }),
        }),
    })
})


export const {useLoginMutation,useRegisterMutation,useLogoutMutation}=authApiSlice