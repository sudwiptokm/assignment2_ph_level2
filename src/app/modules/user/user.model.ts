import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import {
  TAddress,
  TFullName,
  TOrder,
  TUser,
  UserModel,
} from './user.interface';

const AddressSchema = new Schema<TAddress>(
  {
    street: {
      type: String,
      required: true,
      trim: true,
      message: 'Street is required',
    },
    city: {
      type: String,
      required: true,
      trim: true,
      message: 'City is required',
    },
    country: {
      type: String,
      required: true,
      trim: true,
      message: 'Country is required',
    },
  },
  { _id: false },
);

const OrderSchema = new Schema<TOrder>({
  productName: {
    type: String,
    required: true,
    trim: true,
    message: 'Product name is required',
  },
  price: { type: Number, required: true, message: 'Price is required' },
  quantity: { type: Number, required: true, message: 'Quantity is required' },
});

const FullNameSchema = new Schema<TFullName>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      message: 'First name is required',
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      message: 'Last name is required',
    },
  },
  { _id: false },
);

const UserSchema = new Schema<TUser, UserModel>(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
      message: 'User ID is required',
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      message: 'Username is required',
    },
    password: { type: String, required: true, message: 'Password is required' },
    fullName: FullNameSchema,
    age: { type: Number, required: true, message: 'Age is required' },
    email: {
      type: String,
      required: true,
      trim: true,
      message: 'Email is required',
    },
    isActive: {
      type: Boolean,
      required: true,
      message: 'isActive is required',
    },
    hobbies: {
      type: [String],
      required: true,
      message: 'Hobbies are required',
    },
    address: AddressSchema,
    orders: { type: [OrderSchema] },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// hashing password and save into DB
UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// post save middleware / hook
UserSchema.post('save', function (doc, next) {
  doc.set('password', undefined);
  next();
});

// Pre Update Middleware
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (update && 'password' in update && update.password) {
    // Hash the password before updating
    update.password = await bcrypt.hash(
      update.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  next();
});

// Post Update Middleware
UserSchema.post('findOneAndUpdate', async function (result, next) {
  // If 'result' is an object and 'password' exists, remove it
  if (result && typeof result === 'object' && 'password' in result) {
    result.password = undefined;
  }
  result.isDeleted = undefined;
  result._id = undefined;
  if (result.orders && result.orders.length === 0) {
    result.orders = undefined;
  }
  next();
});

// Query Middleware
UserSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

UserSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

UserSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

UserSchema.statics.isUserExist = async function (userId: number) {
  const existingUser = await User.findOne({ userId });
  return existingUser;
};

export const User = model<TUser, UserModel>('User', UserSchema);
