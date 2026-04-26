const { beforeEach, describe, test, after } = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const assert = require('node:assert')
const mongoose = require('mongoose')

const api = supertest(app)

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.init() // this has to run frist so the index is created correctly
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'foobar', passwordHash })

    await user.save()
  })

  // test('user is created correctly', async () => {
  //   const usersAtStart = await helper.usersInDb()

  //   const newUser = {
  //     username: 'test',
  //     name: 'Test User',
  //     password: 'pass123'
  //   }

  //   await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(201)
  //     .expect('Content-Type', /application\/json/)

  //   const usersAtEnd = await helper.usersInDb()
  //   assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  //   const usernames = usersAtEnd.map(u => u.username)
  //   assert(usernames.includes(newUser.username))
  // })

  test('user must be unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'foobar',
      name: 'Foo Bar',
      password: 'sekret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})