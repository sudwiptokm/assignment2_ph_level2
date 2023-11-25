import { Schema, model } from 'mongoose';
import { TOrder } from './order.interface';

export const OrderSchema = new Schema<TOrder>({
  productName: {
    type: String,
    required: true,
    trim: true,
    message: 'Product name is required',
  },
  price: { type: Number, required: true, message: 'Price is required' },
  quantity: { type: Number, required: true, message: 'Quantity is required' },
});

export const Order = model('Order', OrderSchema);
