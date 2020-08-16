import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@anqtickets/common";
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    // create listener instance
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'Demo',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    // create fake msg obj
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(() => {})
    }

    return { listener, data, msg }
};

it('creates and save a ticket', async () => {
    const { listener, data, msg } = await setup();

    // call onMessage func
    await listener.onMessage(data, msg);

    // check ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket.title).toEqual(data.title);
    expect(ticket.price).toEqual(data.price);
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();

    // call onMessage func
    await listener.onMessage(data, msg);
    // check ask funnc is called
    expect(msg.ack).toHaveBeenCalled();
});