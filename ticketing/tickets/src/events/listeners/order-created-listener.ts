import { Listener, OrderCreatedEvent, Subjects } from "@anqtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name';
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const { id: orderId, ticket: { id: ticketId }} = data;
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set('orderId', orderId);
        await ticket.save();

        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            version: ticket.version,
            userId: ticket.userId,
            orderId: ticket.orderId
        });

        msg.ack();
    }
}