import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserDetails } from "../../redux/slices/userDetailsSlice";
import { useNavigate } from "react-router-dom";


export default function ProtectedRoute(props){

    const navigate = useNavigate()
    const navigateTo = path => navigate(path)
    const goToRegister = () => navigateTo('/')

    const userDetails = useSelector(state => getUserDetails(state).details)

    useEffect(() => {
        if(!userDetails){
            goToRegister()
        }
        
    }, [userDetails])

    if(!userDetails){
        return <></>
    
    } else{
        return(
            <>
                { props.children }
            </>
        )
    }
}