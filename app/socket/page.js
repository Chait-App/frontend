// app/socket/page.js
'use client'
import React, { useEffect } from 'react';
import io from 'socket.io-client';

const SocketComponent = () => {
  useEffect(() => {
    const socket = io('http://localhost:3000', {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    })
    socket.on('connect', () => {
      console.log('Connected to server.');
    });
    
    socket.on('roomId', (roomId) => {
      console.log('Received roomId:', roomId);
    
      socket.emit('roomMessage', { message: 'Hello from client one' + socket.id });
    });
    
    socket.on('roomReady', () => {
      console.log('Room is ready, you are connected to another client.');
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <p>Socket.IO Client Example</p>
    </div>
  );
};

export default SocketComponent;
