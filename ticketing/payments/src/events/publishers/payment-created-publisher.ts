import { Publisher, Subjects, PaymentCreatedEvent } from "@anqtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;   
}