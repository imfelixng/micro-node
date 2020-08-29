import mongoose from 'mongoose';

import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteEvent, OrderStatus } from "@anqtickets/common";
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setup = async () => {
    // create listener instance
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Demo',
        price: 20,
    });

    await ticket.save();

    const order = Order.build({
        status: OrderStatus.CREATED,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(),
        ticket: ticket.id,
    });

    await order.save();

    // create fake data event
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    }

    // create fake msg obj
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(() => {})
    }

    return { listener, data, msg, order, ticket }
};

it('updates order status to cancelled', async () => {
    const { listener, data, msg, order } = await setup();

    // call onMessage func
    await listener.onMessage(data, msg);

    // check ticket was created
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder.status).toEqual(OrderStatus.CANCELLED);
});

it('emit an order cancel event', async () => {
    const { listener, data, msg, order } = await setup();

    // call onMessage func
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish as jest.Mock).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // call onMessage func
    await listener.onMessage(data, msg);
    // check ask funnc is called
    expect(msg.ack).toHaveBeenCalled();
});