import { Ticket } from "../ticket";

it('implement optimistic concurrency control', async (done) => {
    const ticket = Ticket.build({
        title: 'Demo',
        price: 5,
        userId: '111'
    });
    await ticket.save();

    const firstTicketFetched = await Ticket.findById(ticket.id);
    const secondTicketFetched = await Ticket.findById(ticket.id);

    firstTicketFetched.set({'price': 10});
    secondTicketFetched.set({'price': 15});

    await firstTicketFetched.save();

    try {
        await secondTicketFetched.save();
    } catch (err) {
        return done();
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'Demo',
        price: 5,
        userId: '111'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

});