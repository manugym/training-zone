import React, { useEffect, useState } from "react";
import chatService from "../../services/chat.service";
import { User } from "../../models/user";
import "./All_Users_With_Conversation.css";

function All_Users_With_Conversation() {
  const SERVER_IMAGE_URL = `${
    import.meta.env.VITE_SERVER_URL
  }/UserProfilePicture`;

  const [usersWithConversations, setUsersWithConversations] = useState<
    User[] | null
  >(null);

  useEffect(() => {
    const subscription = chatService.usersWithConversations$.subscribe(
      (users) => {
        setUsersWithConversations(users);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <section className="users_container">
      {usersWithConversations && usersWithConversations.length > 0 ? (
        usersWithConversations.map((user) => (
          <div key={user.Id} className="user_item">
            <img
              src={`${SERVER_IMAGE_URL}/${
                user.AvatarImageUrl || "default.png"
              }`}
              alt="Avatar"
              className="avatar"
            />
            <div className="user_info">
              <p className="user_name">{user.Name}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No hay usuarios con conversaciones.</p>
      )}
    </section>
  );
}

export default All_Users_With_Conversation;
