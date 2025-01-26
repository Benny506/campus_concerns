import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, setUserDetails } from "../../../../redux/slices/userDetailsSlice";
import { ErrorMessage, Formik } from "formik";
import CustomErrorMsg from "../../../customErrorMsg/CustomErrorMsg";
import { FaCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from 'yup'
import { appLoadStart, appLoadStop } from "../../../../redux/slices/appLoadingSlice";
import { onRequestApi } from "../../../apiRequests/requestApi";
import { toast } from "react-toastify";
import ScrollToTop from "../../../customScroll/ScrollToTop";
import { CONTAIN_1_LOWERCASE_LETTER, CONTAIN_1_NUMBER, CONTAIN_1_SPECIAL_CHARACTER, CONTAIN_1_UPPERCASE_LETTER, EMAIL_REGEX } from "../../../regex/regex";


const severeLevels = [
    'mild', 'moderate', 'urgent', 'severe'
]


export default function EditProile_Users(){
    const dispatch = useDispatch()

    const userDetails = useSelector(state => getUserDetails(state).details)
    const accessToken = useSelector(state => getUserDetails(state).accessToken)

    const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })
    const [usernameInput, setUsernameInput] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [oldPasswordInput, setOldPasswordInput] = useState('')
    const [newPasswordInput, setNewPasswordInput] = useState('')
    const [oldPasswordVisible, setOldPasswordVisible] = useState(false)
    const [newPasswordVisible, setNewPasswordVisible] = useState(false)

    useEffect(() => {
        const { isLoading, data } = apiReqs

        if(isLoading){
            dispatch(appLoadStart())

        } else{
            dispatch(appLoadStop())
        }

        if(isLoading && data){
            const { type, requestInfo } = data

            if(type == 'editProfile' || type == 'editEmail'){
                onRequestApi({
                    requestInfo,
                    successCallBack: editProfileSuccess,
                    failureCallback: editProfileFailure
                })
            }

            if(type == 'editPassword'){
                onRequestApi({
                    requestInfo,
                    successCallBack: editPasswordSuccess,
                    failureCallback: editPasswordFailure
                })                
            }
        }
    }, [apiReqs])





    //editProfile success & failure
    const editProfileSuccess = ({ result }) => {
        try {

            const { data } = result

            dispatch(setUserDetails({
                details: {
                    ...userDetails,
                    ...data
                }
            }))

            setApiReqs({ isLoading: false, data: null, errorMsg: null })

            toast.success('Profile updated')

            return;
            
        } catch (error) {
            console.error(error)
            return editProfileFailure({ errorMsg: 'Something went wrong! Try again.' })
        }
    }
    const editProfileFailure = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, data: null, errorMsg })
        toast.error(errorMsg)

        return;
    } 
    
    



    //editProfile success & failure
    const editPasswordSuccess = ({ result }) => {
        try {

            setApiReqs({ isLoading: false, data: null, errorMsg: null })

            toast.success('Your password has been reset')

            return;
            
        } catch (error) {
            console.error(error)
            return editPasswordFailure({ errorMsg: 'Something went wrong! Try again.' })
        }
    }
    const editPasswordFailure = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, data: null, errorMsg })
        toast.error(errorMsg)

        return;
    }       





    const handleUsernameInputChange = e => e && setUsernameInput(e.target.value)
    const handleEmailInputChange = e => e && setEmailInput(e.target.value)
    const handleOldPasswordInputChange = e => e && setOldPasswordInput(e.target.value)
    const handleNewPasswordInputChange = e => e && setNewPasswordInput(e.target.value)

    const toggleOldPasswordVisibility = () => setOldPasswordVisible(prev => !prev)
    const toggleNewPasswordVisibility = () => setNewPasswordVisible(prev => !prev)


    const editProfile = () => {
        if(!usernameInput){
            return returnErrorMsg({ errorMsg: 'You did not enter a new username' })
        }

        if(usernameInput.length > 20){
            return returnErrorMsg({ errorMsg: 'New username cannot be more than 20 characters' })
        }

        setUsernameInput('')

        return setApiReqs({ 
            isLoading: true,
            errorMsg: null,
            data: {
                type: 'editProfile',
                requestInfo: {
                    url: 'users/settings/edit-profile',
                    method: 'POST',
                    data: {
                        user_id: userDetails.user_id,
                        update: {
                            username: usernameInput
                        }
                    },
                    token: accessToken
                }
            }
        })
    }

    const editEmail = () => {
        if(!emailInput){
            return returnErrorMsg({ errorMsg: 'You did not enter a new email' })
        }

        if(!emailInput.match(EMAIL_REGEX)){
            return returnErrorMsg({ errorMsg: 'New email is not a valid email address' })
        }

        setEmailInput('')

        return setApiReqs({ 
            isLoading: true,
            errorMsg: null,
            data: {
                type: 'editEmail',
                requestInfo: {
                    url: 'users/settings/update-email',
                    method: 'POST',
                    data: {
                        user_id: userDetails.user_id,
                        email: emailInput
                    },
                    token: accessToken
                }
            }
        })
    }

    const editPassword = () => {
        if(!newPasswordInput){
            return returnErrorMsg({ errorMsg: 'You did not enter a new password' })
        }

        if(!oldPasswordInput){
            return returnErrorMsg({ errorMsg: 'You did not enter your old password' })
        }

        if(newPasswordInput.length <= 8){
            return returnErrorMsg({ errorMsg: 'New password must be more than 8 characters' })
        }

        if(!newPasswordInput.match(CONTAIN_1_SPECIAL_CHARACTER)){
            return returnErrorMsg({ errorMsg: 'New password must contain at least 1 special character' })
        }

        if(!newPasswordInput.match(CONTAIN_1_NUMBER)){
            return returnErrorMsg({ errorMsg: 'New password must contain at least 1 number' })
        }

        if(!newPasswordInput.match(CONTAIN_1_UPPERCASE_LETTER)){
            return returnErrorMsg({ errorMsg: 'New password must contain at least 1 uppercase letter' })
        }

        if(!newPasswordInput.match(CONTAIN_1_LOWERCASE_LETTER)){
            return returnErrorMsg({ errorMsg: 'New password must contain at least 1 lowercase letter' })
        }

        setNewPasswordInput('')
        setOldPasswordInput('')

        return setApiReqs({ 
            isLoading: true,
            errorMsg: null,
            data: {
                type: 'editPassword',
                requestInfo: {
                    url: 'users/settings/reset-password',
                    method: 'POST',
                    data: {
                        user_id: userDetails.user_id,
                        newPassword: newPasswordInput,
                        oldPassword: oldPasswordInput
                    },
                    token: accessToken
                }
            }
        })
    }    

    const returnErrorMsg = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, data: null, errorMsg })   
        toast.error(errorMsg)

        return;
    }

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
                        Edit profile
                    </h1>

                    <p className="m-0 p-0 txt-14 fw-600 font-family-Axiforma txt-000">
                        <span className="txt-4E4E4E fw-500">Dashboard</span> <span className="txt-4E4E4E mx-2">/</span> <span className="txt-000">Edit Profile</span>
                    </p>
                </div>

                <div>
                    <div className="w-lg-75 w-md-100 w-100">
                        {
                            apiReqs.errorMsg
                            &&
                                <div className="py-3">
                                    <CustomErrorMsg errorMsg={apiReqs.errorMsg} isCentered={true} />
                                </div>
                        }

                        <div className="mb-4">
                            <label className="font-family-Axiforma txt-14 mb-2 fw-600 txt-000">
                                Current username: <span className="fw-700">{ userDetails.username }</span>
                            </label>
                            <br />
                            <input 
                                type="text"
                                name="username"
                                value={usernameInput}
                                onChange={handleUsernameInputChange}
                                className="auth-input-field w-100 mb-2"
                                placeholder="New username"
                            />   
                            <button     
                                disabled={!usernameInput ? true : false}
                                onClick={editProfile}
                                className="auth-submit-btn"
                                style={{
                                    opacity: !usernameInput ? 0.5 : 1
                                }}
                            >
                                Save
                            </button>                                                         
                        </div>  

                        <div className="mb-4">
                            <label className="font-family-Axiforma txt-14 mb-2 fw-600 txt-000">
                                Current email: <span className="fw-700">{ userDetails.email }</span>
                            </label>
                            <br />
                            <input 
                                type="email"
                                name="email"
                                value={emailInput}
                                onChange={handleEmailInputChange}
                                className="auth-input-field w-100 mb-2"
                                placeholder="New email"
                            />   
                            <button     
                                disabled={!emailInput ? true : false}
                                onClick={editEmail}
                                className="auth-submit-btn"
                                style={{
                                    opacity: !emailInput ? 0.5 : 1
                                }}
                            >
                                Save
                            </button>                                                         
                        </div> 

                        <div className="my-5 py-2" />

                        <h1 className="m-0 p-0 mb-3 txt-46 fw-500 font-family-Axiforma">
                            Security
                        </h1>                         
                        
                        <div className="mb-4">
                            <label className="font-family-Axiforma txt-13 mb-2 fw-500 txt-696969">
                                Old Password   
                            </label>
                            <br />
                            <div className="d-flex align-items-center justify-content-between auth-input-field">
                                <input 
                                    type={oldPasswordVisible ? 'text' : "password"}
                                    name="password"
                                    value={oldPasswordInput}
                                    onChange={handleOldPasswordInputChange}
                                    className="col-lg-11"
                                    placeholder="********************"
                                />
                                <div className="col-lg-1 d-flex align-items-center justify-content-end">
                                    {
                                        oldPasswordVisible
                                        ?
                                            <FaEye  className="clickable" color="#1352F1" size={20} onClick={toggleOldPasswordVisibility} />
                                        :
                                            <FaEyeSlash className="clickable" color="#1352F1" size={20} onClick={toggleOldPasswordVisibility} />
                                    }
                                </div>
                            </div>                                                             
                        </div>

                        <div className="mb-4">
                            <label className="font-family-Axiforma txt-13 mb-2 fw-500 txt-696969">
                                New Password   
                            </label>
                            <br />
                            <div className="d-flex align-items-center justify-content-between auth-input-field mb-4">
                                <input 
                                    type={newPasswordVisible ? 'text' : "password"}
                                    name="password"
                                    value={newPasswordInput}
                                    onChange={handleNewPasswordInputChange}
                                    className="col-lg-11"
                                    placeholder="********************"
                                />
                                <div className="col-lg-1 d-flex align-items-center justify-content-end">
                                    {
                                        newPasswordVisible
                                        ?
                                            <FaEye className="clickable" color="#1352F1" size={20} onClick={toggleNewPasswordVisibility} />
                                        :
                                            <FaEyeSlash className="clickable" color="#1352F1" size={20} onClick={toggleNewPasswordVisibility} />
                                    }
                                </div>
                            </div>
                            <button     
                                disabled={(!newPasswordInput || !oldPasswordInput) ? true : false}
                                onClick={editPassword}
                                className="auth-submit-btn"
                                style={{
                                    opacity: (!newPasswordInput || !oldPasswordInput) ? 0.5 : 1
                                }}
                            >
                                Save
                            </button>                                                                                          
                        </div>                                                                                                                                                                             
                    </div>
                </div>
            </div>
        </ScrollToTop>
    )
}