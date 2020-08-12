import { Listener, TicketUpdatedEvent, Subjects } from "@anqtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
        const { id, title, price } = data;
        const ticket = await Ticket.findById(id);
        
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({
            title,
            price,
        })
        await ticket.save();

        msg.ack();
    }

}