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
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../../customScroll/ScrollToTop";
import '../css/auth.css'


export default function Register(){
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const navigateTo = (path) => navigate(path)
    const goToLogin = () => navigateTo('/login')

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

            if(type == 'register'){
                onRequestApi({
                    requestInfo,
                    successCallBack: registerSuccess,
                    failureCallback: registerFailure
                })
            }
        }
    }, [apiReqs])

    const registerSuccess = ({ result }) => {
        try {

            setApiReqs({ isLoading: false, data: null, errorMsg: null })

            goToLogin()

            toast.success('Account created, login to explore your dashboard')

            return;
            
        } catch (error) {
            console.error(error)
            return registerFailure({ errorMsg })
        }
    }

    const registerFailure = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, data: null, errorMsg })
        toast.error(errorMsg)

        return;
    }

    const togglePasswordVisibility = () => setPasswordVisible(prev => !prev)

    const validationSchema = yup.object().shape({
        username: yup
            .string()
            .max(20, "Must be less than 20 characters")
            .required("Username is required"),
        email: yup
            .string()
            .email("Must be a valid email address")
            .required('Email is required'),
        password: yup
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(20, 'Password cannot exceed 20 characters')
            .matches(CONTAIN_1_LOWERCASE_LETTER, 'Password must contain at least one lowercase letter')
            .matches(CONTAIN_1_UPPERCASE_LETTER, 'Password must contain at least one uppercase letter')
            .matches(CONTAIN_1_NUMBER, 'Password must contain at least one number')
            .matches(CONTAIN_1_SPECIAL_CHARACTER, 'Password must contain at least one special character')
            .notOneOf(['password', '12345678'], 'Do not use a common or weak password')         
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
                                Register <br /> an account
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
                                        username: '', email: '', password: ''
                                    }}

                                    onSubmit={values => {
                                        return setApiReqs({
                                            isLoading: true,
                                            errorMsg: null,
                                            data: {
                                                type: 'register',
                                                requestInfo: {
                                                    url: 'users/signup',
                                                    method: 'POST',
                                                    data: {
                                                        ...values,
                                                        username: values.username.toLowerCase(),
                                                        email: values.email.toLowerCase()
                                                    }
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
                                                    Username   
                                                </label>
                                                <br />
                                                <input 
                                                    type="text"
                                                    name="username"
                                                    value={values.username}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className="auth-input-field w-100"
                                                    placeholder="my-username"
                                                />
                                                <ErrorMessage 
                                                    name="username" 
                                                    render={
                                                        errorMsg => <CustomErrorMsg isCentered={false} errorMsg={errorMsg} />
                                                        } 
                                                />                                
                                            </div>

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
                                                        Already have an account? <span onClick={goToLogin} className="fw-600 clickable txt-1352F1">Login</span>
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
                                                    Register
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