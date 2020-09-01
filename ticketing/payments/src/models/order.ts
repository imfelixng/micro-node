import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose from 'mongoose';
import { OrderStatus } from '@anqtickets/common';

// This interface describes properties for create new Order
interface OrderAttrs {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    price: number;
}

// This interface describes properties for Order Model
interface OrderModel extends mongoose.Model<OrderDoc>{
    build: (attrs: OrderAttrs) => OrderDoc;
}

// This interface describes properties for Order Document
interface OrderDoc extends mongoose.Document {
    version: number;
    status: OrderStatus;
    userId: string;
    price: number;
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
    price: {
        type: Number,
        required: true,
    }
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

OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);

const buildOrder = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status
    });
};

// Add static func to schema => use Order.build
OrderSchema.statics.build = buildOrder;

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export {
    Order,
}