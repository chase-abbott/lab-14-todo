import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';


const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/todos', () => {
    let user;
    let user2;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          password: 'password'
        });

      const secondResponse = await request
        .post('/api/auth/signup')
        .send({
          name: 'you the User',
          email: 'you@user.com',
          password: 'pw'
        });

      expect(response.status).toBe(200);
      expect(secondResponse.status).toBe(200);

      user = response.body;
      user2 = secondResponse.body;
      console.log(user.token)
    });

    let todo = {
      id: expect.any(Number),
      task: 'wash dishes',
      completed: false
    };

    let secondTodo = {
      id: expect.any(Number),
      task: 'clean floors',
      completed: false
    };

    // append the token to your requests:
    //  .set('Authorization', user.token);
    it('POST /api/todos', async () => {

      const response = await request
        .post('/api/todos')
        .set('Authorization', user.token)
        .send(todo);
      todo.userId = user.id;

      expect(response.status).toBe(200);
      expect(response.body).toEqual(todo);
      todo = response.body;
    });


    it('GET /api/me/todos', async () => {

      const postResponse = await request
        .post('/api/todos')
        .set('Authorization', user2.token)
        .send(secondTodo);
      expect(postResponse.status).toBe(200);

      secondTodo = postResponse.body;
      // remove this line, here to not have lint error:

      const response = await request
        .get('/api/me/todos')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.not.arrayContaining([secondTodo]));

      const response2 = await request
        .get('/api/me/todos')
        .set('Authorization', user2.token);

      expect(response2.status).toBe(200);
      expect(response2.body).toEqual(expect.not.arrayContaining([todo]));

    });

    it('DELETE /api/todos:id', async () => {
      const response = await request
        .delete(`/api/todos${todo.id}`)
        .set('Authorization', user.token);

      const secondResponse = await request
        .get('/api/me/todos')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([todo]);
      expect(secondResponse.body.find(todoObject => todoObject.id === todo.id)).toBeUndefined();
    });

    it('PUT /api/todos/:id/completed allows completed to change but not task, id, or userId', async () => {
      secondTodo.completed = true;

      const response = await request
        .put(`/api/todos/${secondTodo.id}/completed`)
        .set('Authorization', user2.token)
        .send(secondTodo);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(secondTodo);

      secondTodo.task = 'take out the trash';

      const secondResponse = await request
        .put(`/api/todos/${secondTodo.id}/completed`)
        .set('Authorization', user2.token)
        .send(secondTodo);

      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body).toEqual({
        id: expect.any(Number),
        task: 'clean floors',
        completed: true,
        userId: expect.any(Number)
      });

    });

  });
});