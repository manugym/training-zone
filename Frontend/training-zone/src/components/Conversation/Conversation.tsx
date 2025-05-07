import React, { useEffect, useState } from "react";
import { Chat } from "../../models/chat";
import chatService from "../../services/chat.service";
import userService from "../../services/user.service";
import "./Conversation.css";
import { User } from "../../models/user";

function Conversation() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Chat | null>(null);

  //subscription to get the current user
  useEffect(() => {
    const subscription = userService.currentUser$.subscribe((user) => {
      setCurrentUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //subscription to get the actual conversation
  useEffect(() => {
    const subscription = chatService.actualConversation$.subscribe((chat) => {
      setConversation(chat);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <section className="conversation-container">
      {conversation && conversation.ChatMessages.length > 0 ? (
        conversation.ChatMessages.map((message) => {
          console.log("Comparando IDs →", {
            messageUserId: message.UserId,
            currentUserId: currentUser.Id,
            equal: message.UserId === currentUser.Id,
            types: {
              messageUserId: typeof message.UserId,
              currentUserId: typeof currentUser.Id,
            },
          });

          const isMine = message.UserId === currentUser.Id;

          return (
            <div
              key={message.Id}
              className={`message-box ${isMine ? "mine" : "other"}`}
            >
              <p className="message-text">{message.Message}</p>
              <span className="message-time">
                {new Date(message.MessageDateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })
      ) : (
        <p>No hay mensajes</p>
      )}
    </section>
  );
}

export default Conversation;
