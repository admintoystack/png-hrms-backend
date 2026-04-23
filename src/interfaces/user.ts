export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  firstName: string;
  lastName: string;
  status: number;
  isKiosk: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles?: Array<{
    role: {
      id: string;
      code: string;
      name: string;
      isSystem: boolean;
      isActive: boolean;
    };
  }>;
}
