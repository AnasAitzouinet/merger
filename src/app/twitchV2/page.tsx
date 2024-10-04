'use client';

import React, { useCallback, useEffect, useState } from 'react';
import tmi from "tmi.js";


const client = new tmi.Client({
    connection: {
        reconnect: true,
        secure: true
    },

    identity: {
        username: 'Zephyr_dtk', // Your Twitch username
        password: 'oauth:gstdrz69uygdftnc8i13ilmpvqwuw2' // OAuth token from Twitch
    },

    channels: [
        "Subroza"
    ]
});

export default function Twitch() {
     const [messages, setMessages] = useState<string[]>([]);

    const getMessages = useCallback((msg: string) => {
        setMessages((prev) => [...prev, msg]);
    }, []);

    useEffect(() => {
        
        client.on('message', (channel, tags, message, self) => {
            if (self) return;
            getMessages(`${tags['badges']} ${tags['display-name']}: ${message}`);
        });

        client.connect().catch(console.error);

        client.on("connected", () => {
            console.log("Connected to Twitch");
        });
        
        return () => {
            client.disconnect();
            client.removeAllListeners();
        };


    }, [getMessages]);

    return (
        <div>
            <h1>Socket.IO Chat</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
        </div>
    );
}
