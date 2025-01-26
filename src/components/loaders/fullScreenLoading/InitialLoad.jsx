import React from "react";
import logoDarkBg from '../../../assets/images/logos/logo_dark_bg.png'
import FullScreenLoading from "./FullScreenLoading";
import './css/fullScreenLoading.css'


export default function InitialLoad(){
    return (
        <div className="initial-load-bg bg-img d-flex align-items-center justify-content-center">
            <div className="col-lg-3">
                <img src={logoDarkBg} className="col-lg-12 col-md-12 col-12" />
            </div>

            <FullScreenLoading tempLoad={true} />
        </div>
    )
}