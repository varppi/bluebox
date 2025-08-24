'use client'

import { useState, useEffect, FormEvent } from "react";
import { Colors, DarkMode, DarkModeNotifiers, isAdmin } from "@/helpers/global";
import Header from "../header";
import { Button, FormControl, TextField } from "@mui/material";
import { Building08, File01, File02, Home01, Home02, Settings01, User01 } from "@untitledui/icons"
import { File } from "@/helpers/global";
import Footer from "../footer";

interface Views {
    [key: string]: any;
}

interface Modals {
    [key: string]: any;
}


export default function Page() {
    
    const [view, setView] = useState<string>();
    const [modal, setModal] = useState<string>();
    
    const [files, setFiles] = useState<File[]>([]);
    const [fileUploadMessage, setFileUploadMessage] = useState<string>("");
    const [uploadFile, setUploadFile] = useState<any>();
    
    const [userDetails, setUserDetails] = useState<{id: string, files: File[], message: string} | null>(null);
    const [fileDetails, setFileDetails] = useState<{createdBy: string, message: string, id: string} | null>(null);
    const [targetUserID, setTargetUserID] = useState("");
    const [targetFileID, setTargetFileID] = useState("");

    const [darkMode, setDarkMode] = useState<boolean>(DarkMode);
    useEffect(()=>{
        DarkModeNotifiers.push((status: boolean)=>{
            setDarkMode(status);
        });
        getFiles().then(out => setFiles(out));
        setView(window.location.href.includes("#") ? window.location.href.split("#")[1] : "home");
    }, []);
    useEffect(()=>{
        setTimeout(()=>{
            getFiles().then(out => setFiles(out));
        }, 1000)
    }, [modal]);
    
    function setUrlView(view: string) {
        window.location.replace(`${window.location.href.split('#')[0]}#${view}`);
        setView(view);
    }
    
    
    // Files
    async function getFiles() {
        const result = await fetch("/api/user/files");
        return await result.json() as File[];
    }
    
    async function deleteFile(id: string) {
        await fetch("/api/user/files", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: id}),
        });
        setTimeout(()=>{
            window.location.reload();
        }, 1000);
    }

    async function handleFileUpload() {
        if (uploadFile === undefined) return;
        const formData = new FormData();
        formData.append('file', uploadFile);
        const resp = await fetch("/api/user/files/upload", {
            method: "POST",
            body: formData,
        });

        if (resp.ok) setModal("");
        else setFileUploadMessage((await resp.json()).message);
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if ((event.target.files??[]).length < 1) return;
        setUploadFile((event.target.files??[])[0]);
    }
    // End of files

    // Account
    async function deleteAccount() {
        await fetch("/api/user", {
            method: "DELETE"
        });
        localStorage.clear();
        window.location.replace("/");
    }
    // End of account

    // Admin
    async function userSearch() {
        const result = await fetch("/api/admin/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "type": "user",
                "target": targetUserID,
            }),
        });
        const jsonResult = await result.json();
        if (jsonResult.message === "user not found") {
            setUserDetails({
                id: "",
                files: [],
                message: "user not found",
            });
            return;
        }
        setUserDetails({
            id: targetUserID,
            files: jsonResult.files,
            message: "user found",
        });
        setTargetUserID("");
    }

    async function fileSearch() {
        const result = await fetch("/api/admin/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "type": "file",
                "target": targetFileID,
            }),
        });
        const jsonResult = await result.json();
        if (jsonResult.message === "file not found") {
            setFileDetails({
                id: "",
                createdBy: "",
                message: "user not found",
            });
            return;
        }

        setFileDetails({
            id: targetFileID,
            createdBy: jsonResult.createdby,
            message: "file found",
        });
        setTargetFileID("");
    }

    async function banUser(targetID: string) {
        await fetch("/api/admin/ban", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": targetID,
            }),
        });

        setUserDetails(null);
    }
    // End of admin

    const modals: Modals = {
        "uploadFile": <div className="modal d-block" style={{zIndex: "1001"}}>
            <div className="modal-dialog">
                <div className="modal-content semi-transparent-box p-3 gap-3">
                    <h1 className="text-white m-0">Upload file</h1>
                    <input onChange={handleFileChange} type="file" className="text-white border rounded p-3"></input>
                    <div className="w-100 d-flex gap-2">
                        <Button onClick={()=>{setModal("")}} className="w-100 bg-danger text-white">Close</Button>
                        <Button onClick={()=>{handleFileUpload()}} className="w-100 bg-success text-white">Upload</Button>
                    </div>
                    {
                        fileUploadMessage.length > 0 
                        ? <p className="text-uppercase text-danger">{fileUploadMessage}</p>
                        : <></>
                    }
                </div>
            </div>
        </div>,

        "deleteConfirm": <div className="modal d-block" style={{zIndex: "1001"}}>
            <div className="modal-dialog">
                <div className="modal-content semi-transparent-box p-3 gap-3">
                    <h1 className="fs-3 text-white m-0">Confirm you want to delete your account</h1>
                    <div className="w-100 d-flex gap-2">
                        <Button onClick={()=>{setModal("")}} className="w-100 bg-success text-white">Close</Button>
                        <Button onClick={()=>{deleteAccount()}} className="w-100 bg-danger text-white shadow">Confirm Delete</Button>
                    </div>
                    {
                        fileUploadMessage.length > 0 
                        ? <p className="text-uppercase text-danger">{fileUploadMessage}</p>
                        : <></>
                    }
                </div>
            </div>
        </div>,
    }

    const views: Views = {
        "admin": <div className="mt-3 w-100 d-flex justify-content-center">
            <div className="w-100 d-flex justify-content-center">
                <FormControl className="p-3 semi-transparent-box" style={{maxWidth: "1000px", width: "100%"}}>
                    <h3>Account Search</h3>
                    <TextField value={targetUserID} onChange={(x)=>setTargetUserID(x.target.value)} label="user id"></TextField>
                    <Button onClick={()=>userSearch()} className="bg-primary text-white mt-2">Search</Button>
                    {
                        userDetails !== null 
                        ? userDetails.message === "user not found" ? <p className="text-danger text-uppercase fs-5 fw-bold">User not found</p> : 
                        <div className="d-flex flex-column">
                            <h4 className="mt-2 text-success">Results:</h4>
                            <p className="m-0"><b>User ID:</b> {userDetails.id}</p>
                            <b className="m-0">Files:</b>
                            <div className="d-flex flex-column ms-2">
                                {
                                    userDetails.files.map(file => <p className="m-0">{file.fileName} ({file.id})</p>)
                                }
                            </div>
                            <Button onClick={()=>banUser(userDetails.id)} className="bg-danger text-white w-25 mt-2">Ban User</Button>
                        </div>
                        : <></>
                    }
                    <h3 className="mt-3">File Search</h3>
                    <TextField value={targetFileID} onChange={(x)=>setTargetFileID(x.target.value)} label="file id"></TextField>
                    <Button onClick={()=>fileSearch()} className="bg-primary text-white mt-2">Search</Button>
                    {
                        fileDetails !== null 
                        ? fileDetails.message === "file not found" ? <p className="text-danger text-uppercase fs-5 fw-bold">File not found</p> : 
                        <div className="d-flex flex-column">
                            <h4 className="mt-2 text-success">Results:</h4>
                            <p className="m-0"><b>File ID:</b> {fileDetails.id}</p>
                            <p className="m-0"><b>Owner User ID:</b> {fileDetails.createdBy}</p>
                        </div>
                        : <></>
                    }
                </FormControl>
            </div>
        </div>,

        "account": <div className="mt-3 w-100 d-flex justify-content-center">
            <div>
                <div className="d-flex justify-content-center">
                    <h3>Account</h3>
                </div>
                <div className="semi-transparent-box p-3" style={{width: "600px", maxWidth: "100%"}}>
                    <Button className="bg-danger text-white w-100" href="/api/logout" onClick={()=>localStorage.clear()}>Log Out</Button>
                    <Button className="mt-2 bg-danger text-white w-100" onClick={()=>setModal('deleteConfirm')}>Delete Account</Button>
                </div>
            </div>
        </div>,

        "home": <div className="w-100">
            <div className="d-flex justify-content-center w-100">
                <div>
                    <div className="d-flex justify-content-center">
                        <h1>Welcome Home!</h1>
                    </div>
                    <p className="fs-5">Now that you're logged in you can do the following:</p>
                    <div className={`${darkMode ? 'shadow' : 'shadow shadow-sm'} mt-2 p-2 rounded-2`}>
                        <b className={`${darkMode ? '' : 'text-primary'} text-uppercase fs-4`} style={{textShadow: darkMode ? '' : '1px 1px 0 var(--bs-primary)'}}>1. Browse files uploaded by other users</b>
                    </div>
                    <div className={`${darkMode ? 'shadow' : 'shadow shadow-sm'} mt-2 p-2 rounded-2`}>
                        <b className={`${darkMode ? '' : 'text-primary'} text-uppercase fs-4`} style={{textShadow: darkMode ? '' : '1px 1px 0 var(--bs-primary)'}}>2. Share your own files with the world</b>
                    </div>
                    <div className={`${darkMode ? 'shadow' : 'shadow shadow-sm'} mt-2 p-2 rounded-2`}>
                        <b className={`${darkMode ? '' : 'text-primary'} text-uppercase fs-4`} style={{textShadow: darkMode ? '' : '1px 1px 0 var(--bs-primary)'}}>3. Have fun</b>
                    </div>
                </div>
            </div>
        </div>,

        "files": <div className="w-100 d-flex justify-content-center">
            <div className="d-flex flex-column semi-transparent-box p-3 w-100" style={{maxWidth: "1000px"}}>
                <h3 style={{borderBottom: "2px solid white", borderColor: darkMode ? "white" : "var(--bs-primary)"}} className="mb-3">Your Files</h3>
                {
                    files.map(file => <div key={file.id} className="d-flex flex-column border-bottom mt-4">
                        <div className="d-flex w-100">
                            <p className="m-0 fw-bold" style={{fontSize: "calc(15px + 0.5vw)"}}>{file.fileName.length > 60 ? `${file.fileName.substring(0,60)}...` : file.fileName}</p>
                        </div>
                        <p className="m-0 files-text">Created: {file.created.toString()}</p>
                        <div className="d-flex w-100 gap-2">
                            <div className="files-buttons">
                                <Button href={`/api/files/${file.id}`} className="bg-primary text-white p-2 w-100 mt-2 mb-2" style={{marginTop: "-5px"}}>Download</Button>
                            </div>
                            <div className="files-buttons">
                                <Button onClick={()=>{deleteFile(file.id)}} className="bg-danger text-white p-2 w-100 mt-2 mb-2" style={{marginTop: "-5px"}}>Delete</Button>
                            </div>
                        </div>
                    </div>)
                }
                <Button onClick={()=>{setModal("uploadFile")}} className="bg-primary text-white mt-3">Upload New File</Button>
            </div>
        </div>
    }

    return (
        <>
            <main suppressHydrationWarning style={{position: "absolute", width: "100vw", backgroundColor: darkMode ? Colors.darkprimary : 'white'}}>
                <Header></Header>
                <div style={{paddingTop: "80px"}}></div>
                <div className="dash-nav d-flex m-2 gap-3">
                    <nav className="semi-transparent-box-nocollapse d-flex dash-nav-buttons pt-2 pb-2 gap-3">
                        <Button className="rounded-5" onClick={()=>{setUrlView("home")}} style={{color: darkMode ? "white" : "var(--bs-primary)"}}><Home02></Home02></Button>
                        <Button className="rounded-5" onClick={()=>{setUrlView("files")}} style={{color: darkMode ? "white" : "var(--bs-primary)"}}><File02></File02></Button>
                        <Button className="rounded-5" onClick={()=>{setUrlView("account")}} style={{color: darkMode ? "white" : "var(--bs-primary)"}}><User01></User01></Button>
                        <Button className="rounded-5" onClick={()=>{setUrlView("settings")}} style={{color: darkMode ? "white" : "var(--bs-primary)"}}><Settings01></Settings01></Button>
                        {
                            isAdmin() 
                            ? <Button className="rounded-5" onClick={()=>{setUrlView("admin")}} style={{color: darkMode ? "white" : "var(--bs-primary)"}}><Building08></Building08></Button>
                            : <></>
                        }
                    </nav>
                    {views[view ?? "home"]}
                </div>
                {
                    (modal??"").length > 0 
                    ? <>
                        <div style={{top: "0", height: "100vh", width: "100vw", position: "absolute", backgroundColor: "black", zIndex: "1000", opacity: "0.75"}}></div>
                        {modals[modal??""]}
                    </>
                    : <></>
                }
                <div style={{height: "50vh"}}></div>
                <Footer></Footer>
            </main>
        </>
    )
}