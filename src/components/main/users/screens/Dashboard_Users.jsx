import React from "react";
import { useSelector } from "react-redux";
import { getUserDetails } from "../../../../redux/slices/userDetailsSlice";
import { IoIosText } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { FaCalendarDay, FaExclamation } from "react-icons/fa";
import { MdSubject } from "react-icons/md";




export default function Dashboard_Users(){

    const userDetails = useSelector(state => getUserDetails(state).details)
    const complaints = useSelector(state => getUserDetails(state).complaints)

    const displayComplaints = complaints.map((complaint, i) => {
        const { complaint_text, status, complaint_date, subject, severity } = complaint

        const dateString = new Date(complaint_date).toDateString()

        const statusColor = 
            status == 'pending'
            ?
                '#E1F013'
            :
            status == 'Approved'
            ?
                '#56BA28'
            :
            status == 'denied'
            ?
                '#EC2020'
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

        return (
            <div
                key={i}
                className="d-flex align-items-start justify-content-between mb-4 p-3"
                style={{
                    backgroundColor: i % 2 == 0 ? '#F2F2F2' : "#FFFFFF"
                }}
            >
                <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000">
                    { i+1 }
                </p>
                <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000 text-capitalize">
                    { subject }
                </p>
                <p className="m-0 p-0 col-lg-6 col-md-6 col-6 font-family-Axiforma txt-000">
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
        <div className="w-100">
            <div className="d-flex align-items-center justify-content-end mb-4">
                <h1 className="m-0 p-0 text-end txt-24 fw-600 font-family-Axiforma txt-000 text-capitalize">
                    @<span className="txt-1352F1 fw-800">{ userDetails.username }</span>
                </h1>
            </div>
            
            <div className="mb-4">
                <h1 className="m-0 p-0 mb-3 txt-46 fw-500 font-family-Axiforma">
                    Your complaints
                </h1>

                <p className="m-0 p-0 txt-14 fw-600 font-family-Axiforma txt-000">
                    <span className="txt-4E4E4E fw-500">Dashboard</span> <span className="txt-4E4E4E mx-2">/</span> <span className="txt-000">Your Complaints</span>
                </p>
            </div>

            <div style={{ width: '100%', height: '100%', overflow: 'auto' }} className="">
                <div style={{ width: '300vw', maxHeight: '80vh' }} className="">
                    <div className="d-flex align-items-start justify-content-between mb-4 p-3">
                        <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000">
                            #
                        </p>
                        <p className="m-0 p-0 col-lg-1 col-md-1 col-1 font-family-Axiforma txt-000 text-capitalize">
                            <MdSubject size={15} /> <span className="font-family-Axiforma txt-000">Subject</span>
                        </p>                            
                        <p className="m-0 p-0 col-lg-6 col-md-6 col-6 font-family-Axiforma txt-000">
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

                    <div>
                        { displayComplaints }
                    </div>
                </div>
            </div>
        </div>
    )
}