import { Button } from "@mui/material";
import styles from "./header.module.css";
import { DarkMode, getSettings, isLoggedIn, updateDarkMode } from "@/helpers/global";
import { useEffect, useState } from "react";
import { Moon01,Sun } from "@untitledui/icons"

export default function Header() {
    const getLocalState = async () => {
        let final = localStorage.getItem("darkmode") === "yes";
        if (localStorage.getItem("darkmode") === null) {
            final = (await getSettings()).defaultheme === "dark"
        }
        return final;
    }
    const [darkMode, setDarkMode] = useState<boolean>();
    function toggleDarkMode() {
        updateDarkMode(!DarkMode);
        setDarkMode(DarkMode);
    } 
    useEffect(() => {
        getLocalState().then(darkMode => {
            updateDarkMode(darkMode);
            toggleDarkMode();
            toggleDarkMode();
        })
    }, [])


    return <nav className={`${styles.header} d-flex px-3 rounded-5`} style={{
            gap: "1vw",
            background: darkMode ? "linear-gradient(180deg, rgba(55, 41, 119, 0.25), rgba(0, 0, 0, 0))"
            : "linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.25))"
            }}>
        <Button style={{color: darkMode ? 'white' : 'var(--bs-primary)'}} className="nav-button" href="/">Home</Button>
        <Button style={{color: darkMode ? 'white' : 'var(--bs-primary)'}} className="nav-button" href="/files">Files</Button>
        {
            isLoggedIn() 
            ? <>
                <Button style={{color: darkMode ? 'white' : 'var(--bs-primary)'}} className="nav-button" href="/dashboard">Dashboard</Button>
            </>
            : <>
                <Button style={{color: darkMode ? 'white' : 'var(--bs-primary)'}} className="nav-button" href="/login">Login</Button>
                <Button style={{color: darkMode ? 'white' : 'var(--bs-primary)'}} className="nav-button" href="/register">Register</Button>
            </>
        }
        <div className="w-100"></div>
        <Button style={{color: darkMode ? 'white' : 'var(--bs-primary)'}} onClick={()=>{toggleDarkMode()}}>
            { darkMode ? <Sun></Sun> : <Moon01></Moon01> }
        </Button>
    </nav>
}