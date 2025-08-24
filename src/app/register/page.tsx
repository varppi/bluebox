'use client'
import { Button, TextField } from "@mui/material";
import styles from './page.module.css';
import BlockBackground from "../components/block_background";
try {
    require("altcha");
}catch {}
import { FormEvent, useEffect, useState } from "react";
import Header from "../header";
import Footer from "../footer";
import { getSettings } from "@/helpers/global";

export default function Register() {
    const [settings, setSettings] = useState<any>({masterpassword: false, defaultheme: "dark"});
    const [verification, setVerification] = useState<string>("");
    const [masterpassword, setMasterpassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [blockBackground, setBlockBackground] = useState(<></>);
    const updateSettings = async () => {
        setSettings(await getSettings());
    };
    useEffect(()=>{
        setBlockBackground(<BlockBackground></BlockBackground>)
        updateSettings();
    }, []);

    async function registerNewAccount() {
        const resp = await fetch('/api/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "altcha": verification,
                "masterpassword": masterpassword,
            }),
        })
        const respJson = await resp.json();
        if (resp.ok) setMessage(`Your account ID is ${respJson.id}. Keep it a secret and safe.`);
        else setMessage(respJson.message);
    }

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        registerNewAccount();
    }


    return (
        <>
            <Header></Header>
            <div style={{paddingTop: "75px"}}></div>

            <div className="d-flex justify-content-center" style={{paddingBottom: "calc(15vh + 250px)", paddingTop: "calc(10vh + 50px)"}}>
                {blockBackground}
                {
                    message.length == 0 
                    ?   <form onSubmit={onSubmit} className="semi-transparent-box d-flex flex-column p-4 m-2" style={{width: "100%", maxWidth: "740px"}}>
                            <h3 className="mb-3">Press The Button Below To Generate A Secret ID</h3>
                            <altcha-widget onverified={(e)=>setVerification(e.detail.payload)} challengeurl="/api/altcha"></altcha-widget>
                            {
                                settings.masterpassword 
                                ? <TextField onChange={(e)=>setMasterpassword(e.target.value)} className="mt-3" label="master password" type="password"></TextField>
                                : <></>
                            }
                            <Button type="submit" className="mt-3 bg-primary text-white" variant="outlined">Generate Secret ID</Button>
                        </form>
                    :   <div className="semi-transparent-box p-4 m-2">
                            {
                                message.toLowerCase().includes("your account id is") 
                                ? <>
                                    <p className="text-uppercase text-success fw-bold m-0" style={{fontSize: "calc(20px + 0.25vw)"}}>{message}</p>
                                    <Button className="mt-3 bg-warning text-white" href="/login">It's in a safe place</Button>
                                </>
                                : <>
                                    <p className="text-uppercase text-danger fw-bold m-0" style={{fontSize: "calc(20px + 0.25vw)"}}>{message}</p>
                                    <Button className="mt-3 bg-success text-white" href="/login">Take Me Back</Button>
                                </>
                            }
                        </div>
                }
            </div>
            <Footer></Footer>
        </>
    )
}