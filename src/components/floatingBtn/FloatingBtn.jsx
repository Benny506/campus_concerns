import React from "react";
import { HiBriefcase } from "react-icons/hi2";
import { RxDashboard } from "react-icons/rx";
import { BiSolidBookContent } from "react-icons/bi";
import { FaPersonDotsFromLine, FaSquarePersonConfined } from "react-icons/fa6";
import './css/floatingBtn.css'
import { useLocation, useNavigate } from "react-router-dom";


export default function FloatingBtn({ btnFunc }){

    const handleBtnClick = () => btnFunc && btnFunc()

    return (
        <div 
            className={`
                justify-content-end
                floating-btn-icon
                w-100 fixed-bottom p-3 d-flex align-items-center`
            }
        >
            <div
                onClick={handleBtnClick}
                style={{
                    zIndex: 2000
                }}
                className="bg-1352F1 rounded-circle p-3 clickable"
            >
                {
                    <RxDashboard color="#FFF" size={20} />
                }
            </div>
        </div>        
    )
}