import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('return an error if the ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId();
    const cookie = global.signin();
    await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
            ticketId
        })
        .expect(404);
});

it('return an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'Demo',
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId: 'qqqqqqqq',
        status: OrderStatus.CREATED,
        expiresAt: new Date(),
    });

    await order.save();
        
    const cookie = global.signin();
    
    await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
            ticketId: ticket.id,
        })
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'Demo',
        price: 20
    });
    await ticket.save();

    const cookie = global.signin();
    
    await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);
});

it('emits an order created event', async () => {
    const ticket = Ticket.build({
        title: 'Demo',
        price: 20
    });
    await ticket.save();

    const cookie = global.signin();
    
    await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
            ticketId: ticket.id,
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});