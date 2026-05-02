import Togglable from './Toggable'

const Blog = ({ blog, sendLike }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeBlog = (event) => {
    event.preventDefault()
    sendLike(blog.id)
  }

  console.log(blog)

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} by {blog.author}
        <Togglable buttonLabel="view">
          <a href={blog.url}>{blog.url}</a>
          <p>
            likes {blog.likes}
            <button onClick={likeBlog}>like</button>
          </p>
          <p>{blog.user?.name}</p>
        </Togglable>
      </div>
    </div>
  )
}

export default Blog