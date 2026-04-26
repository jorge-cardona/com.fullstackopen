import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  

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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url
    }

    blogService.create(blogObject).then(returnedObject => {
      setBlogs(blogs.concat(returnedObject))
      setTitle('')
      setAuthor('')
      setUrl('')
    })

    setMessage({text: `a new blog ${title} by ${author} added`, type: 'success'})
    setTimeout(() => {
      setMessage(null)
    }, 5000);
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
    <form onSubmit={addBlog}>
      <div>
        <h2>create new blog</h2>
        <div>
          <label>
            title:
            <input type="text"
                  value={title}
                  onChange={({ target }) => setTitle(target.value)}/>
          </label>
        </div>
        <div>
          <label>
            author:
            <input type="text"
                  value={author}
                  onChange={({ target }) => setAuthor(target.value)}/>
          </label>
        </div>
        <div>
          <label>
            url:
            <input type="text"
                  value={url}
                  onChange={({ target }) => setUrl(target.value)}/>
          </label>
        </div>
      </div>
      <button type="submit">create</button>
    </form>
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
          <Blog key={blog.id} blog={blog} />
        )}
    </div>
  )
}

export default App