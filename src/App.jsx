import React, { useEffect, useState } from 'react'
import { Router, Scripts, ScrollRestoration, useNavigate } from 'react-router-dom'
import './App.css'
import { ToastContainer, toast, Bounce } from "react-toastify";
import FullScreenLoading from './components/loaders/fullScreenLoading/FullScreenLoading'
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, setUserDetails } from './redux/slices/userDetailsSlice';
import MainRouter from './components/main/router/MainRouter';
import { appLoadStart, appLoadStop } from './redux/slices/appLoadingSlice';
import { onRequestApi } from './components/apiRequests/requestApi';
import InitialLoad from './components/loaders/fullScreenLoading/InitialLoad';




function App() {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const navigateTo = (path) => navigate(path)
  const goToDashboard = () => navigateTo('/dashboard')

  const userDetails = useSelector(state => getUserDetails(state).details)

  const user_id = localStorage.getItem('user_id')
  const accessToken = localStorage.getItem('accessToken')
  
  const [apiReqs, setApiReqs] = useState({ 
    isLoading: true,
    errorMsg: null,
    data: {
      type: 'initialFetch',
      requestInfo: {
        url: 'users/get-single-user',
        method: 'POST',
        data: {
          user_id
        },
        token: accessToken
      }
    }
  })

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if(isLoading && data){
      const { type, requestInfo } = data

      if(type == 'initialFetch'){
        onRequestApi({
          requestInfo,
          successCallBack: initialFetchSuccess,
          failureCallback: initialFetchFailure
        })
      }
    }
  }, [apiReqs])

  const initialFetchSuccess = ({ result }) => {
    try {

      const { data } = result
      const { details, accessToken, complaints, allComplaints } = data

      goToDashboard()

      dispatch(setUserDetails({
        details, accessToken, complaints, allComplaints
      }))

      setApiReqs({ isLoading: false, data: null, errorMsg: null })

      return;
      
    } catch (error) {
      console.error(error)
      return initialFetchFailure({ errorMsg: 'Something went wrong! Try again.' })
    }
  }

  const initialFetchFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, data: null, errorMsg })

    return;
  }

  if(apiReqs.isLoading){
    return <InitialLoad />
  }
  
  return (
    <div className='w-100 h-100 p-0 m-0'>
      
      <MainRouter />

      <FullScreenLoading />

      <ToastContainer 
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}      
      />
    </div>
  )
}

export default App
