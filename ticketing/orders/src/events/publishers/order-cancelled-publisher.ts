import { Publisher, OrderCancelledEvent, Subjects } from "@anqtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;   
}