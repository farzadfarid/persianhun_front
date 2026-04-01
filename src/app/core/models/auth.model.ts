export interface AuthResponse {
  token: string;
  expiration: string;
  userId: number;
  email: string;
  role: string;
}

export interface AuthUser {
  userId: number;
  email: string;
  role: string;
}
