import mongoose from 'mongoose';

import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@anqtickets/common";
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    // create listener instance
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create a ticket
    const ticket = Ticket.build({
        price: 20,
        title: 'Demo',
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    // create fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'Demo 123',
        price: 30,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    // create fake msg obj
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(() => { })
    }

    return { listener, data, msg, ticket }
};

it('finds, updates and saves a ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    // call onMessage func
    await listener.onMessage(data, msg);

    // check ticket was created
    const ticketSaved = await Ticket.findById(ticket.id);

    expect(ticketSaved).toBeDefined();
    expect(ticketSaved.title).toEqual(data.title);
    expect(ticketSaved.price).toEqual(data.price);
    expect(ticketSaved.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // call onMessage func
    await listener.onMessage(data, msg);
    // check ask funnc is called
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ask if the event has a skipped version number', async () => {
    const { listener, data, msg } = await setup();
    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    } catch (err) {
    }
    expect(msg.ack).not.toHaveBeenCalled();
});
