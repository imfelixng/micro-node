import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user.ts';
import { signinRouter } from './routes/signin.ts';
import { signoutRouter } from './routes/signout.ts';
import { signupRouter } from './routes/signup.ts';
import { errorHandler } from './middlewares/error-handler.ts';
import { NotFoundError } from './errors/not-found-error.ts';

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

app.listen(3000, () => {
    console.log('Auth service starting at port 3000!!!!');
});