import React from "react";


export default function CustomErrorMsg({ errorMsg, isCentered }){
    return (
        <p 
            style={{
                textAlign: isCentered ? 'center' : 'left',
                color: '#EC2020'
            }}
            className="m-0 p-0 font-family-Axiforma txt-13 fw-600 txt-EC2020 py-2"
        >
            { errorMsg }
        </p>
    )
}