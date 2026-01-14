const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  // return blogs.reduce((sum, blog) => sum + blog.likes, 0)

  return _.sumBy(blogs, 'likes')
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {}
  
  // let favorite = blogs[0]

  // for (const blog of blogs) {
  //   if (blog.likes > favorite.likes) {
  //     favorite = blog
  //   }
  // }

  const favorite = _.maxBy(blogs, 'likes')

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const blogsCount = _.countBy(blogs, 'author')

  const authorBlogs = Object.entries(blogsCount).map(([author, blogs]) =>
    ({ author, blogs }))

  return _.maxBy(authorBlogs, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const authorLikes = blogs.reduce((acc, { author, likes }) => {
    acc[author] = (acc[author] || 0) + likes
    return acc
  }, {})
  
  const totalLikes = Object.entries(authorLikes).map(([author, likes]) =>
    ({ author, likes }))

  return _.maxBy(totalLikes, 'likes')
}

module.exports = { 
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}