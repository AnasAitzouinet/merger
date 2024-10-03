'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { socket } from './socket';

export default function Twitch() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [messages, setMessages] = useState<string[]>([]);

    const getMessages = useCallback((msg: string) => {
        setMessages((prev) => [...prev, msg]);
    }, []);

    useEffect(() => {
        // Event listener for connection
        function onConnect() {
            setIsConnected(true);
        }

        // Event listener for disconnection
        function onDisconnect() {
            setIsConnected(false);
        }


        // Add event listeners
        socket.on('connect', onConnect);
        socket.on('get-message', getMessages);
        socket.on('disconnect', onDisconnect);

        // Clean up the event listeners when the component unmounts
        return () => {
            socket.off('connect', onConnect);
            socket.off('get-message', getMessages); // Clean up the get-message listener
            socket.off('disconnect', onDisconnect);
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
