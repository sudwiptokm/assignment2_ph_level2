import { Model } from 'mongoose';
import { TOrder } from '../order/order.interface';

export type TAddress = {
  street: string;
  city: string;
  country: string;
};

export type TFullName = {
  firstName: string;
  lastName: string;
};

export type TUser = {
  userId: number;
  username: string;
  password: string;
  fullName: TFullName;
  age: number;
  email: string;
  isActive: boolean;
  hobbies: string[];
  address: TAddress;
  orders?: TOrder[];
  isDeleted: boolean;
};

// Custom Static Methods
export interface UserModel extends Model<TUser> {
  // eslint-disable-next-line
  isUserExist(userId: number): Promise<TUser | null>;
}
