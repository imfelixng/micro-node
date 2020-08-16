import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

import mongoose from 'mongoose';

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'Demo',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    return ticket;
};

it('fetches the order', async () => {
    const ticket = await buildTicket();

    const user = global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(200);
    expect(response.body.id).toEqual(order.id);
});

it('return an error if fetch order is not exist', async () => {
    const user = global.signin();

    await request(app)
        .get(`/api/orders/${mongoose.Types.ObjectId}`)
        .set('Cookie', user)
        .expect(404);
});

it('return an error if user fetch order is created by another user', async () => {
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

    const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user2)
        .expect(401);
});

