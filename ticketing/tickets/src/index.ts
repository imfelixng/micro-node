import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

(async () => {
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
        await natsWrapper.connect('ticketing', '11sdsdsd212121', 'http://nats-srv:4222');
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

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
        console.log('Tickets service starting at port 3000!!!!');
    });
})();
