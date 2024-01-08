import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const container = render(<BlogForm createBlog={createBlog} />).container

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')

  const sendButton = screen.getByText('save')

  // fill the form but leave title as-is with placeholder text
  await user.type(authorInput, 'testing a blog author...')
  await user.type(urlInput, 'testing a blog url...')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('a new blog title...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing a blog author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing a blog url...')
})