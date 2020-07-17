import mongoose from 'mongoose';
import { app } from './app';

(async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv', {
            dbName: 'auth',
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true,
        });
        console.log('Connected to mongoDB!');
    } catch (e) {
        console.error(e);
    }

    app.listen(3000, () => {
        console.log('Auth service starting at port 3000!!!!');
    });
})();
