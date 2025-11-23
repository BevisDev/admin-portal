export interface User {
  id: number;
  email: string;
  name: string;
}

export interface MeResponse {
  user: User | null;
  roles: string[];
  permissions: string[];
}
