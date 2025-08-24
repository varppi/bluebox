'use client'
import { Button, TextField } from "@mui/material";
import styles from './page.module.css';
import BlockBackground from "../components/block_background";
import { FormEvent, useEffect, useState } from "react";
try {
    require("altcha");
}catch {}

import Footer from "../footer";
import Header from "../header";

export default function Login() {
    const [verification, setVerification] = useState<string>("");
    const [SecretID, setSecretID] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [blockBackground, setBlockBackground] = useState(<></>);
    useEffect(()=>{
        setBlockBackground(<BlockBackground></BlockBackground>)
    }, []);

    async function login() {
        const result = await fetch('/api/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "secretid": SecretID,
                "altcha": verification,
            }),
        });
        const jsonResult = await result.json();

        if (result.ok) { 
            localStorage.setItem("isadmin", jsonResult.isadmin ? "yes" : "no");
            localStorage.setItem("loggedin", "yes");
            window.location.replace("/dashboard");
        }
        else setMessage(jsonResult.message);
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        login();
    }

    return (
    <>
        <Header></Header>
        <div style={{paddingTop: "75px"}}></div>
        
        <div className="d-flex justify-content-center" style={{paddingBottom: "calc(15vh + 250px)", paddingTop: "calc(10vh + 50px)"}}>
            {blockBackground}
            <form onSubmit={onSubmit} className={`semi-transparent-box d-flex flex-column p-4 m-2`} style={{width: "100%", maxWidth: "600px"}}>
                <h3>Login To Your Account</h3>
                <TextField className="mb-3" onChange={(e)=>setSecretID(e.target.value)} label="secret id" variant="outlined" type="password"></TextField>
                <altcha-widget onverified={(e)=>setVerification(e.detail.payload)} challengeurl="/api/altcha"></altcha-widget>
                <Button type="submit" className="mt-3 bg-primary text-white" variant="outlined">LOGIN</Button>
                {
                    message.length > 0 
                    ? <p className="text-danger fs-5 mt-3">{message}</p>
                    : <></>
                }
            </form>
        </div>
        <Footer></Footer>
    </>
    )
}