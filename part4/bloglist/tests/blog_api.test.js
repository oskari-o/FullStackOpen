const mongoose = require('mongoose')
const supertest = require('supertest')
//const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog({
    title: 'Test',
    author: 'Test',
    url: 'Test',
    likes: 10000
  })

  await blogObject.save()
}, 15000)

const api = supertest(app)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(1)
})

test('id property exists', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test2',
    author: 'Test2',
    url: 'Test2',
    likes: 20000
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const blogsAtEnd = response.body
  expect(blogsAtEnd).toHaveLength(2)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(
    'Test2'
  )
})

afterAll(async () => {
  await mongoose.connection.close()
})