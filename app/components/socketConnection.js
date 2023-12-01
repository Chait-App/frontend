// app/socket/page.js
"use client";
import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import dynamic from 'next/dynamic';


const SocketConnection = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomMessages, setRoomMessages] = useState({});
  const [room, setRoom] = useState(null);
  const [roomInfo, setRoomInfo] = useState({});
  let globalRoomId;

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const updateMessage = (event) => {
    setMessage(event.target.value);
  };

  const clearMessages = () => {
    setMessages([]);
    setRoomMessages([]);
  }

  const sendMessage = () => {
    if (!isConnected) {
      alert("You are not connected to a room.");
      return;
    }
    socket.emit("roomMessage", message); // roomId eklendi
    console.log("Sent message:", message);
    setMessage("");
  };

  const handleConnect = () => {
    if (isConnected) {
      alert("You are already connected to this room.");
      return;
    }

    const newSocket = io("http://192.168.1.19:3000", {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to server.");
      newSocket.emit("message", {
        message: `\nHello from client:  ${newSocket.id}`,
      });
      setIsConnected(true);
    });

    newSocket.on("roomId", (roomId) => {
      globalRoomId = roomId; // Global değişkeni set et
      setRoom(roomId); // Room state'ini set et
      console.log("Received roomId:", roomId);
    });


    newSocket.on("roomReady", () => {
      console.log("Room is ready, you are connected to another client.");
    });

    setSocket(newSocket);

  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
      console.log("Disconnected from server.");
      setIsConnected(false);
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        console.log("Disconnected from server.");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (message) => {
        setRoomMessages((prevRoomMessages) => {
          const roomId = room
          const updatedMessages = [...(prevRoomMessages[roomId] || []), message];
          return { ...prevRoomMessages, [roomId]: updatedMessages };
        });
      });
    }
  }, [socket, room]);

  useEffect(() => {
    if (roomMessages[room]) {
      setMessages(roomMessages[room]);
    }
  }
    , [roomMessages, room]);

    useEffect(() => {
      if(socket) {
        socket.on("roomInfo", (roomInfo) => {
          setRoomInfo(roomInfo)
        })
      }
    }
      , [socket, roomInfo]);

  return (
    <div>
      <p>Socket.IO Client Example</p>
      <input type="text" value={message} onChange={updateMessage} onKeyUp={onKeyPress}></input>
      <button onClick={sendMessage}>Send Message</button><br></br>
      <button onClick={handleConnect}>Connect</button><br></br>
      <button onClick={handleDisconnect}>Disconnect</button><br></br>
      <button onClick={clearMessages}>Clear Messages</button>
      <div>
        <p>Socket ID: {socket ? socket.id : "none"}</p>
        <p>Room ID: {room ? room : "none"}</p>
        <p>Connected: {isConnected ? "yes" : "no"}</p>
        <p>Room Members: {roomInfo["firstClientId"]}</p>

      </div>
      <div className="messages">
        <p>Messages:</p>
        <ul>
          {messages.map((messageObj, index) => (
            <li key={index}>{messageObj.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SocketConnection), {ssr: false})
