'use client'
import { useRecordVoice } from "@/lib/hooks/use-record-voice";
import { IconMicrophone } from "@/components/ui/icons";
import * as React from "react";

export function Microphone() {
    const { toggleRecording, recording, text } = useRecordVoice();

    const handleButtonClick = async () => {
        if (recording && text.length > 0) {
            await toggleRecording();
        } else {
            await toggleRecording();
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <button
                onClick={async (event) => {
                    event.preventDefault();
                    await handleButtonClick();
                }}
                className="border-none bg-transparent w-10"
            >
                <IconMicrophone/>
            </button>
        </div>
    );
}
