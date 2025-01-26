import { createSlice } from "@reduxjs/toolkit";

const userDetailsSlice = createSlice({
    name: 'userDetailsSlice',
    initialState: {
        details: null,
        accessToken: null,
        complaints: [],
        allComplaints: []
    },
    reducers: {
        setUserDetails: (state, action) => {
            //details
            if(action.payload.details){
                state.details = action.payload.details
            }

            //accessToken
            if(action.payload.accessToken){
                state.accessToken = action.payload.accessToken
            }

            if(action.payload.complaints){
                state.complaints = action.payload.complaints
            }

            if(action.payload.allComplaints){
                state.allComplaints = action.payload.allComplaints
            }
        },
        clearUserDetails: (state) => {
            state.details = null
            state.accessToken = null
            state.complaints = []
            state.allComplaints = []
        }
    }
})

export const { setUserDetails, clearUserDetails } = userDetailsSlice.actions

export const getUserDetails = state => state.userDetailsSlice

export default userDetailsSlice.reducer