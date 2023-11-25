import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (userData: TUser) => {
  if (await User.isUserExist(userData.userId)) {
    throw new Error('User already exists');
  }

  const result = await User.create(userData);
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await User.find(
    {},
    'username fullName age email address',
  ).lean();
  return result.map((user) => {
    delete (user as any)._id;
    delete (user as any).id;
    return user;
  });
};

const getSingleUserFromDB = async (userId: number) => {
  if (await User.isUserExist(userId)) {
    const result = await User.aggregate([{ $match: { userId } }]);

    const sanitizedResult = result.map((user) => {
      const sanitizedUser = { ...user };
      delete sanitizedUser.password;
      delete sanitizedUser.isDeleted;
      if (sanitizedUser.orders && sanitizedUser.orders.length === 0) {
        delete sanitizedUser.orders;
      }
      return sanitizedUser;
    });

    return sanitizedResult;
  } else {
    throw new Error("User doesn't exists");
  }
};

const updateUserInDB = async (userId: number, userData: TUser) => {
  if (await User.isUserExist(userId)) {
    const result = await User.findOneAndUpdate(
      { userId },
      { $set: userData },
      { new: true },
    );
    return result;
  } else {
    throw new Error("User doesn't exist");
  }
};

const deleteUserFromDB = async (userId: number) => {
  const result = await User.updateOne({ userId }, { isDeleted: true });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
