import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from "../order-Cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from "@anqtickets/common";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'Demi',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });

    ticket.set({ orderId });

    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
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

it('updates the ticket publishes an event, and acks the message', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);
    const ticketUpdated = await Ticket.findById(ticket.id);
    expect(ticketUpdated.orderId).toEqual(undefined);

    expect(msg.ack).toHaveBeenCalled();


    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(ticketUpdatedData.orderId).toEqual(undefined);

});
