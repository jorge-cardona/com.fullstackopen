const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    // console.log('cleared')

    // const noteObjects = helper.initialNotes.map(note => new Note(note))
    // const promiseArray = noteObjects.map(note => note.save())
    // await Promise.all(promiseArray)

    // helper.initialNotes.forEach(async (note) => {
    //   let noteObject = new Note(note)
    //   await noteObject.save()
    //   console.log('saved')
    // })
    console.log('done')
    // let noteObject = new Note(helper.initialNotes[0])
    // await noteObject.save()
    // noteObject = new Note(helper.initialNotes[1])
    // await noteObject.save()
  })

  test.only('notes are returned as json', async () => {
    console.log('entered test')
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test.only('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'), true)
  })

  describe('viewing a specific note', () => {
    test('a specific note can be viewed', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToView = notesAtStart[0]

      const resultNotes = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNotes.body, noteToView)
    })

    test('fails with a status code 404 if note does not exist', async () => {
      const validNonExistingId = await helper.nonExistingid()

      await api.get(`/api/notes/${validNonExistingId}`).expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/notes/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('a valid note can be added', async () => {
      const [ user ] = await helper.usersInDb()

      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
        userId: user.id
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(n => n.content)

      assert(contents.includes(newNote.content))
    })

    test('note without content is not added', async () => {
      const newNote = {
        important: true
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('a note can be deleted', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      const ids = notesAtEnd.map(n => n.id)
      assert(!ids.includes(noteToDelete.id))

      assert.strictEqual(notesAtEnd.length, notesAtStart.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})