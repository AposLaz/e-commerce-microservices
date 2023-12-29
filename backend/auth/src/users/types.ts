/*
 *   Interface that describe the properties that are required to create a new User
 */
export interface UserInterfaceSignIn {
  username: string;
  password: string;
}

export interface UserInterfaceSignUp {
  username: string;
  email: string;
  password: string;
}

export interface UserInterfaceAllInfo {
  id: number;
  username: string;
  email: string;
  password: string;
  createdDate: Date;
  lastUpdatedDate: Date;
}

export interface returnUser {
  id: number;
  username: string;
  email: string;
  jwt: string;
}
