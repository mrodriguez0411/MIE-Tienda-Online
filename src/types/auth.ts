export interface UserMetadata {
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
}

export interface NewUser {
  email: string;
  password: string;
  user_metadata: UserMetadata;
}

export interface UpdateUser {
  id: string;
  user_metadata: UserMetadata;
}
