export interface User {
  id: number;
  email: string | null;
  phone: string | null;
  username: string | null;
  zipcode: string;
  anonymous: boolean;
  created_at: string;
}

export type NeighborhoodUser = Pick<User, "zipcode" | "username" | "email">;
