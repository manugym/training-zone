import { useEffect, useState } from "react";
import chatService from "../../services/chat.service";
import { User } from "../../models/user";
import "./All_Conversations.css";
import { Chat } from "../../models/chat";
import userService from "../../services/user.service";
import { useTranslation } from "react-i18next";

function All_Users_With_Conversation() {
  const SERVER_IMAGE_URL = `${import.meta.env.VITE_SERVER_URL
    }/UserProfilePicture`;

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [allChats, setAllChats] = useState<Chat[] | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const { t } = useTranslation("chat");

  //subscription to get the current user
  useEffect(() => {
    const subscription = userService.currentUser$.subscribe((user) => {
      setCurrentUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //subscription to get all users chats
  useEffect(() => {
    const subscription = chatService.allChats$.subscribe((chats) => {
      setAllChats(chats);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //subscription to get the current conversation
  useEffect(() => {
    const subscription = chatService.actualConversation$.subscribe((chat) => {
      setSelectedChat(chat);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!selectedChat) return;

    async function sendGetChatRequest() {
      await chatService.sendGetAllChatsRequest();
    }

    sendGetChatRequest();
  }, []);

  //change the current conversation
  useEffect(() => {
    if (!selectedChat) return;

    chatService.setActualConversation(selectedChat);
  }, [selectedChat]);

  return (
    <section className="users_container">
      {allChats && allChats.length > 0 ? (
        allChats.map((chat) => {
          const notViewedMessagesCounter =
            chat.ChatMessages?.filter(
              (message) =>
                !message.IsViewed && message.UserId !== currentUser.Id
            ).length || 0;

          return (
            <div
              key={chat.Id}
              className={`user_item ${selectedChat === chat ? "selected" : ""}`}
              onClick={() => setSelectedChat(chat)}
            >
              <img
                src={`${SERVER_IMAGE_URL}/${chat.UserOriginId === currentUser.Id
                    ? chat.UserDestination?.AvatarImageUrl || "default.png"
                    : chat.UserOrigin?.AvatarImageUrl || "default.png"
                  }`}
                alt="Avatar"
                className="avatar"
              />

              <div className="user_info">
                <div className="user_name_wrapper">
                  <p className="user_name">
                    {chat.UserOriginId === currentUser.Id
                      ? chat.UserDestination?.Name
                      : chat.UserOrigin?.Name}
                  </p>

                  {notViewedMessagesCounter > 0 && (
                    <span className="counter">{notViewedMessagesCounter}</span>
                  )}
                </div>

                <p className="last-message">
                  {chat.ChatMessages && chat.ChatMessages.length > 0
                    ? chat.ChatMessages[chat.ChatMessages.length - 1].Message
                      .length > 20
                      ? chat.ChatMessages[
                        chat.ChatMessages.length - 1
                      ].Message.slice(0, 20) + "..."
                      : chat.ChatMessages[chat.ChatMessages.length - 1].Message
                    : t("no_messages")}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p>{t("no_conversations")}</p>
      )}
    </section>
  );
}

export default All_Users_With_Conversation;
