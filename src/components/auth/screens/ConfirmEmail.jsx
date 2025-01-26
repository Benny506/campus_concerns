import React, { useEffect, useState } from "react";
import logoDarkBg from '../../../assets/images/logos/logo_no_bg.png'
import { Formik, ErrorMessage } from 'formik'
import CustomErrorMsg from "../../customErrorMsg/CustomErrorMsg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from 'yup'
import { CONTAIN_1_LOWERCASE_LETTER, CONTAIN_1_NUMBER, CONTAIN_1_SPECIAL_CHARACTER, CONTAIN_1_UPPERCASE_LETTER } from "../../regex/regex";
import { useDispatch } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { onRequestApi } from "../../apiRequests/requestApi";
import { toast } from "react-toastify";
import ScrollToTop from "../../customScroll/ScrollToTop";
import { useNavigate } from "react-router-dom";
import '../css/auth.css'


export default function ConfirmEmail(){
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const navigateTo = (path, stateData) => navigate(path, { state: stateData })
    const goToRegister = () => navigateTo('/')
    const goToResetPassword = (stateData) => navigateTo('/reset-password', stateData)

    const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })

    useEffect(() => {
        const { isLoading, data } = apiReqs

        if(isLoading){
            dispatch(appLoadStart())

        } else{
            dispatch(appLoadStop())
        }

        if(isLoading && data){
            const { type, requestInfo } = data

            if(type == 'confirmEmail'){
                onRequestApi({
                    requestInfo,
                    successCallBack: confirmEmailSuccess,
                    failureCallback: confirmEmailFailure
                })
            }
        }
    }, [apiReqs])

    const confirmEmailSuccess = ({ requestInfo }) => {
        try {

            const { data } = requestInfo
            const { email } = data

            setApiReqs({ isLoading: false, data: null, errorMsg: null })

            goToResetPassword({ email })

            toast.success("Email confirmed")

            return;
            
        } catch (error) {
            console.error(error)
            return confirmEmailFailure({ errorMsg })
        }
    }

    const confirmEmailFailure = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, data: null, errorMsg })
        toast.error(errorMsg)

        return;
    }

    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .email("Must be a valid email address")
            .required('Email is required'),
    })

    return(
        <div className="auth-bg bg-img p-lg-5 p-md-4 p-4">
            <div className="px-lg-5 px-md-0 px-0 mx-lg-5 mx-md-0 mx-0">        
                <ScrollToTop
                    scrollToTopConition={apiReqs.errorMsg}
                >
                    <div style={{ gap: '5px' }} className="d-flex align-items-center mb-5">
                        <div className="col-lg-1 col-md-3 col-3">
                            <img src={logoDarkBg} className="col-lg-12 col-md-12 col-12" />
                        </div>
                        <h1 className="m-0 p-0 txt-24 fw-700 txt-FFFFFF font-family-Axiforma">
                            Campus Concerns
                        </h1>
                    </div>

                    <div className="d-lg-flex d-md-block d-block align-items-start justify-content-between">
                        <div className="col-lg-5 mb-lg-0 mb-md-4 mb-4">
                            <h1 className="m-0 p-0 mb-2 fw-700 txt-FFFFFF font-family-Axiforma txt-50">
                                Confirm your <br /> email address
                            </h1>
                            <p className="m-0 p-0 txt-AFAFAF fw-600 txt-13 font-family-Axiforma">
                                Your forgot your password again, didn't you...?
                                <br />
                                You can reset it by confirming the email address you used during registration. 
                                Note that this is a test project, in a real world scenario, an email address would
                                be sent to this email to confirm if you actually have access to this email address, but that
                                requires additional SMPT and API charges. Hence, by simply providing this email, we will allow
                                you to reset it, once officially launched, the SMPT and API requirements would be met!
                            </p>
                        </div>

                        <div style={{ borderRadius: '10.667px' }} className="col-lg-5 bg-FFFFFF p-lg-5 p-md-3 p-3">
                            <form>
                                <div className="py-4">
                                    <Formik
                                        validationSchema={validationSchema}

                                        initialValues={{
                                            email: ''
                                        }}

                                        onSubmit={values => {
                                            return setApiReqs({
                                                isLoading: true,
                                                errorMsg: null,
                                                data: {
                                                    type: 'confirmEmail',
                                                    requestInfo: {
                                                        url: 'users/confirm-email',
                                                        method: 'POST',
                                                        data: values
                                                    }
                                                }
                                            })
                                        }}
                                    >
                                        {({ handleBlur, handleChange, handleSubmit, isValid, dirty, values }) => (
                                            <div>

                                                {
                                                    apiReqs.errorMsg
                                                    &&
                                                        <div className="py-3">
                                                            <CustomErrorMsg errorMsg={apiReqs.errorMsg} isCentered={true} />
                                                        </div>
                                                }

                                                <div className="mb-5">
                                                    <label className="font-family-Axiforma txt-13 mb-2 fw-500 txt-696969">
                                                        Email   
                                                    </label>
                                                    <br />
                                                    <input 
                                                        type="email"
                                                        name="email"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className="auth-input-field w-100"
                                                        placeholder="name@example.com"
                                                    />
                                                    <ErrorMessage 
                                                        name="email" 
                                                        render={
                                                            errorMsg => <CustomErrorMsg isCentered={false} errorMsg={errorMsg} />
                                                            } 
                                                    />                                
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <p className="m-0 p-0 txt-4E4E4E font-family-Axiforma fw-400 txt-13">
                                                            Don't have an account? <span onClick={goToRegister} className="fw-600 clickable txt-1352F1">Sign up</span>
                                                        </p>
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
                                                        Confirm
                                                    </button>
                                                </div>                                   
                                            </div>
                                        )}
                                    </Formik>
                                </div>
                            </form>
                        </div>
                    </div>
                </ScrollToTop>
            </div>
        </div>
    )
}