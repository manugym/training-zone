import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Chat } from "../../models/chat";
import chatService from "../../services/chat.service";
import userService from "../../services/user.service";
import "./Conversation.css";
import { User } from "../../models/user";
import SendIcon from "../../assets/chat/send_icon.png";
import NotViewedIcon from "../../assets/chat/not-viewed-icon.png";
import ViewedIcon from "../../assets/chat/viewed-icon.png";
import { ChatMessage } from "../../models/chat_message";

function Conversation() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Chat | null>(null);

  const [messageToSend, setMessageToSend] = useState("");

  const [messageToEdit, setMessageToEdit] = useState<ChatMessage | null>(null);
  const [messageToEditContent, setMessageToEditContent] = useState("");
  const [showEditMessage, setShowEditMessage] = useState(false);

  const timerRef = useRef(null);

  //scroll to the bottom of the message
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

  const handleSendMessageSubmit = (e: FormEvent) => {
    e.preventDefault();

    async function sendMessage() {
      await chatService.sendMessage(messageToSend);
    }

    sendMessage();
    setMessageToSend("");
  };

  const handleEditMessageSubmit = (e: FormEvent) => {
    e.preventDefault();

    async function sendEditMessageRequest() {
      await chatService.sendEditMessageRequest(
        messageToEdit.Id,
        messageToEditContent
      );
    }

    sendEditMessageRequest();
    setMessageToEdit(null);
  };

  const handleDeleteMessage = (messageId: number) => {
    async function sendDeleteMessageRequest() {
      await chatService.sendDeleteMessageRequest(messageId);
    }

    sendDeleteMessageRequest();
  };

  //If click outside the message to edit, the edit modal closes.
  const editAreaRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editAreaRef.current &&
        !editAreaRef.current.contains(event.target as Node)
      ) {
        setMessageToEdit(null);
        setMessageToEditContent("");
        setShowEditMessage(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // If press escape, it resets the values
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMessageToSend("");

        setMessageToEdit(null);
        setMessageToEditContent("");
        setShowEditMessage(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // If press enter, send or edit message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (messageToSend) handleSendMessageSubmit(e);

      if (messageToEdit) handleEditMessageSubmit(e);
    }
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
                  onMouseDown={() => {
                    timerRef.current = setTimeout(() => {
                      if (message.UserId === currentUser.Id)
                        setMessageToEdit(message);
                    }, 1000);
                  }}
                  onMouseUp={() => {
                    clearTimeout(timerRef.current);
                  }}
                >
                  {messageToEdit && messageToEdit === message ? (
                    <div ref={editAreaRef}>
                      <button
                        onClick={() => {
                          setShowEditMessage(true);
                          setMessageToEditContent(message.Message);
                        }}
                      >
                        Editar
                      </button>
                      <button onClick={() => handleDeleteMessage(message.Id)}>
                        Eliminar
                      </button>

                      {/*If the user is going to modify the message, a text area appears */}
                      {showEditMessage ? (
                        <form
                          onSubmit={handleEditMessageSubmit}
                          className="message-form"
                        >
                          <textarea
                            placeholder="Escribe un mensaje"
                            value={messageToEditContent}
                            onChange={(e) => {
                              setMessageToEditContent(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                            required
                          />

                          <button type="submit">
                            <img src={SendIcon} alt="Enviar" />
                          </button>
                        </form>
                      ) : (
                        <p className="message-text">{message.Message}</p>
                      )}
                    </div>
                  ) : (
                    <p className="message-text">{message.Message}</p>
                  )}

                  {/*time and check mark icon */}
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

      {/*Form for send messages */}
      <form onSubmit={handleSendMessageSubmit} className="message-form">
        <textarea
          placeholder="Escribe un mensaje"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
          onKeyDown={handleKeyDown}
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
