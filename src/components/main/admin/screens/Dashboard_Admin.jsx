import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails, getUserDetails, setUserDetails } from "../../../../redux/slices/userDetailsSlice";
import { IoIosText } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { CiMenuKebab } from "react-icons/ci";
import { FaCalendarDay, FaExclamation, FaUser } from "react-icons/fa";
import { MdPendingActions, MdSubject } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import '../css/main_admin.css'
import { IoFilter } from "react-icons/io5";
import FloatingMenu from "../../../floatingMenu/FloatingMenu";
import { appLoadStart, appLoadStop } from "../../../../redux/slices/appLoadingSlice";
import { onRequestApi } from "../../../apiRequests/requestApi";
import { toast } from "react-toastify";




export default function Dashboard_Admin(){
    const dispatch = useDispatch()

    const userDetails = useSelector(state => getUserDetails(state).details)
    const accessToken = useSelector(state => getUserDetails(state).accessToken)
    const allComplaints = useSelector(state => getUserDetails(state).allComplaints)

    const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })
    const [filteredComplaints, setFilteredComplaints] = useState(allComplaints)
    const [filters, setFilters] = useState({ severity: 'all', status: 'all' })

    useEffect(() => {
        const { severity, status } = filters

        if(severity == 'all' && status == 'all'){
            setFilteredComplaints(allComplaints)
        }

        const _filtered = allComplaints.filter(complaint => {
            if(severity == 'all' && status != 'all'){
                return complaint.status == status
            }
            
            if(severity != 'all' && status == 'all'){
                return complaint.severity == severity
            }

            if(severity != 'all' && status != 'all'){
                return complaint.status == status && complaint.severity == severity
            }

            return true
        })

        setFilteredComplaints(_filtered)
    }, [filters])

    useEffect(() => {
        setFilteredComplaints(allComplaints)
        setFilters({
            status: 'all', severity: 'all'
        })
    }, [allComplaints])

    useEffect(() => {
        const { isLoading, data } = apiReqs

        if(isLoading){
            dispatch(appLoadStart())

        } else{
            dispatch(appLoadStop())
        }

        if(isLoading && data){
            const { type, requestInfo } = data

            if(type == 'updateComplaintStatus'){
                onRequestApi({
                    requestInfo,
                    successCallBack: updateComplaintStatusSuccess,
                    failureCallback: updateComplaintStatusFailure
                })
            }
        }
    }, [apiReqs])

    const updateComplaintStatusSuccess = ({ result }) => {
        try {

            const { data } = result
            const { complaint_id, status } = data

            const updatedAllComplaints = allComplaints.map(complaint => {
                if(complaint.complaint_id == complaint_id){
                    return {
                        ...complaint,
                        status: status.toLowerCase()
                    }
                }

                return complaint
            })

            dispatch(setUserDetails({
                allComplaints: updatedAllComplaints
            }))

            setApiReqs({ isLoading: false, data: null, errorMsg: null })

            toast.success("Complaint" + " " + status)

            return;
            
        } catch (error) {
            console.error(error)
            return updateComplaintStatusFailure({ errorMsg: 'Something went wrong! Try again.' })
        }
    }

    const updateComplaintStatusFailure = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, data: null, errorMsg })
        toast.error(errorMsg)

        return;
    }

    const logout = () => {
        dispatch(appLoadStart())

        const logoutTimer = setTimeout(() => {
            localStorage.clear()
            clearTimeout(logoutTimer)
            dispatch(clearUserDetails())
            dispatch(appLoadStop())
        }, 3000)

        return;
    }

    const onFilterSelect = ({ value }) => {
        const { type, val } = value

        setFilters(prev => ({ 
            ...prev,
            [type]: val
        }))

        return;
    }

    const displayFilters = () => {
        const { status, severity } = filters

        const statusColor = 
            status.toLowerCase() == 'pending'
            ?
                '#E1F013'
            :
            status.toLowerCase() == 'approved'
            ?
                '#56BA28'
            :
            status.toLowerCase() == 'denied'
            ?
                '#FF0000'
            :
                "#FFF"

        const severityColor = 
            severity == 'mild'
            ?
                '#E1F013'
            :
            severity == 'moderate'
            ?
                '#1352F1'
            :
            severity == 'severe'
            ?
                '#FF0000'
            :
            severity == 'urgent'
            ?
                '#EC2020'
            :
                "#FFF"              
        
        return (
            <div
                className="d-flex align-items-center"
                style={{ gap: '35px' }}
            >
                <div style={{ gap: '15px' }} className="d-flex align-items-center">
                    <p className="p-0 m-0 txt-FFFFFF fw-500 font-family-Axiforma txt-14 text-capitalize">
                        Status:
                    </p>
                    <div style={{ gap: '3px' }} className="d-flex align-items-center">
                        <GoDotFill color={statusColor} size={20} />
                        <p className="p-0 m-0 txt-FFFFFF fw-700 font-family-Axiforma txt-14 text-capitalize">
                            { status }
                        </p>
                    </div>
                </div>

                <div style={{ gap: '15px' }} className="d-flex align-items-center">
                    <p className="p-0 m-0 txt-FFFFFF fw-500 font-family-Axiforma txt-14 text-capitalize">
                        Severe level:
                    </p>
                    <div style={{ gap: '3px' }} className="d-flex align-items-center">
                        <GoDotFill color={severityColor} size={20} />
                        <p className="p-0 m-0 txt-FFFFFF fw-700 font-family-Axiforma txt-14 text-capitalize">
                            { severity }
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const displayComplaints = filteredComplaints.map((complaint, i) => {
        const { complaint_text, status, complaint_date, subject, severity, username, complaint_id } = complaint

        const dateString = new Date(complaint_date).toDateString()

        const statusColor = 
            status.toLowerCase() == 'pending'
            ?
                '#E1F013'
            :
            status.toLowerCase() == 'approved'
            ?
                '#56BA28'
            :
            status.toLowerCase() == 'denied'
            ?
                '#FF0000'
            :
                "#000"

        const severityColor = 
            severity == 'mild'
            ?
                '#E1F013'
            :
            severity == 'moderate'
            ?
                '#1352F1'
            :
            severity == 'severe'
            ?
                '#FF0000'
            :
            severity == 'urgent'
            ?
                '#EC2020'
            :
                "#000"                
        
        const handleEditComplaintBtnClick = ({ value }) => {
            console.log(value)
            return setApiReqs({
                isLoading: true,
                errorMsg: null,
                data: {
                    type: 'updateComplaintStatus',
                    requestInfo: {
                        url: 'admin/update-complaint-status',
                        method: 'POST',
                        data: {
                            complaint_id,
                            status: value
                        },
                        token: accessToken
                    }
                }
            })
        }

        return (
            <div
                key={i}
                className="d-flex align-items-start justify-content-between mb-4 p-3 w-100"
                style={{
                    backgroundColor: i % 2 == 0 ? '#F2F2F2' : "#FFFFFF",
                    gap: "20px"
                }}
            >
                <p className="m-0 p-0 font-family-Axiforma txt-000">
                    { i+1 }
                </p>
                <div className="m-0 p-0 col-lg-1 col-md-1 col-1">
                    <FloatingMenu 
                        menuBtn={() => (
                            <div 
                                style={{ gap: '5px' }} 
                                className="bg-1352F1 rounded-3 px-2 py-1 d-flex align-items-center"
                            >
                                <MdPendingActions color="#FFFFFF" size={20} />
                                <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-FFFFFF text-capitalize">
                                    Edit
                                </p>
                            </div>                            
                        )}
                        items={[
                            {
                                text: () => (
                                    <div style={{ gap: '5px' }} className="d-flex align-items-center">
                                        <GoDotFill color="#56BA28" size={20} />
                                        <p className="m-0 p-0 font-family-Axiforma txt-000 text-capitalize">
                                            Approve
                                        </p>
                                    </div>
                                ),
                                handleItemClick: handleEditComplaintBtnClick,
                                value: 'approved'
                            },
                            {
                                type: 'divider'
                            },
                            {
                                text: () => (
                                    <div style={{ gap: '5px' }} className="d-flex align-items-center">
                                        <GoDotFill color="#FF0000" size={20} />
                                        <p className="m-0 p-0 font-family-Axiforma txt-000 text-capitalize">
                                            Deny
                                        </p>
                                    </div>
                                ),
                                handleItemClick: handleEditComplaintBtnClick,
                                value: 'denied'                                
                            },                            
                        ]}
                    />
                </div>                 
                <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000 text-capitalize">
                    { username }
                </p>                
                <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000 text-capitalize">
                    { subject }
                </p>
                <p className="m-0 p-0 col-lg-4 col-md-4 col-4 font-family-Axiforma txt-000">
                    { complaint_text }
                </p>
                <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000 text-capitalize">
                    <span><GoDotFill size={18} color={statusColor} /></span> { status }
                </p> 
                <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000 text-capitalize">
                    <span><GoDotFill size={18} color={severityColor} /></span> { severity }
                </p>
                <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000">
                    { dateString }
                </p>                                                
            </div>
        )
    })

    return(
        <div style={{ minHeight: '100vh' }} className="w-100 p-3 admin-container bg-img">
            <div className="d-flex flex-column align-items-end justify-content-center mb-4">
                <h1 className="m-0 p-0 mb-2 text-end txt-24 fw-600 font-family-Axiforma txt-1352F1 text-capitalize">
                    @<span className="txt-FFFFFF fw-800">{ userDetails.username }</span>
                </h1>
                <div onClick={logout} style={{ gap: '5px' }} className="clickable d-flex align-items-center">
                    <RiLogoutCircleLine size={20} color="#FFFFFF" />
                    <p className="m-0 p-0 txt-13 fw-600 font-family-Axiforma txt-FFFFFF">
                        Logout
                    </p>
                </div>                
            </div>
            
            <div className="mb-4">
                <h1 className="m-0 p-0 mb-3 txt-46 fw-500 txt-FFFFFF font-family-Axiforma">
                    Student complaints
                </h1>

                <p className="m-0 p-0 mb-3 txt-14 fw-600 font-family-Axiforma txt-000">
                    <span className="txt-4E4E4E fw-500">Dashboard</span> <span className="txt-4E4E4E mx-2">/</span> <span className="txt-FFFFFF">Your Complaints</span>
                </p>

                <div className="mb-3">
                    <FloatingMenu 
                        menuBtn={() => (
                            <div 
                                style={{ gap: '5px' }} 
                                className="bg-1352F1 rounded-3 px-2 py-1 d-flex align-items-center"
                            >
                                <IoFilter color="#FFFFFF" size={20} />
                                <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-FFFFFF text-capitalize">
                                    Filter
                                </p>
                            </div>                            
                        )}
                        items={[
                            {
                                type: 'header',
                                text: 'status'
                            },
                            {
                                text: () => (
                                    <div style={{ gap: '5px' }} className="d-flex align-items-center">
                                        <GoDotFill color="#FFF" size={20} />
                                        <p className="m-0 p-0 font-family-Axiforma txt-000 text-capitalize">
                                            All
                                        </p>
                                    </div>
                                ),
                                handleItemClick: onFilterSelect,
                                value: {
                                    type: 'status',
                                    val: 'all'
                                }                                
                            },
                            {                             
                                text: () => (
                                    <div style={{ gap: '5px' }} className="d-flex align-items-center">
                                        <GoDotFill color="#E1F013" size={20} />
                                        <p className="m-0 p-0 font-family-Axiforma txt-000 text-capitalize">
                                            Pending
                                        </p>
                                    </div>
                                ),
                                handleItemClick: onFilterSelect,
                                value: {
                                    type: 'status',
                                    val: 'pending'
                                }
                            },
                            {
                                text: () => (
                                    <div style={{ gap: '5px' }} className="d-flex align-items-center">
                                        <GoDotFill color="#56BA28" size={20} />
                                        <p className="m-0 p-0 font-family-Axiforma txt-000 text-capitalize">
                                            Approved
                                        </p>
                                    </div>
                                ),
                                handleItemClick: onFilterSelect,
                                value: {
                                    type: 'status',
                                    val: 'approved'
                                }                            
                            },
                            {
                                text: () => (
                                    <div style={{ gap: '5px' }} className="d-flex align-items-center">
                                        <GoDotFill color="#FF0000" size={20} />
                                        <p className="m-0 p-0 font-family-Axiforma txt-000 text-capitalize">
                                            Denied
                                        </p>
                                    </div>
                                ),
                                handleItemClick: onFilterSelect,
                                value: {
                                    type: 'status',
                                    val: 'denied'
                                }                            
                            },
                            {
                                type: 'divider'
                            },
                            {
                                type: 'header',
                                text: 'severe level'
                            },
                            {
                                text: () => (
                                    <div style={{ gap: '5px' }} className="d-flex align-items-center">
                                        <GoDotFill color="#FFF" size={20} />
                                        <p className="m-0 p-0 font-family-Axiforma txt-000 text-capitalize">
                                            All
                                        </p>
                                    </div>
                                ),
                                handleItemClick: onFilterSelect,
                                value: {
                                    type: 'severity',
                                    val: 'all'
                                }                                
                            },                            
                            {
                                text: () => (
                                    <div style={{ gap: '5px' }} className="d-flex align-items-center">
                                        <GoDotFill color="#E1F013" size={20} />
                                        <p className="m-0 p-0 font-family-Axiforma txt-000 text-capitalize">
                                            Mild
                                        </p>
                                    </div>
                                ),
                                handleItemClick: onFilterSelect,
                                value: {
                                    type: 'severity',
                                    val: 'mild'
                                }
                            },
                            {
                                text: () => (
                                    <div style={{ gap: '5px' }} className="d-flex align-items-center">
                                        <GoDotFill color="#1352F1" size={20} />
                                        <p className="m-0 p-0 font-family-Axiforma txt-000 text-capitalize">
                                            Moderate
                                        </p>
                                    </div>
                                ),
                                handleItemClick: onFilterSelect,
                                value: {
                                    type: 'severity',
                                    val: 'moderate'
                                }                            
                            },
                            {
                                text: () => (
                                    <div style={{ gap: '5px' }} className="d-flex align-items-center">
                                        <GoDotFill color="#EC2020" size={20} />
                                        <p className="m-0 p-0 font-family-Axiforma txt-000 text-capitalize">
                                            Urgent
                                        </p>
                                    </div>
                                ),
                                handleItemClick: onFilterSelect,
                                value: {
                                    type: 'severity',
                                    val: 'urgent'
                                }
                            },
                            {
                                text: () => (
                                    <div style={{ gap: '5px' }} className="d-flex align-items-center">
                                        <GoDotFill color="#FF0000" size={20} />
                                        <p className="m-0 p-0 font-family-Axiforma txt-000 text-capitalize">
                                            Severe
                                        </p>
                                    </div>
                                ),
                                handleItemClick: onFilterSelect,
                                value: {
                                    type: 'severity',
                                    val: 'severe'
                                }                            
                            },                                                               
                        ]}
                    />                
                </div>

                <div>
                    { displayFilters() }
                </div>
            </div>

            <div style={{ width: '100%', height: '100%', overflow: 'auto', borderRadius: '10px' }} className="bg-FFFFFF">
                <div style={{ width: '305vw', minHeight: '50vh', maxHeight: '50vh' }} className="">
                    <div style={{ gap: '20px' }} className="d-flex align-items-start justify-content-between mb-4 p-3 w-100">
                        <p className="m-0 p-0 font-family-Axiforma txt-000">
                            #
                        </p>
                        <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000 text-capitalize">
                            <CiMenuKebab size={15} /> <span className="font-family-Axiforma txt-000">Edit</span>
                        </p>                        
                        <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000 text-capitalize">
                            <FaUser size={15} /> <span className="font-family-Axiforma txt-000">User</span>
                        </p>                        
                        <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000 text-capitalize">
                            <MdSubject size={15} /> <span className="font-family-Axiforma txt-000">Subject</span>
                        </p>                            
                        <p className="m-0 p-0 col-lg-4 col-md-4 col-4 font-family-Axiforma txt-000">
                            <IoIosText size={15} color="#1352F1" /> <span className="font-family-Axiforma txt-000">Text</span>
                        </p>
                        <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000 text-capitalize">
                            <GoDotFill size={15} color="#56BA28" /> <span className="font-family-Axiforma txt-000">Status</span>
                        </p>
                        <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000">
                            <FaExclamation size={15} color="#EC2020" /> <span className="font-family-Axiforma txt-000">Severity</span>
                        </p>                            
                        <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000">
                            <FaCalendarDay size={15} color="#5A4282" /> <span className="font-family-Axiforma txt-000">Date</span>                                
                        </p>
                    </div>

                    <div className="w-100">
                        { displayComplaints }
                    </div>
                </div>
            </div>
        </div>
    )
}