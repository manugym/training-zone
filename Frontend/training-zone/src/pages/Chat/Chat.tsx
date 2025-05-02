import React, { use, useEffect, useState } from "react";
import "./Chat.css";
import NavBar from "../../components/NavBar/NavBar";
import websocketService from "../../services/websocket.service";
import apiService from "../../services/api.service";
import { User } from "../../models/user";

function Chat() {
  const [userChat, setUserChat] = useState<User | null>(null);

  //Connect to the WebSocket server
  useEffect(() => {
    async function connectSocket() {
      console.log("JWT:", apiService.jwt);
      await websocketService.connect();
    }

    connectSocket();
  }, []);

  return (
    <>
      <NavBar />
      <main className="chat-container">
        <h1>Chat</h1>
      </main>
    </>
  );
}

export default Chat;
