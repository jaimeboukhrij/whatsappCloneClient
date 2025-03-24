export interface IUser {
  id: string;
  email: string;
  password: string;
  userName: string;
  lastName: string;
  firstName: string;
  urlImg?: string | null;
  contacts?: IUser[] | null;
}
