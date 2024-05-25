'use client'

import { useEffect, useState, useRef } from "react";
import { blobToBase64 } from "@/lib/utils";
import { createMediaStream } from "@/lib/utils";
import { useActions } from "ai/rsc";
import { nanoid } from 'nanoid';
import { UserMessage } from "@/components/stocks/message";
import * as React from "react";
import { useUIState } from "ai/rsc";
import { AI } from "@/lib/chat/actions";

export const useRecordVoice = () => {
    const [text, setText] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);
    const chunks = useRef<Blob[]>([]);
    const { transcribeUsersVoice, submitUserMessage } = useActions();
    const [messages, setMessages] = useUIState<typeof AI>();

    const toggleRecording = async () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.start();
            setRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    const initializeMediaRecorder = (stream: MediaStream) => {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.onstart = () => {
            createMediaStream(stream, true);
            chunks.current = [];
        };

        mediaRecorder.ondataavailable = (ev: BlobEvent) => {
            chunks.current.push(ev.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
            const base64data = await blobToBase64(audioBlob);
            const transcription = await transcribeUsersVoice(base64data);
            setText(transcription.userText);

            const newUserMessage = {
                id: nanoid(),
                display: <UserMessage>{transcription.userText}</UserMessage>
            };

            setMessages(currentMessages => [
                ...currentMessages,
                newUserMessage
            ]);

            const responseMessage = await submitUserMessage(transcription.userText);
            setMessages(currentMessages => [
                ...currentMessages,
                responseMessage
            ]);
        };

        setMediaRecorder(mediaRecorder);
    };



    useEffect(() => {
        if (typeof window !== "undefined") {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(initializeMediaRecorder)
                .catch(error => {
                    console.error('Error accessing microphone:', error);
                });

            return () => {
                if (mediaRecorder) {
                    mediaRecorder.stream.getTracks().forEach(track => track.stop());
                }
            };
        }
    }, []);

    return { recording, toggleRecording, text };
};
