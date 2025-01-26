import React, { useState } from "react";
import './css/fullScreenLoading.css'
import '../css/loaders.css'
import { useSelector } from "react-redux";
import { getAppLoadingState } from "../../../redux/slices/appLoadingSlice";



export default function FullScreenLoading({ tempLoad }){

    const appLoading = useSelector(state => getAppLoadingState(state).appLoading)

    if(!appLoading && !tempLoad){
        return <></>
    }

    return (
        <div className="loaders-overlay">
            <div className="full-screen-loading"></div>
        </div>
    )
}