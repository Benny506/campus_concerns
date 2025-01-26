import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, setUserDetails } from "../../../../redux/slices/userDetailsSlice";
import { ErrorMessage, Formik } from "formik";
import CustomErrorMsg from "../../../customErrorMsg/CustomErrorMsg";
import { FaCircle } from "react-icons/fa";
import * as yup from 'yup'
import { appLoadStart, appLoadStop } from "../../../../redux/slices/appLoadingSlice";
import { onRequestApi } from "../../../apiRequests/requestApi";
import { toast } from "react-toastify";
import ScrollToTop from "../../../customScroll/ScrollToTop";


const severeLevels = [
    'mild', 'moderate', 'urgent', 'severe'
]


export default function AddComplaint_Users(){
    const dispatch = useDispatch()

    const userDetails = useSelector(state => getUserDetails(state).details)
    const complaints = useSelector(state => getUserDetails(state).complaints)
    const accessToken = useSelector(state => getUserDetails(state).accessToken)

    const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })
    const [selectedSevereLevel, setSelectedSevereLevel] = useState('moderate')

    useEffect(() => {
        const { isLoading, data } = apiReqs

        if(isLoading){
            dispatch(appLoadStart())

        } else{
            dispatch(appLoadStop())
        }

        if(isLoading && data){
            const { type, requestInfo } = data

            if(type == 'addComplaint'){
                onRequestApi({
                    requestInfo,
                    successCallBack: addComplaintSuccess,
                    failureCallback: addComplaintFailure
                })
            }
        }
    }, [apiReqs])

    const addComplaintSuccess = ({ result }) => {
        try {

            const { data } = result

            const updatedComplaints = [...complaints, data]

            dispatch(setUserDetails({
                complaints: updatedComplaints
            }))

            setApiReqs({ isLoading: false, data: null, errorMsg: null })

            toast.success("Complaint added!")

            return;
            
        } catch (error) {
            console.error(error)
            return addComplaintFailure({ errorMsg: 'Something went wrong! Try again.' })
        }
    }

    const addComplaintFailure = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, data: null, errorMsg })
        toast.error(errorMsg)

        return;
    }

    const validationSchema = yup.object().shape({
        subject: yup
            .string()
            .max(20, 'Must be less than 20 characters')
            .required("Subject is required"),
        text: yup
            .string()
            .max(1500, 'Must be less than 1500 characters')
            .required('Text is required')
    })

    const displaySevereLevels = severeLevels.map((severe_level, i) => {

        const isActive = selectedSevereLevel == severe_level ? true : false

        const handleSevereLevelClick = () => setSelectedSevereLevel(severe_level)

        return (
            <div
                key={i}
                className="d-flex align-items-center clickable"
                style={{
                    gap: '5px'
                }}
                onClick={handleSevereLevelClick}
            >
                <FaCircle  
                    color={
                        isActive 
                        ? 
                            severe_level == 'mild' 
                            ?
                                '#E1F013'
                            :
                            severe_level == 'moderate'
                            ?
                                '#1352F1'
                            :
                            severe_level == 'severe'
                            ?
                                '#FF0000'
                            :
                            severe_level == 'urgent'
                            ?
                                '#EC2020'
                            :
                                '#000'
                        : 
                            '#000'
                    }
                    size={17.5}
                />

                <p className="m-0 p-0 txt-15 fw-500 font-family-Axiforma txt-000">
                    { severe_level }
                </p>
            </div>
        )
    })

    return(
        <ScrollToTop scrollToTopConition={apiReqs.errorMsg}>
            <div className="w-100">
                <div className="d-flex align-items-center justify-content-end mb-4">
                    <h1 className="m-0 p-0 text-end txt-24 fw-600 font-family-Axiforma txt-000 text-capitalize">
                        @<span className="txt-1352F1 fw-800">{ userDetails.username }</span>
                    </h1>
                </div>
                
                <div className="mb-4">
                    <h1 className="m-0 p-0 mb-3 txt-46 fw-500 font-family-Axiforma">
                        Add complaint
                    </h1>

                    <p className="m-0 p-0 txt-14 fw-600 font-family-Axiforma txt-000">
                        <span className="txt-4E4E4E fw-500">Dashboard</span> <span className="txt-4E4E4E mx-2">/</span> <span className="txt-000">Add Complaint</span>
                    </p>
                </div>

                <div>
                    <Formik
                        validationSchema={validationSchema}

                        initialValues={{
                            subject: '', text: ''
                        }}

                        onSubmit={(values, { resetForm }) => {
                            setApiReqs({
                                isLoading: true,
                                errorMsg: null,
                                data: {
                                    type: 'addComplaint',
                                    requestInfo: {
                                        url: 'users/complaints/add',
                                        method: 'POST',
                                        data: {
                                            subject: values.subject,
                                            complaint_text: values.text,
                                            user_id: userDetails.user_id,
                                            severity: selectedSevereLevel.toLowerCase()
                                        },
                                        token: accessToken
                                    }
                                }
                            })
                        }}
                    >
                        {({ handleBlur, handleChange, handleSubmit, values, isValid, dirty }) => (
                            <form className="w-lg-75 w-md-100 w-100">
                                {
                                    apiReqs.errorMsg
                                    &&
                                        <div className="py-3">
                                            <CustomErrorMsg errorMsg={apiReqs.errorMsg} isCentered={true} />
                                        </div>
                                }

                                <div className="mb-4">
                                    <label className="font-family-Axiforma txt-14 mb-2 fw-600 txt-000">
                                        Subject   
                                    </label>
                                    <br />
                                    <input 
                                        type="text"
                                        name="subject"
                                        value={values.subject}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="auth-input-field w-100"
                                        placeholder="Subject of your complaint"
                                    />
                                    <ErrorMessage 
                                        name="subject" 
                                        render={
                                            errorMsg => <CustomErrorMsg isCentered={false} errorMsg={errorMsg} />
                                            } 
                                    />                                
                                </div>  

                                <div className="mb-4">
                                    <label className="font-family-Axiforma txt-14 mb-2 fw-600 txt-000">
                                        Describe your complaint  
                                    </label>
                                    <br />
                                    <textarea 
                                        type="text"
                                        name="text"
                                        value={values.text}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="auth-input-field w-100"
                                        placeholder="Go on, this would be submitted and reviewed"
                                        style={{
                                            minHeight: '40vh'
                                        }}
                                    />
                                    <ErrorMessage 
                                        name="text" 
                                        render={
                                            errorMsg => <CustomErrorMsg isCentered={false} errorMsg={errorMsg} />
                                            } 
                                    />                                
                                </div>  

                                <div className="mb-5">
                                    <label className="font-family-Axiforma txt-14 mb-2 fw-600 txt-000">
                                        Severity
                                    </label>
                                    <br />   
                                    <div style={{ gap: '15px' }} className="d-flex align-items-center flex-wrap">
                                        { displaySevereLevels }
                                    </div>
                                </div>              
                                
                                <button     
                                    disabled={!(isValid && dirty)}
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="auth-submit-btn"
                                    style={{
                                        opacity: !(isValid && dirty) ? 0.5 : 1
                                    }}
                                >
                                    Submit
                                </button>                                                                    
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </ScrollToTop>
    )
}