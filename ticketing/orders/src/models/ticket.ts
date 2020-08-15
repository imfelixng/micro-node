import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// This interface describes properties for create new Ticket
interface TicketAttrs {
  title: string;
  price: number;
  id: string;
}

// This interface describes properties for Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build: (attrs: TicketAttrs) => TicketDoc;
  findByEvent: (event: { id: string, version: number }) => Promise<TicketDoc | null>
}

// This interface describes properties for Ticket Document
interface TicketDoc extends mongoose.Document {
  version: number;
  title: string;
  price: number;
  isReserved(): Promise<boolean>,
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

const buildTicket = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

// Custom resolve concurreny access
// TicketSchema.pre('save', function (done) {
//   // @ts-ignore
//   this.$where = {
//       // @ts-ignore
//     version: this.get('version') - 1 // find ticket with this version
//   };

//   done();
// });


// Add static func to schema => use Ticket.build
TicketSchema.statics.build = buildTicket;

TicketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  })
};

TicketSchema.methods.isReserved = async function () {
  // This === the ticket document that we just called 'isReserved'
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.CREATED,
        OrderStatus.AWAITING_PAYMENT,
        OrderStatus.COMPLETED
      ]
    }
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema);

export {
  Ticket,
  TicketDoc,
}