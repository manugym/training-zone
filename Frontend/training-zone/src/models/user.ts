export type Role = "admin" | "user" | "trainer";

export interface User {
  Id: number;
  Name: string;
  Phone: string;
  Email: string;
  Password: string;
  Role: Role;
  AvatarImageUrl?: string;
}

export type SafeUser = Pick<User, "Id" | "Name" | "Role" | "AvatarImageUrl">;
