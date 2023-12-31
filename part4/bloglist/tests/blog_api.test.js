const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

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

test('likes default to 0', async () => {
  const newBlog = {
    title: 'Test3',
    author: 'Test3',
    url: 'Test3'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
  
  const response = await api.get('/api/blogs')
  const blogsAtEnd = response.body
  expect(blogsAtEnd).toHaveLength(2)

  const likes = blogsAtEnd.map(b => b.likes)
  expect(likes[1]).toBe(0)
})

test('a blog without a title is not added', async () => {
  const newBlog = {
    author: 'Test4',
    url: 'Test4',
    likes: 40000
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
  const response = await api.get('/api/blogs')
  const blogsAtEnd = response.body
  expect(blogsAtEnd).toHaveLength(1)
})

test('a blog without a url is not added', async () => {
  const newBlog = {
    title: 'Test4',
    author: 'Test4',
    likes: 40000
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
  const response = await api.get('/api/blogs')
  const blogsAtEnd = response.body
  expect(blogsAtEnd).toHaveLength(1)
})

test('a blog can be deleted', async () => {
  const response1 = await api.get('/api/blogs')
  const blogsAtStart = response1.body
  const blogToDelete = blogsAtStart[0]
  
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
  const response2 = await api.get('/api/blogs')
  const blogsAtEnd = response2.body

  expect(blogsAtEnd).toHaveLength(0)
})

test('a blog can be updated', async () => {
  const response1 = await api.get('/api/blogs')
  const blogsAtStart = response1.body
  const blogToUpdate = blogsAtStart[0]
  
  const newBlog = {
    title: 'Test',
    author: 'Test',
    url: 'Test',
    likes: 20000
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)

  const response2 = await api.get('/api/blogs')
  const blogsAtEnd = response2.body

  expect(blogsAtEnd).toHaveLength(1)
  expect(blogsAtEnd[0].likes).toBe(20000)
})

describe('when there is initially one user in the db', () => {

  const initialUser = { username: 'root', name: 'Superuser', password: 'Secret' }

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash(initialUser.password, 10)
    const user = new User({username: initialUser.username, passwordHash})
    await user.save()
  })

  test('a valid user can be created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Test1',
      name: 'Test 1',
      password: 'Secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creating a user with invalid username fails', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Te',
      name: 'Test 1',
      password: 'Secret',
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creating a user with invalid password fails', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Test1',
      name: 'Test 1',
      password: 'Se',
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creating a user with a duplicate username fails', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Test 1',
      password: 'Secret',
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})


afterAll(async () => {
  await mongoose.connection.close()
})