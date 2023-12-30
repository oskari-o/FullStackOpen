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
  console.log(response.body)
  expect(response.body[0].id).toBeDefined()
})

afterAll(async () => {
  await mongoose.connection.close()
})