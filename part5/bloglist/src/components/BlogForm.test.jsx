import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('new blog form calls the event hanlder with apropiate props', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render (<BlogForm createBlog={createBlog} />)

  const title = screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')
  const createButton = screen.getByText('create')

  await user.type(title, 'test title')
  await user.type(author, 'test author')
  await user.type(url, 'http://test.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('test title')
  expect(createBlog.mock.calls[0][0].author).toBe('test author')
  expect(createBlog.mock.calls[0][0].url).toBe('http://test.com')

})