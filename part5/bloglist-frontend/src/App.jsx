import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('info')

  const updateBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }

  useEffect(() => {
    updateBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('Wrong credentials')
      setMessage('Wrong credentials')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    //blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    updateBlogs()
    setMessage(
      `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
    )
    setMessageType('info')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const updateBlog = async (id, blogObject) => {
    const returnedBlog = await blogService.update(id, blogObject)
    updateBlogs()
    // Message can be removed
    setMessage(
      `blog {${returnedBlog.title}} by {${returnedBlog.author}} updated`
    )
    setMessageType('info')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const likeBlog = async (blogObject) => {
    const likedBlog = {
      ...blogObject,
      likes: blogObject.likes + 1,
      user: blogObject.user.id,
    }
    updateBlog(blogObject.id, likedBlog)
  }

  const removeBlog = async (blogObject) => {
    if (
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)
    ) {
      await blogService.deleteBlog(blogObject.id)
      updateBlogs()
      setMessage(`blog '${blogObject.title}' by '${blogObject.author}' removed`)
      setMessageType('info')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog">
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const Notification = ({ message, messageType }) => {
    if (message === null) {
      return null
    }

    return <div className={messageType}>{message}</div>
  }

  return (
    <div>
      {Notification({ message, messageType })}
      <h2>blogs</h2>
      {!user && loginForm()}
      {user && (
        <div>
          {blogForm()}
          <p>
            {user.name} logged in
            <button
              onClick={() => {
                window.localStorage.removeItem('loggedBloglistUser')
                setUser(null)
                setUsername('')
                setPassword('')
              }}
            >
              logout
            </button>
          </p>
          {blogs.map((blog) => {
            const deleteBlog = blog.user
              ? blog.user.username === user.username
                ? removeBlog
                : null
              : null
            return (
              <Blog
                key={blog.id}
                blog={blog}
                likeBlog={likeBlog}
                deleteBlog={deleteBlog}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default App
