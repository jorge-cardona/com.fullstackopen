const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()

const mongoUrl = 'mongodb+srv://fullstack:RvOs5hWvKDd107pT@cluster0.jtp88tu.mongodb.net/bloglistApp?retryWrites=true&w=majority&appName=Cluster0'
console.log('connecting to', mongoUrl)
mongoose.connect(mongoUrl)

app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app