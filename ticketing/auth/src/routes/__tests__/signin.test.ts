import request from 'supertest';
import { app } from '../../app';


it('fails when a email that does not exist is suplied', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test123@test.com',
            password: 'password'
        })
        .expect(422);
});


it('fails when a incorrect password is suplied', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password1234'
        })
        .expect(422);
});

it('reqonds with a cookie when given valid credentials', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);
    const response = await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});