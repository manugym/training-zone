import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Chat } from "../../models/chat";
import chatService from "../../services/chat.service";
import userService from "../../services/user.service";
import "./Conversation.css";
import { User } from "../../models/user";

import { ChatMessage } from "../../models/chat-message";
import Swal from "sweetalert2";
import { IoCheckmarkDoneSharp, IoSend } from "react-icons/io5";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";

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
    if (conversation?.ChatMessages?.length) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [conversation?.ChatMessages?.length]);

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

  //Mark actual conversation as Viewed
  useEffect(() => {
    async function markConversationAsViewed() {
      await chatService.getConversationRequest(
        conversation?.UserOriginId === currentUser?.Id
          ? conversation?.UserDestinationId
          : conversation?.UserOriginId || null
      );
    }

    markConversationAsViewed();
  }, []);

  //If a message arrives and the user is in the conversation, it is marked as Viewed.
  useEffect(() => {
    async function markMessageAsViewed() {
      if (
        !conversation ||
        !conversation.ChatMessages ||
        conversation.ChatMessages.length === 0 ||
        !currentUser
      ) {
        return;
      }

      const latestMessage =
        conversation.ChatMessages[conversation.ChatMessages.length - 1];

      if (latestMessage.UserId !== currentUser.Id && !latestMessage.IsViewed) {
        await chatService.markMessageAsViewed(latestMessage.Id);
      }
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
    Swal.fire({
      title: "¿Estás seguro de que quieres eliminar el mensaje?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      background: "var(--color-background-secondary)",
      color: "var(--color-text)",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        async function sendDeleteMessageRequest() {
          await chatService.sendDeleteMessageRequest(messageId);
        }

        sendDeleteMessageRequest();
      }
    });
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

  // get the date in string
  const getDateLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <section className="conversation-panel">
      <div className="conversation-container">
        {conversation && conversation?.ChatMessages?.length > 0 ? (
          <>
            {conversation.ChatMessages.map((message, index) => {
              const isMine = message.UserId === currentUser.Id;

              const messageDate = new Date(message.MessageDateTime);

              // check that the date changes
              const showDateHeader =
                index === 0 ||
                new Date(
                  conversation.ChatMessages[index - 1].MessageDateTime
                ).toDateString() !== messageDate.toDateString();

              return (
                <div key={index} className="conversation-wrapper">
                  {showDateHeader && (
                    <p className="date">{getDateLabel(messageDate)}</p>
                  )}

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
                        <MdEditSquare
                          title="Editar mensaje"
                          color="white"
                          size={22}
                          onClick={() => {
                            setShowEditMessage(true);
                            setMessageToEditContent(message.Message);
                          }}
                        />

                        <MdDeleteForever
                          color="red"
                          size={24}
                          title="Eliminar mensaje"
                          onClick={() => handleDeleteMessage(message.Id)}
                        />

                        {/*If the user is going to modify the message, a text area appears */}
                        {showEditMessage ? (
                          <form
                            onSubmit={handleEditMessageSubmit}
                            className="message-form"
                          >
                            <textarea
                              className="edit-textarea"
                              placeholder="Escribe un mensaje"
                              value={messageToEditContent}
                              onChange={(e) => {
                                setMessageToEditContent(e.target.value);
                              }}
                              onKeyDown={handleKeyDown}
                              required
                            />

                            <button type="submit">
                              <IoSend size={20} color="white" />
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
                      {new Date(message.MessageDateTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}

                      {message.UserId == currentUser.Id && (
                        <IoCheckmarkDoneSharp />
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        ) : conversation ? (
          <div className="no-messages">
            <h2>
              No tienes mensajes con <b>{conversation.UserDestination.Name}</b>{" "}
              aún
            </h2>
            <p>Envía el primero para comenzar la conversación</p>
          </div>
        ) : (
          <div className="no-messages">
            <h2>Ningún chat seleccionado </h2>
            <p>Selecciona un chat para empezar a hablar</p>
          </div>
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
          <IoSend size={24} color="white" />
        </button>
      </form>
    </section>
  );
}

export default Conversation;
