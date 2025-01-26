import React, { useEffect, useState } from "react";
import logoNoBg from '../../../../assets/images/logos/logo_no_bg.png'
import '../css/main_users.css'
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import Dashboard_Users from "../screens/Dashboard_Users";
import AddComplaint_Users from "../screens/AddComplaint_Users";
import FloatingBtn from "../../../floatingBtn/FloatingBtn";
import { Offcanvas } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import EditProile_Users from "../screens/EditProfile_Users";
import { useDispatch } from "react-redux";
import { clearUserDetails } from "../../../../redux/slices/userDetailsSlice";
import { appLoadStart, appLoadStop } from "../../../../redux/slices/appLoadingSlice";


const navLinks = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        Icon: ({ color }) => <FiHome size={20} color={color} />
    },
    {
        title: 'Add complaint',
        path: '/dashboard/add-complaint',
        Icon: ({ color }) => <FaPlus size={20} color={color} />
    },
    {
        title: 'Edit profile',
        path: '/dashboard/edit-profile',
        Icon: ({ color }) => <FaUserCircle size={20} color={color} />
    }, 
    {
        title: 'Logout',
        type: 'logout',
        Icon: ({ color }) => <RiLogoutCircleLine size={20} color={color} />
    },            
]


export default function MainRouter_Users(){
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const navigateTo = (path) => navigate(path)

    const pathname = useLocation().pathname

    const [activeNav, setActiveNav] = useState('Dashboard')
    const [offCanvasNav, setOffCanvasNav] = useState(false)

    useEffect(() => {
        if(pathname.toLowerCase().includes('users/add-complaint')){
            setActiveNav('Add complaint')
        
        } else if(pathname.toLowerCase().includes('users/edit-profile')){
            setActiveNav('Edit profile')

        } else{
            setActiveNav('Dashboard')
        }

        hideOffCanvasNav()
    }, [pathname])

    const openOffCanvasNav = () => setOffCanvasNav(true)
    const hideOffCanvasNav = () => setOffCanvasNav(false)

    const logout = () => {
        dispatch(appLoadStart())

        const logoutTimer = setTimeout(() => {
            dispatch(appLoadStop())
            localStorage.clear()
            clearTimeout(logoutTimer)
            dispatch(clearUserDetails())
        }, 3000)

        return;
    }

    const displayNavLinks = navLinks.map((navLink, i) => {
        const { title, type, Icon, path } = navLink

        const isActive = title == activeNav ? true : false

        const handleNavLinkClick = () => {
            if(type == 'logout'){
                return logout()
            }

            if(path){
                navigateTo(path)
            }
        }

        return (
            <div
                key={i}
                className="d-flex align-items-center mb-4 justify-content-center clickable"
                style={{
                    gap: '10px'
                }}
                onClick={handleNavLinkClick}
            >
                <div>
                    <Icon color={isActive ? '#FFFFFF' : '#696969'}/>
                </div>

                <p 
                    style={{ 
                        letterSpacing: '0.35px',
                        color: isActive ? '#FFFFFF' : '#696969' 
                    }} 
                    className="m-0 p-0 txt-14 txt-FFFFFF fw-500 text-upper font-family-Axiforma"
                >
                    { title }
                </p>
            </div>
        )
    })

    return (
        <div className="">
            <div className="d-flex align-items-stretch justify-content-between">

                <div className="col-lg-3 d-lg-block d-md-none d-none main-users-nav-container p-3">
                    <div style={{ gap: '5px' }} className="d-flex align-items-center mb-5">
                        <div className="col-lg-3">
                            <img src={logoNoBg} className="col-lg-12 col-md-12 col-12" />
                        </div>
                        <h1 className="m-0 p-0 txt-20 txt-FFFFFF font-family-Axiforma fw-600">
                            Campus <br /> Concerns
                        </h1>
                    </div>

                    <div className="d-flex align-items-start px-4 justify-content-center flex-column">
                        { displayNavLinks }
                    </div>
                </div>

                <div className="col-lg-9 col-md-12 col-12 px-lg-4 px-md-2 px-2">
                    <div
                        style={{
                            minHeight: '100vh'
                        }}
                        className="bg-CED4DA py-3"
                    >
                        <Routes>
                            <Route 
                                path="/"
                                element={
                                    <Dashboard_Users />
                                }
                            />

                            <Route 
                                path="/add-complaint"
                                element={
                                    <AddComplaint_Users />
                                }
                            />

                            <Route 
                                path="/edit-profile"
                                element={
                                    <EditProile_Users />
                                }
                            />                                                        
                        </Routes>
                    </div>
                </div>
            </div>


            <div className="d-lg-none d-md-block d-block">
                <FloatingBtn btnFunc={openOffCanvasNav} />
            </div>

            <Offcanvas show={offCanvasNav}>
                <div className="p-3 main-users-nav-container" style={{ minHeight: '100vh' }}>
                    <div className="d-flex align-items-center justify-content-end">
                        <IoMdClose onClick={hideOffCanvasNav} color="#FFFFFF" size={25} className="clickable" />
                    </div> 

                    <div style={{ gap: '5px' }} className="d-flex align-items-center mb-5">
                        <div className="col-lg-3 col-md-3 col-3">
                            <img src={logoNoBg} className="col-lg-12 col-md-12 col-12" />
                        </div>
                        <h1 className="m-0 p-0 txt-20 txt-FFFFFF font-family-Axiforma fw-600">
                            Campus <br /> Concerns
                        </h1>
                    </div>                    
                    { displayNavLinks }
                </div>
            </Offcanvas>
        </div>
    )
}