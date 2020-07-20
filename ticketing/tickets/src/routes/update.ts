import express, { Request, Response } from "express";
import { Ticket } from '../models/ticket';
import { body, param } from 'express-validator';
import { validateRequest, NotFoundError, requireAuth } from "@anqtickets/common";

const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        param('id')
        .isMongoId()
        .withMessage('Id is invalid')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            throw new NotFoundError();
        }
        return res.status(200).send(ticket);
    }
);

export { router as updateicketRouter };