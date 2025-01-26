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
import { useLocation, useNavigate } from "react-router-dom";
import '../css/auth.css'


export default function ResetPassword(){
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const goBack = () => navigate(-1)
    const navigateTo = (path) => navigate(path)
    const goToRegister = () => navigateTo('/')
    const goToLogin = () => navigateTo('/login')

    const stateData = useLocation().state

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })

    useEffect(() => {
        if(!stateData || !stateData.email){
            goBack()
        }
    }, [stateData])

    useEffect(() => {
        const { isLoading, data } = apiReqs

        if(isLoading){
            dispatch(appLoadStart())

        } else{
            dispatch(appLoadStop())
        }

        if(isLoading && data){
            const { type, requestInfo } = data

            if(type == 'resetPassword'){
                onRequestApi({
                    requestInfo,
                    successCallBack: resetPasswordSuccess,
                    failureCallback: resetPasswordFailure
                })
            }
        }
    }, [apiReqs])

    const resetPasswordSuccess = ({ result }) => {
        try {

            const { data } = result

            setApiReqs({ isLoading: false, data: null, errorMsg: null })

            goToLogin()

            toast.success("Your password has been reset!")

            return;
            
        } catch (error) {
            console.error(error)
            return resetPasswordFailure({ errorMsg })
        }
    }

    const resetPasswordFailure = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, data: null, errorMsg })
        toast.error(errorMsg)

        return;
    }

    const togglePasswordVisibility = () => setPasswordVisible(prev => !prev)
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(prev => !prev)

    const validationSchema = yup.object().shape({
        password: yup
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(20, 'Password cannot exceed 20 characters')
            .matches(CONTAIN_1_LOWERCASE_LETTER, 'Password must contain at least one lowercase letter')
            .matches(CONTAIN_1_UPPERCASE_LETTER, 'Password must contain at least one uppercase letter')
            .matches(CONTAIN_1_NUMBER, 'Password must contain at least one number')
            .matches(CONTAIN_1_SPECIAL_CHARACTER, 'Password must contain at least one special character')
            .notOneOf(['password', '12345678'], 'Do not use a common or weak password')         
            .required('Password is required'),
        confirmPassword: yup.string()
            .required('Confirm Password is required')
            .oneOf([yup.ref('password'), null], 'Passwords must match'),            
    })

    if(!stateData || !stateData.email){
        return <></>
    }

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
                                Reset your <br /> password
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
                                        password: '', confirmPassword: ''
                                    }}

                                    onSubmit={values => {
                                        return setApiReqs({
                                            isLoading: true,
                                            errorMsg: null,
                                            data: {
                                                type: 'resetPassword',
                                                requestInfo: {
                                                    url: 'users/reset-password',
                                                    method: 'POST',
                                                    data: {
                                                        newPassword: values.password,
                                                        email: stateData.email
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

                                            <div className="mb-5">
                                                <label className="font-family-Axiforma txt-13 mb-2 fw-500 txt-696969">
                                                    Confirm Password
                                                </label>
                                                <br />
                                                <div className="d-flex align-items-center justify-content-between auth-input-field">
                                                    <input 
                                                        type={confirmPasswordVisible ? 'text' : "password"}
                                                        name="confirmPassword"
                                                        value={values.confirmPassword}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className="col-lg-11"
                                                        placeholder="********************"
                                                    />
                                                    <div className="col-lg-1 d-flex align-items-center justify-content-end">
                                                        {
                                                            confirmPasswordVisible
                                                            ?
                                                                <FaEye color="#1352F1" size={20} onClick={toggleConfirmPasswordVisibility} />
                                                            :
                                                                <FaEyeSlash color="#1352F1" size={20} onClick={toggleConfirmPasswordVisibility} />
                                                        }
                                                    </div>
                                                </div>
                                                <ErrorMessage 
                                                    name="confirmPassword" 
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
                                                    Reset
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