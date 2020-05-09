import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
    // Must be handle case async function. Because don't return any promise.
    // We can use next middleware or express-async-errors package to handle this case.
    throw new NotFoundError();
});

app.use(errorHandler);

(async () => {
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
