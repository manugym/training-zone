import { use, useEffect } from "react";
import "./Chat.css";
import NavBar from "../../components/NavBar/NavBar";
import websocketService from "../../services/websocket.service";
import apiService from "../../services/api.service";
import chatService from "../../services/chat.service";
import All_Users_With_Conversation from "../../components/All_Users_With_Conversation/All_Users_With_Conversation";
import Conversation from "../../components/Conversation/Conversation";
import userService from "../../services/user.service";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCurrentUser() {
      await userService.loadCurrentUser();
      const currentUser = userService.getCurrentUser();

      if (!currentUser) {
        console.log("No hay usuario autenticado");
        navigate("/auth", { state: { from: location.pathname } });
      }
    }

    loadCurrentUser();
  }, []);

  //Connect to the WebSocket server
  useEffect(() => {
    async function connectSocket() {
      console.log("Conectando el socket, JWT :", apiService.jwt);
      await websocketService.connect();
    }

    connectSocket();

    return () => {
      websocketService.disconnect();
    };
  }, []);

  //Sends the request to get all users chats
  useEffect(() => {
    async function sendGetAllUsersWithChatRequest() {
      await chatService.sendGetAllChatsRequest();
    }

    sendGetAllUsersWithChatRequest();
  }, []);

  return (
    <>
      <NavBar />
      <main className="chat-container">
        <div className="chat-wrapper">
          <div className="users-panel">
            <All_Users_With_Conversation />
          </div>
          <div className="conversation-panel">
            <Conversation />
          </div>
        </div>
      </main>
    </>
  );
}

export default Chat;
