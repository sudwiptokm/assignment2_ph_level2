import { z } from 'zod';

const OrderValidationSchema = z.object({
  productName: z
    .string({ invalid_type_error: 'Product name must be a string' })
    .min(1, { message: 'Product name must have at least 1 character' })
    .max(255, { message: 'Product name cannot exceed 255 characters' })
    .trim(),
  price: z.number({ invalid_type_error: 'Price must be a valid number' }),
  quantity: z.number({ invalid_type_error: 'Quantity must be a valid number' }),
});

export default OrderValidationSchema;
