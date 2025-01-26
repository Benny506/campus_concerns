import React, { useEffect } from "react";


export default function ScrollToTop({ children, scrollToTopConition }){

    useEffect(() => {
        if(scrollToTopConition){
            window.scrollTo(0, 0)
        }
    }, [scrollToTopConition])

    return (
        <div>
            {
                children
            }
        </div>
    )
}