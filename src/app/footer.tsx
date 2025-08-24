import Link from "next/link";

import { DarkMode, DarkModeNotifiers } from "@/helpers/global";
import { useEffect, useState } from "react";

export default function Footer() {
    const [darkMode, setDarkMode] = useState(DarkMode);
    useEffect(()=>{
        DarkModeNotifiers.push((status: boolean) => {
            setDarkMode(status);
        });
    }, [])

    return (
        <nav className="text-white bg-semidark" style={{height: "225px"}}>
            <h4 className="p-3 hide-900">Bluebox</h4>
            <div suppressHydrationWarning className="d-flex justify-content-center ps-2 gap-3 w-100 collapse-900 pt-4 bg-semidark" style={{marginTop: "-75px"}}>
                <div className="d-flex flex-column">
                    <b className="fs-4 text-uppercase">Project Links</b>
                    <ul style={{marginLeft: "-15px"}}>
                        <li>
                            <Link href="https://github.com/varppi/bluebox" className="text-decoration-none fs-5">Github</Link>
                        </li>
                        <li>
                            <Link href="https://github.com/varppi/bluebox/issues" className="text-decoration-none fs-5">Report an issue</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}