'use client'
import { useState, useEffect } from "react";
import BlockBackground from "./components/block_background";
import { Button } from "@mui/material";
export default function Custom500() {
    const [blockBackground, setBlockBackground] = useState(<></>);
    useEffect(()=>{
        setBlockBackground(<BlockBackground></BlockBackground>)
    }, []);

    return (
        <>
            {blockBackground}
            <div className="d-flex justify-content-center" style={{marginTop: "calc(5vh + 150px)", marginBottom: "calc(20vh + 300px)"}}>
                <div>
                    <h1 className="text-danger text-uppercase display-3">404 not found</h1>
                    <Button href="/" className="w-100 p-2 text-white bg-primary">Return Home?</Button>
                </div>
            </div>
        </>
    )
}