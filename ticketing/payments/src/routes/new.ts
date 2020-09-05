import express, { Request, Response } from "express";
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, OrderStatus, BadRequestError } from "@anqtickets/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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

        const charge = await stripe.charges.create({
            amount: order.price * 100,
            source: token,
            currency: 'usd'
        });

        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        })

        await payment.save();

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });

        return res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter };
