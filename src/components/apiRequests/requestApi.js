import axios from "axios"
import helpers from "../helpers/helpers"

const { BaseUrl } = helpers

export const requestApi = async ({ url, method, data, token }) => {
    const headers = 
    { 
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8"    
    }

    if(token){
        headers['Authorization'] = `Bearer ${token}`
    }

    const config = {
        url: `${BaseUrl}${url}`, 
        method, 
        headers
    }

    if(data){
        config.data = data
    }

    console.log(config.url)

    return axios(config)
        .then(response => {         
            return { result: response.data, responseStatus: true }
        })
        .catch((error) => {
            console.log(error)
            if(error.response){
                //Request made and server responded
                return { responseStatus: false, errorMsg: error.response.data }
            } 


            else if(error.request){
                //Request made but no server response
                return { responseStatus: false, errorMsg: {error: 'Server error, try again later'} }
            } 
            
            
            else{
                return { responseStatus: false, errorMsg: {error: 'Server error, try again later'} }
            }
        })        

}


export const onRequestApi = async ({ requestInfo, successCallBack, failureCallback }) => {
    try {

        if(!successCallBack || !failureCallback || !requestInfo){
            return;
        }
        
        const request = await requestApi(requestInfo)

        const { result, responseStatus, errorMsg } = request

        if(responseStatus){
            return successCallBack({ requestInfo, result })
        
        } else{
            if(errorMsg && errorMsg.error){
                return failureCallback({ requestInfo, errorMsg: errorMsg.error })
            
            } else{
                return failureCallback({ requestInfo, errorMsg: 'Server error!' })
            }
        }
        
    } catch (error) {
        console.log(error)
        return failureCallback({ requestInfo, errorMsg: 'Server error!' })
    }
}

export const cloudinaryUpload = async ({ files, folderName, apikey, timestamp, signature, cloudname }) => {
    try {

        if(!folderName || !files || !apikey || !timestamp || !signature || !cloudname){
            throw new Error()
        }

        const url = "https://api.cloudinary.com/v1_1/" + cloudname + "/auto/upload";
        const formData = new FormData();
    
        const uploadedFiles = []
    
        for (let i = 0; i < files.length; i++) {          
            let file = files[i];

            formData.append("file", file);
            formData.append("upload_preset", "verionx_media")
            formData.append("api_key", apikey);
            formData.append("timestamp", timestamp);
            // formData.append("signature", signature);
            formData.append("folder", folderName);
    
            const uploadedFile = await fetch(url, { method: 'POST', body: formData, headers: { "content-type": "multipart/form-data" } })
            const uploadedFile_data = await uploadedFile.text()         
            const parsedFile = JSON.parse(uploadedFile_data)

            const { secure_url } = parsedFile

            if(parsedFile.error){
                console.log(parsedFile.error)
            }

            if(!secure_url){
                throw new Error()
            }

            uploadedFiles.push(secure_url)
        }
        
        return { responseStatus: true, result: uploadedFiles, errorMsg: null }

    } catch (error) {
        console.log(error)
        return { 
            responseStatus: false, 
            result: null, 
            errorMsg: {
                error: 'An unexpected error occured, try again later',
                actualError: error
            } 
        }
    }
}