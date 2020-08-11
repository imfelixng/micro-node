import { Publisher, OrderCreatedEvent, Subjects } from "@anqtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;   
}