import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Chat } from "../../models/chat";
import chatService from "../../services/chat.service";
import userService from "../../services/user.service";
import "./Conversation.css";
import { User } from "../../models/user";
import SendIcon from "../../assets/chat/send_icon.png";
import NotViewedIcon from "../../assets/chat/not-viewed-icon.png";
import ViewedIcon from "../../assets/chat/viewed-icon.png";

function Conversation() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Chat | null>(null);

  const [message, setMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [conversation?.ChatMessages.length]);

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

  //If a message arrives and the user is in the conversation, it is marked as read.
  useEffect(() => {
    async function markMessageAsViewed() {
      if (conversation.ChatMessages.length <= 0) return;

      const latestMessage =
        conversation.ChatMessages[conversation.ChatMessages.length - 1];

      if (latestMessage.UserId != currentUser.Id && !latestMessage.IsViewed)
        await chatService.markMessageAsViewed(latestMessage.Id);
    }

    markMessageAsViewed();
  }, [conversation]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    async function sendMessage() {
      await chatService.sendMessage(message);
    }

    sendMessage();
    setMessage("");
  };

  return (
    <section className="conversation-panel">
      <div className="conversation-container">
        {conversation && conversation.ChatMessages.length > 0 ? (
          <>
            {conversation.ChatMessages.map((message) => {
              const isMine = message.UserId === currentUser?.Id;
              return (
                <div
                  key={message.Id}
                  className={`message-box ${isMine ? "mine" : "other"}`}
                >
                  <p className="message-text">{message.Message}</p>
                  <span className="message-info">
                    {new Date(message.MessageDateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}

                    {message.UserId == currentUser.Id && (
                      <img
                        src={message.IsViewed ? ViewedIcon : NotViewedIcon}
                        alt="Viewed Icon"
                      />
                    )}
                  </span>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        ) : (
          <p>No hay mensajes</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          placeholder="Escribe un mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">
          <img src={SendIcon} alt="Enviar" />
        </button>
      </form>
    </section>
  );
}

export default Conversation;
