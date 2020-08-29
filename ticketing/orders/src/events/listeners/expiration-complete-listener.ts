import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from "@anqtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name';
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
        const { orderId } = data;
        const order = await Order.findById(orderId).populate('ticket');

        if (!order) {
            throw new Error('Order not found');
        }

        // Prevent cancel order completed
        if (order.status === OrderStatus.COMPLETED) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.CANCELLED,
        });
        await order.save();

        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            }
        });
        
        msg.ack();
    }
    
}