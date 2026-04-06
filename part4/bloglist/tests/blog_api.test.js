const { test, after, beforeEach, beforeAll } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')

const api = supertest(app)

let token;

test.before(async () => {
  await User.init() // this has to run frist so the index is created correctly
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'foobar', passwordHash })

  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id
  }

  token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned in JSON format', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the unique identifier property of blog posts is id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert(blog.id !== undefined)
  });
})

test('blogs post are created successfully', async () => {
  const newBlog = {
    title: "Example Blog",
    author: "John Doe",
    url: "https://example.com/",
    likes: 1337,
  }

  const savedBlog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogs = (await Blog.find({})).map(blog => blog.toJSON())
  assert(blogs.length === helper.initialBlogs.length + 1)

  const { id, user, ...blog } = savedBlog.body
  assert.deepStrictEqual(blog, newBlog)
})

test('creating a blog without auth token returns 401 status code', async () => {
  const newBlog = {
    title: "Example Blog",
    author: "John Doe",
    url: "https://example.com/",
    likes: 1337,
  }

  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('creating a blog without likes defaults to 0', async () => {
  const newBlog = {
    title: "Example Blog",
    author: "John Doe",
    url: "https://example.com/",
  }

   const savedBlog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
  
  assert(savedBlog.body.likes === 0)
})

test('creating a blog without a title or url returns a 400 status code', async () => {
  const newBlog = {
    // title: "Example Blog",
    author: "John Doe",
    // url: "https://example.com/",
    likes: 1337,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('sending a request to an undefined endpoint returns a 404 status code with the appropiate message' , async () => {
  const response = await api.get('/foo')
    .expect(404)
    .expect('Content-Type', /application\/json/)

  assert(response.body.error === 'unknown endpoint')
})

test.skip('deleting a blog returns a 204 status code', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(n => n.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('updating the information of an individual blog', async () => {
  const update = {
    likes: 999
  }

  const blogs = await helper.blogsInDb()
  const blog = blogs[0]

  await api
    .put(`/api/blogs/${blog.id}`)
    .send(update)
    .then(200)

  const updatedBlogs = await helper.blogsInDb()

  const updatedBlog = updatedBlogs.find(b => b.id === blog.id)

  assert.strictEqual(updatedBlog.likes, update.likes)
})

after(async () => {
  await mongoose.connection.close()
})