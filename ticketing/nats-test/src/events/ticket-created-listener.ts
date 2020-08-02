import nats from 'node-nats-streaming';
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from './ticket-created-events';
import { Subjects } from './subjects';

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