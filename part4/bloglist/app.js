const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const middelware = require('./utils/middleware')

const app = express()

console.log('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)

app.use(express.json())

app.use(middelware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middelware.unknownEndpoint)
app.use(middelware.errorHandler)

module.exports = app