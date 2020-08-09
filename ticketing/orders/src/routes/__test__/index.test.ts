import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'Demo',
        price: 20,
    });

    await ticket.save();

    return ticket;
};


it('fetches orders for an particular user', async () => {
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    const user1 = global.signin();
    const user2 = global.signin();

    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
            ticketId: ticket1.id,
        })
        .expect(201);

    const { body: order1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({
            ticketId: ticket2.id,
        })
        .expect(201);

        const { body: order2 } =  await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({
            ticketId: ticket3.id,
        })
        .expect(201);

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order1.id);
    expect(response.body[1].id).toEqual(order2.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);
});