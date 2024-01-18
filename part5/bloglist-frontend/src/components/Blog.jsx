import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const buttonLabel = visible ? 'hide' : 'view'
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>{buttonLabel}</button>
      <div style={showWhenVisible} className="togglableBlogInfo">
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={() => likeBlog(blog)}>like</button></p>
        <p>{blog.user ? blog.user.name : 'Undefined creator'}</p>
        {deleteBlog && <button onClick={() => deleteBlog(blog)}>remove</button>}
      </div>
    </div>  
  )
}

export default Blog