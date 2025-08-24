'use client'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const Background = styled.div`
    position: fixed;
    z-index: -1;
`

const spinneroon = keyframes`
    0% {
        transform: rotate(0deg);
    },
    100% {
        transform: rotate(360deg);
    }
`

const Block = styled.div `
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: var(--bs-primary);
    opacity: 0.5;
    border-radius: 10px;
    animation: ${spinneroon} 10s linear infinite;
`

export default function BlockBackground() {
    let blockList: any[] = [];
    for (let i = 0; i < 2500; i++) {
        blockList.push(<Block suppressHydrationWarning key={i} style={{top: Math.round(Math.random()*10000-5000), left: Math.round(Math.random()*10000-5000)}}></Block>)
    }
    return (
        <Background>
            {blockList.map(x => x)}
        </Background>
    )
}