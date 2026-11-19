import { useId } from 'react'
import Togglable from './Toggable'

const Blog = ({ blog, user, sendLike, deleteBlog }) => {
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

  const removeBlog = (event) => {
    event.preventDefault()
    window.confirm(`Remove blog ${blog.title} by ${blog.author}`) && deleteBlog(blog.id)
  }

  const id = useId()

  return (
    <div id={id} style={blogStyle}>
      <div>
        {blog.title} by {blog.author}
        {user?.username === blog.user?.username && (
          <button onClick={removeBlog}>remove</button>)}
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