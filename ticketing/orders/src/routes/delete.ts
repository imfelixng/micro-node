import express, { Request, Response } from "express";
import { requireAuth, NotFoundError, NotAuthorizedError } from "@anqtickets/common";
import { Order, OrderStatus} from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser.id) {
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.CANCELLED;
        await order.save(); 

        new OrderCancelledPublisher(natsWrapper.client)
        .publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            },
        });

        return res.status(204).send(order);
    }
);

export { router as deleteOrderRouter };