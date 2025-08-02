import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./slices/authSlice"
import {apiSlice} from "./slices/apiSlice"

const store = configureStore({
    reducer : {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth: authreducer
    },
    middleware : (getDefaultMiddleware)=> getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});


export default store;