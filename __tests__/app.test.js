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
    });

    let todo = {
      id: expect.any(Number),
      task: 'wash dishes',
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
      console.log(todo);
    });


    it('GET /api/me/todos', async () => {
      let secondTodo = {
        id: expect.any(Number),
        task: 'clean floors',
        completed: false
      };
      
      
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

  });
});