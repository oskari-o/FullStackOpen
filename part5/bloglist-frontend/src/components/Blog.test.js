import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: "Test blog 1",
    author: "Test author 1",
    url: "http://testurl1.com",
    likes: 1,
    user: {
      username: "testuser1",
      name: "Test User 1",
      id: "testuserid1"
    },
    id: "testblogid1"
  }

  const likeblog = jest.fn()
  const deleteblog = jest.fn()
  
  let container

  beforeEach(() => {
    container = render(
      <Blog blog={blog} likeBlog={likeblog} deleteBlog={deleteblog}/>
    ).container
  })

  test('renders its title and author', async () => {
    //screen.debug()
    const div = screen.getByText('Test blog 1 Test author 1')
  })

  test('at start the url and likes are not displayed', () => {
    const div = container.querySelector('.togglableBlogInfo')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, url and number of likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.togglableBlogInfo')
    expect(div).not.toHaveStyle('display: none')

    const likes = screen.getByText('likes 1')
    const url = screen.getByText('http://testurl1.com')
  })

  test('like function gets calleb with each click', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton) // 1st click
    await user.click(likeButton) // 2nd click

    expect(likeblog.mock.calls).toHaveLength(2)
  })
})