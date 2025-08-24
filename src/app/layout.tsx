'use client'
import "../styles/global.css";
import type { Metadata } from "next";
import Header from "./header";
import { createTheme, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Footer from "./footer";
import { DarkMode, DarkModeNotifiers } from "@/helpers/global";
import { useEffect, useState } from "react";

const metadata: Metadata = {
  title: "Bluebox file storage",
  description: "Put your files for all the world to see!",
};

const theme = createTheme({
  components: {
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            color: "var(--bs-primary)",
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: DarkMode ? 'white' : 'black',
          },
          '& .MuiOutlinedInput-root': {
            color: DarkMode ? 'white' : 'black',
            '& fieldset': {
              borderColor: 'var(--bs-primary)',
              borderWidth: '2px',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--bs-primary)',
              borderWidth: '3px',
            },
            '&:hover fieldset': {
              borderColor: 'var(--bs-primary)',
              borderWidth: '3px',
            },
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "700",
          padding: "10px",
        }
      }
    }
  }
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  useEffect(()=>{
    DarkModeNotifiers.push((status: boolean)=>{
      setDarkMode(status)
    })
  }, [])
  return (
    <html lang="en" data-bs-theme={darkMode ? "dark" : "light"}>
      <body>
        <AppRouterCacheProvider options={{  }}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
