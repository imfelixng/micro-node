import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose from 'mongoose';

// This interface describes properties for create new Payment
interface PaymentAttrs {
    stripeId: string;
    orderId: string;
}

// This interface describes properties for Payment Model
interface PaymentModel extends mongoose.Model<PaymentDoc>{
    build: (attrs: PaymentAttrs) => PaymentDoc;
}

// This interface describes properties for Payment Document
interface PaymentDoc extends mongoose.Document {
    version: number;
    stripeId: string;
    orderId: string;
}

const PaymentSchema = new mongoose.Schema(
  {
    stripeId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
        ref: 'Order'
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

PaymentSchema.set('versionKey', 'version');
PaymentSchema.plugin(updateIfCurrentPlugin);

const buildPayment = (attrs: PaymentAttrs) => {
    return new Payment({
        orderId: attrs.orderId,
        stripeId: attrs.stripeId,
    });
};

// Add static func to schema => use Payment.build
PaymentSchema.statics.build = buildPayment;

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', PaymentSchema);

export {
    Payment,
}