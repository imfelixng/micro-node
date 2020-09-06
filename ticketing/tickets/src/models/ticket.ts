import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// This interface describes properties for create new Ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}

// This interface describes properties for Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build: (attrs: TicketAttrs) => TicketDoc;
}

// This interface describes properties for Ticket Document
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

const buildTicket = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// Add static func to schema => use Ticket.build
TicketSchema.statics.build = buildTicket;

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema);

export {
  Ticket,
}