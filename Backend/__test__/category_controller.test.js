const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { getCategory, createCategory, deleteCategory } = require('../Controllers/categoryController');

// Mocking the Category model
jest.mock('../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const CategoryMock = dbMock.define('event_category', {
    id: 1,
    name: 'Music',
    icon: 'http//Music/icon',

  });

  return {
    event_category: CategoryMock,
  };
});

const app = express();
app.use(bodyParser.json());

// Mocking the routes as per your setup
app.use('/api', require('../Routes/categoryRoute')); // Replace with the actual path to your routes

describe('Category Controller', () => {
  it('should fetch a category by ID', async () => {
    const res = await request(app).get('/api/getCategory/1');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
   
  });

  it('should fetch all categories with limit and offset', async () => {
    const res = await request(app).get('/api/getCategory?limit=10&offset=0');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    // Add more specific assertions based on your mock data if needed
  });

  it('should create a new category', async () => {
    const newCategory = {
      name: 'Sports',
      description: 'Sports events',
    };
    const res = await request(app).post('/api/category/insert').send(newCategory);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('newCategory');
    expect(res.body.newCategory).toHaveProperty('name', 'Sports');
    expect(res.body.newCategory).toHaveProperty('description', 'Sports events');
  });

  it('should delete a category by ID', async () => {
    const res = await request(app)
    .delete('/api/category/delete/1');
    console.error('Response body:', res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Category deleted successfully');
  });

  it('should return 404 if category not found on delete', async () => {
    const res = await request(app).delete('/api/category/delete/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Category not found');
  });
});
