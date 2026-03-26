export interface Info {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  status?: string;
  avatarUrl?: string;
}

export interface Me {
  info: Info;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}
