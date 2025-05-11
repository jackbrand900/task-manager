// backend/index.test.js
const request = require('supertest');
const app = require('./index');

let server;

beforeAll((done) => {
  server = app.listen(0, done); // start on any available port
});

afterAll((done) => {
  server.close(done);
});

describe('Task API', () => {
  let taskId;

  it('should create a new task', async () => {
    const res = await request(server)
      .post('/tasks')
      .send({ title: 'Test Task', description: 'Test Description' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Task');
    expect(res.body.description).toBe('Test Description');
    expect(res.body.status).toBe('Pending');

    taskId = res.body.id;
  });

  it('should get all tasks', async () => {
    const res = await request(server).get('/tasks');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(task => task.id === taskId)).toBeDefined();
  });

  it('should start a task', async () => {
    const res = await request(server).post(`/tasks/${taskId}/start`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('In Progress');
    expect(res.body.startedAt).toBeDefined();
  });

  it('should pause a task', async () => {
    const res = await request(server).post(`/tasks/${taskId}/pause`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('Paused');
  });

  it('should cancel a task', async () => {
    const res = await request(server).post(`/tasks/${taskId}/cancel`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('Cancelled');
    expect(res.body.cancelledAt).toBeDefined();
  });

  it('should delete a task', async () => {
    const res = await request(server).delete(`/tasks/${taskId}`);

    expect(res.statusCode).toBe(200);
  });

  it('should return 404 for non-existent task', async () => {
    const res = await request(server).delete('/tasks/nonexistent');
    expect(res.statusCode).toBe(404);
  });

  it('should not start a non-existent task', async () => {
    const res = await request(server).post('/tasks/nonexistent/start');
    expect(res.statusCode).toBe(400);
  });
});
