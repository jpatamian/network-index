import { IconType } from "react-icons";

export interface User {
  id: number;
  email: string | null;
  phone: string | null;
  username: string | null;
  zipcode?: string | null;
  anonymous: boolean;
  is_moderator: boolean;
  created_at: string;
}

export type NeighborhoodUser = Pick<User, "zipcode" | "username" | "email">;

export interface ProfileFieldProps {
  icon: IconType;
  label: string;
  display: string;
  field?: keyof typeof emptyForm;
  inputType?: string;
  isEditing: boolean;
  value: string;
  onChange: (field: string, value: string) => void;
  readOnly?: boolean;
}

const emptyForm = { username: "", email: "", zipcode: "" };
