import express, { Request, Response } from "express";
import { Ticket } from '../models/ticket';
import { body, param } from 'express-validator';
import { validateRequest, NotFoundError, requireAuth, NotAuthorizedError } from "@anqtickets/common";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.userId !== req.currentUser.id) {
            throw new NotAuthorizedError();
        }

        console.log('AAAAAA');

        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });

        await ticket.save();

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        });
        
        return res.send(ticket);
    }
);

export { router as updateTicketRouter };