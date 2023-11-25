import { Request, Response } from 'express';
import { handleError } from '../../utils/ErrorHandler';
import { TUser } from './user.interface';
import { UserServices } from './user.service';
import UserValidationSchema from './user.validation';

const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const zodParsedData = UserValidationSchema.parse(user);

    const result = await UserServices.createUserIntoDB(zodParsedData as TUser);

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: result,
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

const getSingleUSer = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await UserServices.getSingleUserFromDB(parseInt(userId));

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: result,
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = req.body;
    const zodParsedData = UserValidationSchema.parse(user);

    const result = await UserServices.updateUserInDB(
      parseInt(userId),
      zodParsedData as TUser,
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      data: result,
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // eslint-disable-next-line
    const result = await UserServices.deleteUserFromDB(parseInt(userId));

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null,
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUSer,
  updateUser,
  deleteUser,
};
