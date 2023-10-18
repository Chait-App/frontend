// app/socket/page.js
'use client'
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketConnection = () => {
 const [socket, setSocket] = useState(null);
 const [isConnected, setIsConnected] = useState(false);

 const handleConnect = () => {
    if (isConnected) {
      alert('You are already connected to this room.');
      return;
    }

    const newSocket = io('http://192.168.1.25:3000', {
      withCredentials: true,
      extraHeaders: {
        'my-custom-header': 'abcd'
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server.');
      newSocket.emit('roomMessage', { message: `\nHello from client:  ${newSocket.id}` });
      setIsConnected(true);
    });

    newSocket.on('roomId', (roomId) => {
      console.log('Received roomId:', roomId);
    });

    newSocket.on('roomReady', () => {
      console.log('Room is ready, you are connected to another client.');
    });

    setSocket(newSocket);
 };

 const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
      console.log('Disconnected from server.');
      setIsConnected(false);
    }
 };

 useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        console.log('Disconnected from server.');
      }
    };
 }, [socket]);

 return (
    <div>
      <p>Socket.IO Client Example</p>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect</button>
    </div>
 );
};

export default SocketConnection;