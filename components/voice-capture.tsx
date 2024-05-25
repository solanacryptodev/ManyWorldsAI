'use client'

import { Microphone } from "./ui/microphone";
import { useRef } from "react";


export function VoiceCapture() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const reader = new FileReader();
    //reader.readAsDataURL(botVoiceResponse);

    setTimeout(() => {
        reader.onload = () => {
            if (audioRef.current) {
                audioRef.current.src = reader.result as string;
                audioRef.current.play();
            }
        };
    }, 5000)

    return (
        <div className="z-5 flex flex-col items-center justify-between">
            <Microphone />
        </div>
    );
}
