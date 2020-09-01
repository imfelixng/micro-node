import { Listener, OrderCreatedEvent, Subjects } from "@anqtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {      
        const order = Order.build({
            id: data.id,
            version: data.version,
            price: data.ticket.price,
            userId: data.userId,
            status: data.status
        });

        await order.save();

        msg.ack();
    }
}