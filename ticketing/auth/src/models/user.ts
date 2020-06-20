import mongoose from 'mongoose';
import {Password} from "../services/password";

// This interface describes properties for create new user
interface UserAttrs {
    email: string;
    password: string;
}

// This interface describes properties for User Model
interface UserModel extends mongoose.Model<UserDoc>{
    build: (attrs: UserAttrs) => any;
}

// This interface describes properties for User Document
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    // createdAt: string;
    // updatedAt: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;        
        return ret;
      },
    },
  }
);

const buildUser = (attrs: UserAttrs) => {
    return new User(attrs);
};

// Add static func to schema => use User.build
userSchema.statics.build = buildUser;

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export {
    User,
}