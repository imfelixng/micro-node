import { Listener, OrderCancelledEvent, Subjects } from "@anqtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name';
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        const { ticket: { id: ticketId }} = data;
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set('orderId', undefined);
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