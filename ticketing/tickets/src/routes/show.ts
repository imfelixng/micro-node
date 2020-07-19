import express, { Request, Response } from "express";
import { Ticket } from '../models/ticket';
import { NotFoundError, validateRequest } from "@anqtickets/common";
import { param } from "express-validator";

const router = express.Router();

router.get(
    '/api/tickets/:id',
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

export { router as showTicketRouter };