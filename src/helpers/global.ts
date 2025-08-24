import { randomBytes } from "crypto";

// Interfaces
export interface File {
    fileName: string,
    created: Date,
    id: string,
}


// Constants
export const Colors = {
    "primary": "rgb(79, 79, 224)",
    "darkprimary": "rgb(36, 36, 105)"
}

export const ALTCHA_HMAC_KEY: string = process.env.ALTCHA_HMAC_KEY || randomBytes(16).toString('hex');


export const getSettings = async() => {
    const out = await fetch("/api/settings");
    const outJson: {masterpassword: boolean, defaultheme: string} = await out.json();
    return outJson;
} 
export const isAdmin = () => {
    if (typeof window == 'undefined') return false;
    return localStorage.getItem("isadmin") === "yes";
}
export const isLoggedIn = () => {
    if (typeof window == 'undefined') return false;
    return localStorage.getItem("loggedin") === "yes";
}

// Dark mode
type notifier = (currentStatus: boolean) => void;
export const DarkModeNotifiers: notifier[] = [];
export let DarkMode = true;
export const updateDarkMode = (status: boolean) => {
    DarkMode = status;
    DarkModeNotifiers.forEach((f)=>f(status));
    if (typeof window == 'undefined') return;
    localStorage.setItem("darkmode", status?"yes":"no")
};
// End of dark mode