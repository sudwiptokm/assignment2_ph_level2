import { Request, Response } from 'express';
import { UserServices } from './user.service';
import UserValidationSchema from './user.validation';

const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const zodParsedData = UserValidationSchema.parse(user);

    const result = await UserServices.createUserIntoDB(zodParsedData);

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message || 'something went wrong',
      error: {
        code: err.code || 404,
        description: err.message || 'Not Found',
      },
    });
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
    res.status(404).json({
      success: false,
      message: err.message || 'something went wrong',
      error: {
        code: err.code || 404,
        description: err.message || 'Not Found',
      },
    });
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
    res.status(404).json({
      success: false,
      message: err.message || 'something went wrong',
      error: {
        code: err.code || 404,
        description: err.message || 'Not Found',
      },
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = req.body;
    const zodParsedData = UserValidationSchema.parse(user);

    const result = await UserServices.updateUserInDB(
      parseInt(userId),
      zodParsedData,
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message || 'something went wrong',
      error: {
        code: err.code || 404,
        description: err.message || 'Not Found',
      },
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await UserServices.deleteUserFromDB(parseInt(userId));

    res.status(200).json({
      success: true,
      message: 'User is deleted successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message || 'something went wrong',
      error: {
        code: err.code || 404,
        description: err.message || 'Not Found',
      },
    });
  }
};

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUSer,
  updateUser,
  deleteUser,
};
