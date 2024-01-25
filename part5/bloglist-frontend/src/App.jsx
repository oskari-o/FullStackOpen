import { useState, useEffect, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

import NotificationContext from './NotificationContext'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, messageDispatch, messageType, messageTypeDispatch] =
    useContext(NotificationContext)

  const displayMessage = (message, messageType, duration = 5) => {
    messageDispatch({ type: 'SET', payload: message })
    messageTypeDispatch({ type: 'SET', payload: messageType })
    setTimeout(() => {
      messageDispatch({ type: 'CLEAR' })
    }, duration * 1000)
  }

  const blogResult = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const blogs = blogResult.data

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (returnedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      displayMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        'info'
      )
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (returnedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      displayMessage(
        `blog ${returnedBlog.title} by ${returnedBlog.author} updated`,
        'info'
      )
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

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
      displayMessage('Wrong credentials', 'error')
    }
  }

  const addBlog = (blogObject) => {
    newBlogMutation.mutate(blogObject)
  }

  const updateBlog = async (blogObject) => {
    updateBlogMutation.mutate(blogObject)
  }

  const likeBlog = async (blogObject) => {
    const likedBlog = {
      ...blogObject,
      likes: blogObject.likes + 1,
      user: blogObject.user.id,
    }
    updateBlog(likedBlog)
  }

  const removeBlog = async (blogObject) => {
    if (
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)
    ) {
      await deleteBlogMutation.mutate(blogObject.id)
      displayMessage(
        `blog '${blogObject.title}' by '${blogObject.author}' removed`,
        'info'
      )
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
          {blogResult.isLoading && <div>Loading blogs...</div>}
          {!blogResult.isLoading &&
            blogs.map((blog) => {
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
