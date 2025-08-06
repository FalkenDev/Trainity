export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
