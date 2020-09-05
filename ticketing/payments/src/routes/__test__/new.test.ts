import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@anqtickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

// jest.mock('../../stripe');

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

it('returns a 201 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id:  mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.CREATED,
        userId: userId,
        price
    });

    await order.save();

    const response = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({         
        token: 'tok_visa',
        orderId: order.id
    })
    .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50 });

    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100;
    });

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge.currency).toEqual('usd');
    // MOCK
    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    // expect(chargeOptions.source).toEqual('tok_visa');
    // expect(chargeOptions.amount).toEqual(20 * 100);
    // expect(chargeOptions.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge.id,
    });

    expect(payment).not.toBeNull();

});
