import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./Slices/authSlice"
import {apiSlice} from "./slices/apiSlice"

const store = configureStore({
    reducer : {
        [apiSlice.reducesPath] : apiSlice.reducer,
        auth: authreducer
    },
    middleware : (getDefaultMiddleware)=> getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});


export default store;