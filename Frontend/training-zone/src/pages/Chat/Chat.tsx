import React, { use, useEffect } from "react";
import "./Chat.css";
import NavBar from "../../components/NavBar/NavBar";
import websocketService from "../../services/websocket.service";
import apiService from "../../services/api.service";

function Chat() {
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
