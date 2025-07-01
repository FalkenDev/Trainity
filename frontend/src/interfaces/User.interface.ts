export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
