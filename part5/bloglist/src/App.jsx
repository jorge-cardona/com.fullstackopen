import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Toggable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()
  

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setMessage({text: 'wrong credentials', type: 'error'})
      console.log('an error has occured', error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()

    blogService.create(blogObject).then(returnedObject => {
      setBlogs(blogs.concat(returnedObject))
    })

    setMessage({text: `a new blog ${blogObject.title} by ${blogObject.author} added`, type: 'success'})
    setTimeout(() => {
      setMessage(null)
    }, 5000);
  }

  const likeBlog = (id) => {
    const blog = blogs.find(b => b.id === id)
    const newLike = { likes: (blog.likes + 1) }

    blogService.update(id, newLike).then(returnedBlog => {
      setBlogs(blogs.map(b => b.id === id ? returnedBlog : b))
    }).catch(error => {
      console.log('an error should be shown')
      setMessage({text: 'Blog could not be found', type: 'error'})
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setBlogs(blogs.filter(b => b.id !== id))
    })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <Notification message={message} />
      <div>
        <label>
          username
          <input type="text"
                 value={username}
                 onChange={({ target }) => setUsername(target.value)}/>
        </label>
      </div>
      <div>
        <label>
          password
          <input type="password"
                 value={password}
                 onChange={({ target }) => setPassword(target.value)}/>
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

  if (!user) return loginForm()

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
        {blogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} sendLike={likeBlog} />
        )}
    </div>
  )
}

export default App