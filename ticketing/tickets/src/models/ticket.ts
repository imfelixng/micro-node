import mongoose from 'mongoose';

// This interface describes properties for create new Ticket
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// This interface describes properties for Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc>{
    build: (attrs: TicketAttrs) => any;
}

// This interface describes properties for Ticket Document
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
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

const buildTicket = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

// Add static func to schema => use Ticket.build
TicketSchema.statics.build = buildTicket;

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema);

export {
    Ticket,
}