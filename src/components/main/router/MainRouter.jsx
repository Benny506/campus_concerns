import React from "react";
import { Route, Router, Routes, useLocation } from "react-router-dom";
import Register from "../../auth/screens/Register";
import ScrollToTop from "../../customScroll/ScrollToTop";
import Login from "../../auth/screens/Login";
import ConfirmEmail from "../../auth/screens/ConfirmEmail";
import ResetPassword from "../../auth/screens/ResetPassword";
import ProtectedRoute from "../../protectedRoute/ProtectedRoute";
import MainRouter_Users from "../users/router/MainRouter_Users";
import { useSelector } from "react-redux";
import { getUserDetails } from "../../../redux/slices/userDetailsSlice";
import Dashboard_Admin from "../admin/screens/Dashboard_Admin";



export default function MainRouter(){

    const pathname = useLocation().pathname

    const userDetails = useSelector(state => getUserDetails(state).details)

    return (
        <ScrollToTop
            scrollToTopConition={pathname}
        >
            <Routes>
                <Route 
                    path="*"
                    element={
                        <Register />
                    }
                />

                <Route 
                    path="/"
                    element={
                        <Register />
                    }
                />

                <Route 
                    path="/login"
                    element={
                        <Login />
                    }
                /> 

                <Route 
                    path="/confirm-email"
                    element={
                        <ConfirmEmail />
                    }
                /> 

                <Route 
                    path="/reset-password"
                    element={
                        <ResetPassword />
                    }
                /> 

                <Route 
                    path="/dashboard/*"
                    element={
                        <ProtectedRoute>
                            {
                                (userDetails && userDetails.username.toLowerCase() == 'admin')
                                ?
                                    <Dashboard_Admin />
                                :
                                    <MainRouter_Users />
                            }
                        </ProtectedRoute>
                    }
                /> 

            </Routes>
        </ScrollToTop>
    )
}