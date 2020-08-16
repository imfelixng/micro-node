import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus, Order } from '../../models/order';

import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Demo',
        price: 20,
    });

    await ticket.save();

    return ticket;
};

it('marks an order as cancelled', async () => {
    const ticket = await buildTicket();

    const user = global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);
    
    const updateOrder = await Order.findById(order.id);
    
    expect(updateOrder?.status).toEqual(OrderStatus.CANCELLED);
});

it('return an error if delete order is not exist', async () => {
    const user = global.signin();

    await request(app)
        .delete(`/api/orders/${mongoose.Types.ObjectId}`)
        .set('Cookie', user)
        .expect(404);
});

it('return an error if user delete order is created by another user', async () => {
    const ticket = await buildTicket();

    const user1 = global.signin();
    const user2 = global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user2)
        .expect(401);
});

it('emits an order cancelled event', async () => {
    const ticket = await buildTicket();

    const user = global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});