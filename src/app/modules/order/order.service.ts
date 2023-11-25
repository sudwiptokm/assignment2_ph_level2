import { Document } from 'mongoose';
import { User } from '../user/user.model';
import { TOrder } from './order.interface';

interface OrderDocument extends Document, TOrder {
  orders: TOrder[];
}

const addProductToOrder = async (userId: number, data: TOrder) => {
  if (await User.isUserExist(userId)) {
    const user = (await User.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $push: {
          orders: {
            productName: data.productName,
            price: data.price,
            quantity: data.quantity,
          },
        },
      },
      { new: true, upsert: true },
    )) as OrderDocument;
    if (!user) {
      throw new Error('Failed to create or update the order.');
    }

    return user.orders.slice(-1)[0];
  } else {
    throw new Error("User doesn't exist");
  }
};

const getAllOrdersForAUser = async (userId: number) => {
  if (await User.isUserExist(userId)) {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      throw new Error('Failed to fetch orders.');
    }
    return user.orders;
  } else {
    throw new Error("User doesn't exist");
  }
};

const calculateTotalPriceForAllOrdersForAUser = async (userId: number) => {
  if (await User.isUserExist(userId)) {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      throw new Error('Failed to fetch orders.');
    }
    const orders = user.orders || [];

    const totalPrice = orders.reduce((total, order) => {
      return total + order.price * order.quantity;
    }, 0);

    return totalPrice;
  } else {
    throw new Error("User doesn't exist");
  }
};

export const OrderServices = {
  addProductToOrder,
  getAllOrdersForAUser,
  calculateTotalPriceForAllOrdersForAUser,
};
