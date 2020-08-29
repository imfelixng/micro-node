import { Listener, OrderCreatedEvent, Subjects } from "@anqtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const { id: orderId, expiresAt } = data;

        const delay = new Date(expiresAt).getTime() - new Date().getTime();
        console.log('Waiting in ', delay);
        await expirationQueue.add({ orderId }, { delay });

        msg.ack();
    }
}