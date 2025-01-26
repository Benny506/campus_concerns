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
import { setUserDetails } from "../../../redux/slices/userDetailsSlice";
import '../css/auth.css'


export default function Login(){
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const navigateTo = (path) => navigate(path)
    const goToRegister = () => navigateTo('/')
    const goToConfirmEmail = () => navigateTo('/confirm-email')
    const goToDashboard = () => navigateTo('/dashboard')

    const [passwordVisible, setPasswordVisible] = useState(false)
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

            if(type == 'login'){
                onRequestApi({
                    requestInfo,
                    successCallBack: loginSuccess,
                    failureCallback: loginFailure
                })
            }
        }
    }, [apiReqs])

    const loginSuccess = ({ result }) => {
        try {

            const { data } = result
            const { details, accessToken, complaints, allComplaints } = data
            const { user_id, username } = details

            if(username.toLowerCase() != 'admin'){
                localStorage.setItem("user_id", user_id)
                localStorage.setItem("accessToken", accessToken)   
            }

            setApiReqs({ isLoading: false, data: null, errorMsg: null })

            dispatch(appLoadStop())

            goToDashboard()

            dispatch(setUserDetails({
                details, accessToken, complaints, allComplaints
            }))

            return;
            
        } catch (error) {
            console.error(error)
            return loginFailure({ errorMsg })
        }
    }

    const loginFailure = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, data: null, errorMsg })
        toast.error(errorMsg)

        return;
    }

    const togglePasswordVisibility = () => setPasswordVisible(prev => !prev)

    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .email("Must be a valid email address")
            .required('Email is required'),
        password: yup
            .string()        
            .required('Password is required') 
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
                                Login to <br /> your account
                            </h1>
                            <p className="m-0 p-0 txt-AFAFAF fw-600 txt-13 font-family-Axiforma">
                                Let us make our campus brighter
                            </p>
                        </div>

                        <div style={{ borderRadius: '10.667px' }} className="col-lg-5 bg-FFFFFF p-lg-5 p-md-3 p-3">
                            <div className="py-4">
                                <Formik
                                    validationSchema={validationSchema}

                                    initialValues={{
                                        email: '', password: ''
                                    }}

                                    onSubmit={values => {
                                        return setApiReqs({
                                            isLoading: true,
                                            errorMsg: null,
                                            data: {
                                                type: 'login',
                                                requestInfo: {
                                                    url: 'users/login',
                                                    method: 'POST',
                                                    data: values
                                                }
                                            }
                                        })
                                    }}
                                >
                                    {({ handleBlur, handleChange, handleSubmit, isValid, dirty, values }) => (
                                        <form>
                                            {
                                                apiReqs.errorMsg
                                                &&
                                                    <div className="py-3">
                                                        <CustomErrorMsg errorMsg={apiReqs.errorMsg} isCentered={true} />
                                                    </div>
                                            }

                                            <div className="mb-4">
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

                                            <div className="mb-5">
                                                <label className="font-family-Axiforma txt-13 mb-2 fw-500 txt-696969">
                                                    Password   
                                                </label>
                                                <br />
                                                <div className="d-flex align-items-center justify-content-between auth-input-field">
                                                    <input 
                                                        type={passwordVisible ? 'text' : "password"}
                                                        name="password"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className="col-lg-11"
                                                        placeholder="********************"
                                                    />
                                                    <div className="col-lg-1 d-flex align-items-center justify-content-end">
                                                        {
                                                            passwordVisible
                                                            ?
                                                                <FaEye color="#1352F1" size={20} onClick={togglePasswordVisibility} />
                                                            :
                                                                <FaEyeSlash color="#1352F1" size={20} onClick={togglePasswordVisibility} />
                                                        }
                                                    </div>
                                                </div>
                                                <p onClick={goToConfirmEmail} className="m-0 p-0 text-end clickable fw-600 txt-1352F1 font-family-Axiforma txt-13">
                                                    Forgot password?
                                                </p>
                                                <ErrorMessage 
                                                    name="password" 
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
                                                    Login
                                                </button>
                                            </div>                                   
                                        </form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </ScrollToTop>
            </div>
        </div>
    )
}