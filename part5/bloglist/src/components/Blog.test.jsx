import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const setup = () => {
  const blog = {
    author: 'Test Author',
    title: 'This is a test title',
    url: 'http://test.com',
    likes: 1337,
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} sendLike={mockHandler} />)

  return {
    mockHandler,
    user: userEvent.setup()
  }
}

describe('<Blog />', () => {
  test('renders content', () => {
    setup()
    const element = screen.getByText('This is a test title by Test Author')
    expect(element).toBeDefined()
  })

  test('url and likes are shown when the button is clicked', async () => {
    const { user } = setup()

    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText('http://test.com')
    expect(url).toBeVisible()

    const likes = screen.getByText('likes 1337')
    expect(likes).toBeVisible()
  })

  test('clicking the like button twice calls the hanlder twice', async () => {
    const { user, mockHandler } = setup()

    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})