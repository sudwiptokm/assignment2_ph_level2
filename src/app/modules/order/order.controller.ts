import { Request, Response } from 'express';
import { handleError } from '../../utils/ErrorHandler';
import { OrderServices } from './order.service';
import OrderValidationSchema from './order.validation';

const addProductToOrder = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = req.params.userId;
    const zodParsedData = OrderValidationSchema.parse(data);

    // Validate request body here if needed
    // eslint-disable-next-line
    const result = await OrderServices.addProductToOrder(
      parseInt(userId),
      zodParsedData,
    );

    res.status(200).json({
      success: true,
      message: 'Order created successfully!',
      data: null,
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const result = await OrderServices.getAllOrdersForAUser(parseInt(userId));

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully!',
      orders: result,
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

const calculateTotalPrice = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const result = await OrderServices.calculateTotalPriceForAllOrdersForAUser(
      parseInt(userId),
    );

    res.status(200).json({
      success: true,
      message: 'Total price calculated successfully!',
      data: {
        totalPrice: result,
      },
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const OrderController = {
  addProductToOrder,
  getAllOrders,
  calculateTotalPrice,
};
