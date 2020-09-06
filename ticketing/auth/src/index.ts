import mongoose from 'mongoose';
import { app } from './app';

(async () => {
    console.log('Starting up...');
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    if (!process.env.MONGO_DB_NAME) {
        throw new Error('MONGO_DB_NAME must be defined');
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME,
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
