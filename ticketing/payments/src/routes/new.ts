import express, { Request, Response } from "express";
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, OrderStatus, BadRequestError } from "@anqtickets/common";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token')
        .not()
        .isEmpty(),
        body('orderId')
        .not()
        .isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.CANCELLED) {
            throw new BadRequestError('Can not pay for an cancelled order');
        }

        return res.send({ success: true });

    }
);

export { router as createChargeRouter };
