const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Import the app setup
const app = express();
app.use(cors());
app.use(express.json());

// Mock the tasks and timers objects
const tasks = {};
const timers = {};

// Mock the setTimeout function
jest.useFakeTimers();

describe('Task API', () => {
  beforeEach(() => {
    // Clear all mocks and objects before each test
    Object.keys(tasks).forEach(key => delete tasks[key]);
    Object.keys(timers).forEach(key => delete timers[key]);
    jest.clearAllMocks();
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
      expect(response.body.description).toBe('Test Description');
      expect(response.body.status).toBe('Pending');
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      // Create a test task
      const taskId = uuidv4();
      tasks[taskId] = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'Pending',
        duration: 30000,
        remaining: 30000,
        createdAt: Date.now()
      };

      const response = await request(app)
        .get('/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Test Task');
    });
  });

  describe('POST /tasks/:id/start', () => {
    it('should start a pending task', async () => {
      const taskId = uuidv4();
      tasks[taskId] = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'Pending',
        duration: 30000,
        remaining: 30000,
        createdAt: Date.now()
      };

      const response = await request(app)
        .post(`/tasks/${taskId}/start`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('In Progress');
      expect(response.body.startedAt).toBeDefined();
    });

    it('should not start a non-existent task', async () => {
      const response = await request(app)
        .post('/tasks/nonexistent/start');

      expect(response.status).toBe(400);
    });
  });

  describe('POST /tasks/:id/pause', () => {
    it('should pause an in-progress task', async () => {
      const taskId = uuidv4();
      tasks[taskId] = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'In Progress',
        duration: 30000,
        remaining: 30000,
        createdAt: Date.now(),
        _startedAt: Date.now()
      };

      const response = await request(app)
        .post(`/tasks/${taskId}/pause`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Paused');
    });
  });

  describe('POST /tasks/:id/cancel', () => {
    it('should cancel a task', async () => {
      const taskId = uuidv4();
      tasks[taskId] = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'Pending',
        duration: 30000,
        remaining: 30000,
        createdAt: Date.now()
      };

      const response = await request(app)
        .post(`/tasks/${taskId}/cancel`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Cancelled');
      expect(response.body.cancelledAt).toBeDefined();
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const taskId = uuidv4();
      tasks[taskId] = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'Pending',
        duration: 30000,
        remaining: 30000,
        createdAt: Date.now()
      };

      const response = await request(app)
        .delete(`/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(tasks[taskId]).toBeUndefined();
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/tasks/nonexistent');

      expect(response.status).toBe(404);
    });
  });
}); 