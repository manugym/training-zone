import { useEffect } from "react";
import "./Chat.css";
import NavBar from "../../components/NavBar/NavBar";
import websocketService from "../../services/websocket.service";
import chatService from "../../services/chat.service";
import All_Users_With_Conversation from "../../components/All_Users_With_Conversation/All_Users_With_Conversation";
import Conversation from "../../components/Conversation/Conversation";
import userService from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Chat() {
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCurrentUser() {
      await userService.loadCurrentUser();
      const currentUser = userService.getCurrentUser();

      if (!currentUser) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Necesitas iniciar sesión",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        navigate("/auth", { state: { from: location.pathname } });
      }
    }

    loadCurrentUser();
  }, []);

  //Connect to the WebSocket server
  useEffect(() => {
    async function connectSocket() {
      await websocketService.connect();
    }

    connectSocket();
  }, []);

  //Sends the request to get all user chats
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
