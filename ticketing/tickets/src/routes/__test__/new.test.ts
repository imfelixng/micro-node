import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user if signed in', async () => {
    await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('returns a status other than 401 if the user is signed', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set({ 'Cookie': cookie })
    .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an errror if an invalid title is provided', async () => {
    const cookie = global.signin();
    await request(app)
    .post('/api/tickets')
    .set({ 'Cookie': cookie })
    .send({
        title: '',
        price: 10
    }).
    expect(400);
});

it('returns an errror if an invalid price is provided', async () => {
    const cookie = global.signin();
    await request(app)
        .post('/api/tickets')
        .set({ 'Cookie': cookie })
        .send({
            title: 'demo',
            price: -10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set({ 'Cookie': cookie })
        .send({
            title: 'demo',
        })
        .expect(400);
});

it('creates a ticket with valid inputs', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = 'Demo';
    const price = 20;

    const cookie = global.signin();
    await request(app)
        .post('/api/tickets')
        .set({ 'Cookie': cookie })
        .send({
            title,
            price,
        })
        .expect(201);

        tickets = await Ticket.find({});
        expect(tickets.length).toEqual(1);
        expect(tickets[0].title).toEqual(title);
        expect(tickets[0].price).toEqual(price);
});

it('publishes an event', async () => {
    const title = 'Demo';
    const price = 20;

    const cookie = global.signin();
    await request(app)
    .post('/api/tickets')
    .set({ 'Cookie': cookie })
    .send({
        title,
        price,
    })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});