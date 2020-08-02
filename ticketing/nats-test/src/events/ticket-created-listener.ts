import nats from 'node-nats-streaming';
import { Listener, TicketCreatedEvent, Subjects } from '@anqtickets/common';
class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payment-service';
    onMessage(data: TicketCreatedEvent['data'], msg: nats.Message): void {
        console.log('Event Data: ', data);
        msg.ack();
    }
}

export {
    TicketCreatedListener
}