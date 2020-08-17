import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('return a 404 if the provided id does not exist', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set({ 'Cookie': global.signin() })
        .send({
            title: 'demo',
            price: 20,
        })
        .expect(404);
});

it('return a 401 if the user is not authenticated', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'demo',
            price: 20,
        })
        .expect(401);
});

it('return a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post(`/api/tickets`)
        .set({ 'Cookie': global.signin() })
        .send({
            title: 'demo',
            price: 20,
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set({ 'Cookie': global.signin() })
        .send({
            title: 'new demo',
            price: 1000,
        })
        .expect(401);
});

it('return a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post(`/api/tickets`)
    .set({ 'Cookie': cookie })
    .send({
        title: 'demo',
        price: 20,
    })
    .expect(201);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set({ 'Cookie': cookie })
    .send({
        title: '',
        price: 20,
    })
    .expect(400);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set({ 'Cookie': cookie })
    .send({
        title: 'Demo',
        price: -20,
    })
    .expect(400);
});

it('updates the ticket provided valid input', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post(`/api/tickets`)
    .set({ 'Cookie': cookie })
    .send({
        title: 'Demo title',
        price: 20,
    })
    .expect(201);

    const ticketResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set({ 'Cookie': cookie })
    .send({
        title: 'New title',
        price: 20,
    })
    .expect(200);

    expect(ticketResponse.body.title).toEqual('New title');
    expect(ticketResponse.body.price).toEqual(20);
});

it('publishes an event', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post(`/api/tickets`)
    .set({ 'Cookie': cookie })
    .send({
        title: 'Demo title',
        price: 20,
    })
    .expect(201);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set({ 'Cookie': cookie })
    .send({
        title: 'New title',
        price: 20,
    })
    .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updateds if the ticket is reserved', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post(`/api/tickets`)
    .set({ 'Cookie': cookie })
    .send({
        title: 'Demo title',
        price: 20,
    })
    .expect(201);

    const ticket = await Ticket.findById(response.body.id);

    ticket.set({ orderId: mongoose.Types.ObjectId().toHexString() })

    await ticket.save();

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set({ 'Cookie': cookie })
    .send({
        title: 'New title',
        price: 20,
    })
    .expect(400);
});