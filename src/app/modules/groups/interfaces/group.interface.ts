import { IUser } from '../../../shared/interfaces/user.interface';

export interface GroupI {
  id: string;

  name: string;

  urlImg: string;

  description?: string;

  admins: IUser[];

  members: IUser[];
}
