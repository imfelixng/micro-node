import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from "@anqtickets/common";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'Demi',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.CREATED,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {
        listener,
        data,
        msg,
        ticket
    }
};

it('Sets the orderid of the ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);
    const ticketSaved = await Ticket.findById(ticket.id);
    expect(ticketSaved.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, data, msg, ticket } = await setup();
    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdatedData.orderId);
});