import { useEffect, useState } from "react";
import { User } from "../models/user";
import userService from "../services/user.service";

export const useCurrentUser = (): User | null => {
  const [user, setUser] = useState<User | null>(userService.getCurrentUser());

  useEffect(() => {
    const sub = userService.currentUser$.subscribe(setUser);
    return () => sub.unsubscribe();
  }, []);

  return user;
};
