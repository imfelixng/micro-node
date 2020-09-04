import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@anqtickets/common';

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: '111',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to user', async () => {
    const order = Order.build({
        id:  mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.CREATED,
        userId: mongoose.Types.ObjectId().toHexString(),
        price: 20
    });

    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
        token: '111',
        orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id:  mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.CANCELLED,
        userId: userId,
        price: 20
    });

    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({         
        token: '111',
        orderId: order.id
    })
    .expect(400);
});