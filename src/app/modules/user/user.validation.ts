import { z } from 'zod';
import OrderValidationSchema from '../order/order.validation';

const AddressValidationSchema = z.object({
  street: z
    .string()
    .min(1, { message: 'Street must have at least 1 character' })
    .max(255, { message: 'Street cannot exceed 255 characters' })
    .trim(),
  city: z
    .string()
    .min(1, { message: 'City must have at least 1 character' })
    .max(255, { message: 'City cannot exceed 255 characters' })
    .trim(),
  country: z
    .string()
    .min(1, { message: 'Country must have at least 1 character' })
    .max(255, { message: 'Country cannot exceed 255 characters' })
    .trim(),
});

const FullNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name must have at least 1 character' })
    .max(255, { message: 'First name cannot exceed 255 characters' })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: 'Last name must have at least 1 character' })
    .max(255, { message: 'Last name cannot exceed 255 characters' })
    .trim(),
});

const UserValidationSchema = z
  .object({
    userId: z.number({ invalid_type_error: 'User ID must be a valid number' }),
    username: z
      .string()
      .min(1, { message: 'Username must have at least 1 character' })
      .max(255, { message: 'Username cannot exceed 255 characters' })
      .trim(),
    password: z
      .string()
      .min(1, { message: 'Password must have at least 1 character' })
      .max(255, { message: 'Password cannot exceed 255 characters' }),
    fullName: FullNameValidationSchema,
    age: z.number({ invalid_type_error: 'Age must be a valid number' }),
    email: z.string().email({ message: 'Invalid email format' }),
    isActive: z.boolean({
      invalid_type_error: 'isActive must be a boolean value',
    }),
    hobbies: z.array(
      z
        .string()
        .min(1, { message: 'Hobby must have at least 1 character' })
        .max(255, { message: 'Hobby cannot exceed 255 characters' })
        .trim(),
    ),
    address: AddressValidationSchema,
    orders: z.array(OrderValidationSchema).optional(),
    isDeleted: z
      .boolean({ invalid_type_error: 'isDeleted must be a boolean value' })
      .default(false),
  })
  .partial();

export default UserValidationSchema;
