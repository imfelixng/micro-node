import nats from 'node-nats-streaming';
import { Listener, TicketUpdatedEvent, Subjects } from '@anqtickets/common';
class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = 'payment-service';
    onMessage(data: TicketUpdatedEvent['data'], msg: nats.Message): void {
        console.log('Event Data: ', data);
        msg.ack();
    }
}

export {
    TicketUpdatedListener
}