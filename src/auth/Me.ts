export interface InfoMe {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  status: string;
}

export interface Me {
  user: InfoMe | null;
  roles: string[];
  permissions: string[];
  IsAuthenticated: boolean;
  IsSuperAdmin: boolean;
}
