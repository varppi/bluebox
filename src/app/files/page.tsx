'use client'
import { Button, Pagination, TextField } from "@mui/material";
import styles from './page.module.css';
import BlockBackground from "../components/block_background";
import { FormEvent, useEffect, useState } from "react";
try {
    require("altcha");
}catch {}
import Footer from "../footer";
import Header from "../header";
import { DarkMode } from "@/helpers/global";
import { useParams, useSearchParams } from "next/navigation";

interface File {
    id: string,
    created: Date,
    fileName: string,
}

export default function Login() {
    let curPage = 0;
    try {
        const splits = window.location.href.split("?page=");
        if (splits.length > 1) {
            curPage = parseInt(splits[1])
        }
    }catch {}
    const [page, setPage] = useState<number>(curPage);
    const [maxPages, setMaxPages] = useState(1);
    const [files, setFiles] = useState<File[]>([]);
    const [blockBackground, setBlockBackground] = useState(<></>);
    useEffect(()=>{
        setBlockBackground(<BlockBackground></BlockBackground>)
        getFiles()
    }, []);
    useEffect(()=>{
        getFiles();
    }, [page])

    async function getFiles() {
        const result = await fetch("/api/files", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                page: page,
            })
        });
        const resultJson = await result.json();
        setFiles(resultJson["files"]);
        setMaxPages(resultJson["maxpages"]);
    }

    return (
    <>
        {blockBackground}
        <Header></Header>
        <div style={{paddingTop: "75px"}}></div>
        
        <div className="mt-5 d-flex justify-content-center">
            <div>
                <div className="d-flex justify-content-center">
                    <h1>File Repository</h1>
                </div>
                <div className="d-flex m-1 p-3 flex-column semi-transparent-box" style={{width: "1000px", maxWidth: "100%"}}>
                    <div className="d-flex">
                        <div className="filerepo-big-labels" style={{width: "40%"}}>
                            <h4>Filename</h4>
                        </div>
                        <div className="filerepo-big-labels" style={{width: "30%"}}>
                            <h4>Created</h4>
                        </div>
                        <div className="filerepo-big-labels" style={{width: "25%"}}>
                            <h4>Action</h4>
                        </div>
                    </div>
                    {
                        files.map(file => 
                        <div key={file.id} className="mt-1 mb-1 border-bottom pb-1 d-flex flex-wrap w-100 filerepo-list">
                            <div style={{width: "40%"}}>
                                <p className="filerepo-text">
                                    <span className="fw-bold small-label">File: </span>
                                    {file.fileName.length > 35 ? `${file.fileName.substring(0,35)}...` : file.fileName}
                                </p>
                            </div>
                            <div style={{width: "30%"}}>
                                <p className="filerepo-text">
                                <span className="fw-bold small-label">Created: </span>
                                {file.created.toLocaleString()}
                                </p>
                            </div>
                            <div style={{width: "25%"}}>
                                <Button className="w-100 p-0 bg-primary text-white" href={`/api/files/${file.id}`}>download</Button>
                            </div>
                        </div>)
                    }
                    <Pagination onChange={(_,v)=>{setPage(v-1)}} count={maxPages} size="large"/>
                </div>
            </div>
        </div>
        <div style={{marginTop: "500px"}}></div>
        <Footer></Footer>
    </>
    )
}