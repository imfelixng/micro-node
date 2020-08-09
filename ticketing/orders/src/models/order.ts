import mongoose from 'mongoose';
import { OrderStatus } from '@anqtickets/common';
import { TicketDoc } from './ticket';

// This interface describes properties for create new Order
interface OrderAttrs {
    status: OrderStatus;
    expiresAt: Date;
    userId: string;
    ticket: TicketDoc;
}

// This interface describes properties for Order Model
interface OrderModel extends mongoose.Model<OrderDoc>{
    build: (attrs: OrderAttrs) => OrderDoc;
}

// This interface describes properties for Order Document
interface OrderDoc extends mongoose.Document {
    status: OrderStatus;
    expiresAt: Date;
    userId: string;
    ticket: TicketDoc;
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: OrderStatus.CREATED,
        enum: Object.values(OrderStatus),
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;        
        return ret;
      },
    },
  }
);

const buildOrder = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

// Add static func to schema => use Order.build
OrderSchema.statics.build = buildOrder;

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export {
    Order,
}