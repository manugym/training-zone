import React, { use, useEffect, useState } from "react";
import "./Chat.css";
import NavBar from "../../components/NavBar/NavBar";
import websocketService from "../../services/websocket.service";
import apiService from "../../services/api.service";
import { User } from "../../models/user";
import chatService from "../../services/chat.service";
import All_Users_With_Conversation from "../../components/All_Users_With_Conversation/All_Users_With_Conversation";

function Chat() {
  //Connect to the WebSocket server
  useEffect(() => {
    async function connectSocket() {
      console.log("JWT:", apiService.jwt);
      await websocketService.connect();
    }

    connectSocket();
  }, []);

  //Sends the request to get all users who have had conversations with the current user
  useEffect(() => {
    async function sendGetAllUsersWithChatRequest() {
      await chatService.sendGetAllUsersWithChatRequest();
    }

    sendGetAllUsersWithChatRequest();
  }, []);

  return (
    <>
      <NavBar />
      <main className="chat-container">
        <h1>Chat</h1>

        <div>
          <All_Users_With_Conversation />
        </div>
      </main>
    </>
  );
}

export default Chat;
