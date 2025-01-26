import { configureStore } from "@reduxjs/toolkit";
import appLoadingSlice from '../slices/appLoadingSlice'
import userDetailsSlice from '../slices/userDetailsSlice'

export default configureStore({
    reducer: {
        appLoadingSlice,
        userDetailsSlice
    }
})