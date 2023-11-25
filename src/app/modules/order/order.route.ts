import express from 'express';
import { OrderController } from './order.controller';

const router = express.Router();

router.post('/:userId/orders', OrderController.addProductToOrder);
router.get('/:userId/orders', OrderController.getAllOrders);
router.get('/:userId/orders/total-price', OrderController.calculateTotalPrice);

export const OrderRoutes = router;
