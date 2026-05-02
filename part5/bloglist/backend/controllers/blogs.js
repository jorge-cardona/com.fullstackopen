const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).populate('user').then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {  
  try {
    const user = request.user
    const blog = new Blog(request.body)

    blog.user = user._id

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    return response.status(201).json(savedBlog)

  } catch(error) {
    next(error)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog || user.id.toString() !== blog.user.toString() ) {
    return response.status(400).json({ error: `the '${user.username}' user did not create the blog` })
  } 

  await blog.deleteOne() 

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { author, title, url, likes, user } = request.body

  Blog.findById(request.params.id)
    .then(blog => {
      if(!blog) {
        return response.status(404).end()
      }

      blog.author = author ? author : blog.author 
      blog.title = title ? title : blog.title
      blog.url = url ? url : blog.url
      blog.likes = likes ? likes : blog.likes
      blog.user = user ? user: blog.user

      return blog.save().then((updatedBlog) => {
        response.json(updatedBlog)
      })
    })
    .catch(error => next(error))
})

module.exports = blogsRouter