'use client'
import Image from "next/image";
import { Button } from "@mui/material";
import styles from './page.module.css';
import BlockBackground from "./components/block_background";
import { useEffect, useState } from "react";
import Header from "./header";
import Footer from "./footer";
import { DarkMode, DarkModeNotifiers } from "@/helpers/global";
import { Colors } from "@/helpers/global";

export default function Home() {
  const [darkMode, setDarkMode] = useState(DarkMode);
  const [blockBackground, setBlockBackground] = useState(<></>);
  useEffect(()=>{
      setBlockBackground(<BlockBackground></BlockBackground>)
      DarkModeNotifiers.push((status: boolean)=>{
        setDarkMode(status);
      })
  }, []);

  return (
    <>
      <Header></Header>
      <div style={{paddingTop: "75px"}}></div>
      <main>
        <section style={{paddingTop: "155px", paddingBottom: "300px"}} className="w-100 d-flex justify-content-center">
          {blockBackground}
          <div className="w-100">
            <div className="d-flex justify-content-center">
              <h1 suppressHydrationWarning className={`display-1 m-0 ${darkMode ? 'text-grad-dblue-blue' : 'text-grad-wblue-blue'} ${styles.title}`}>Bluebox</h1>
            </div>

            <div className="mt-4 d-flex justify-content-center gap-3 mx-1">
              <Button href="/files" className={styles.frontbutton} variant="outlined">Browse Files</Button>
              <Button href="/register" className={`${styles.frontbutton} ${styles.frontbutton_main}`} variant="outlined">Get Started</Button>
            </div>
          </div>
        </section>

        <div suppressHydrationWarning className="wave" style={{backgroundColor: darkMode ? Colors.darkprimary : "rgb(94, 94, 253)"}}></div>
        
        <section suppressHydrationWarning className={`text-light pb-5`} style={{marginTop: "-40px", 
            paddingTop: "100px", 
            backgroundColor: darkMode ? Colors.darkprimary : "rgb(94, 94, 253)"}}>
          <div className="d-flex justify-content-center" style={{marginBottom: "100px", marginTop: "20px"}}>
            <h1 className={`display-4 border border-2 border-white p-5 m-1`}>Answers to common questions</h1>
          </div>

          <div className="d-flex justify-content-center">
            <div className="d-flex justify-content-center collapse-900 semi-transparent-box p-4 m-2">
              <div>
                <div className="d-flex justify-content-center" style={{maxWidth: "900px"}}>
                  <div>
                    <h1 className="display-5 m-0">What is bluebox?</h1>
                    <p className="bigtext">Bluebox is an anonymous file sharing platform to share whatever you want with the world. Bluebox is an open source project meaning <b>ANYONE</b>, even you can host it and provide this service to people.</p>
                  </div>
                </div>
              </div>
              <div className="ms-5">
                <div className="d-flex justify-content-center">
                  <img className="hide-900 hide-1200" style={{maxWidth: "400px", marginTop: "-50px"}} src="/images/files.png"></img>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center" style={{marginTop: "75px"}}>
            <div className="d-flex justify-content-center collapse-900 semi-transparent-box p-4 m-2">
              <div>
                <div className="d-flex justify-content-center">
                  <img className="hide-900 hide-1200 me-5" style={{maxWidth: "400px", marginTop: "-50px"}} src="/images/start.png"></img>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-center" style={{maxWidth: "900px"}}>
                  <div>
                    <h1 className="display-5 m-0">How do I get started?</h1>
                    <p className="bigtext">It's easy! First you go to the registration page, click the generate button which generates you an unique identifier which you will use to log into your account. Next you log into your account and from there you can upload files. <b>Please note, all files are publicly visible, so don't share your personal information.</b></p>
                    <Button href="/register" className={`${styles.frontbutton_main} ${styles.frontbutton}`}>Register</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{marginBottom: "100px"}}></div>
        </section>
      </main>
      <Footer></Footer>
    </>
  );
}
