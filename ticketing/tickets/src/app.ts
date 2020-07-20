import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@anqtickets/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateicketRouter } from './routes/update';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}));

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateicketRouter);

app.all('*', async () => {
    // Must be handle case async function. Because don't return any promise.
    // We can use next middleware or express-async-errors package to handle this case.
    throw new NotFoundError();
});

app.use(errorHandler);

export {
    app
};