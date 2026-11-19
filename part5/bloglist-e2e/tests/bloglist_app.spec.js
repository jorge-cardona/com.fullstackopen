const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog } = require('./helper')
const blog = require('../../bloglist/backend/models/blog')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'test_user',
        password: 'test_pass'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByRole('heading', { name: 'Login' })
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('success with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('test_user')
      await page.getByLabel('password').fill('test_pass')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })
    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('test_user')
      await page.getByLabel('password').fill('wrong_pass')

      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => { 
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('test_user')
      await page.getByLabel('password').fill('test_pass')

      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test_title', 'test_author', 'http://test_url')

      await expect(page.getByText('test_title by test_author')).toBeVisible()
    })

    describe('And several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'first_blog', 'first_author', 'http://first_url')
        await createBlog(page, 'second_blog', 'second_author', 'http://second_url')
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'third_blog', 'third_author', 'http://third_url')

        await expect(page.getByText('third_blog by third_author')).toBeVisible()    
      })

      test('a blog can be liked', async ({ page }) => {
        const blogText = page.getByText('first_blog by first_author')
        const blogElement = blogText.locator('..')
        await blogElement.getByRole('button', { name: 'view' }).click()
        await blogElement.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        page.on('dialog', async (dialog) => dialog.accept())
        const blogText = page.getByText('second_blog by second_author')
        const blogElement = blogText.locator('..')
        await blogElement.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('second_blog by second_author')).not.toBeVisible()
      })

      describe('And multiple users exists', () => {
        beforeEach(async ({ page, request }) => {
          await request.post('/api/users', {
            data: {
              name: 'User Test',
              username: 'user_test',
              password: 'pass_test'
            }
          })
        })

        test('a blog can only be deleted by its author', async ({ page }) => {
          await page.getByRole('button', { name: 'logout' }).click()

          await page.getByLabel('username').fill('user_test')
          await page.getByLabel('password').fill('pass_test')

          await page.getByRole('button', { name: 'login' }).click()

          await expect(page.getByText('User Test logged in')).toBeVisible()
          
          const blogText = page.getByText('second_blog by second_author')
          const blogElement = blogText.locator('..')
          
          await expect(blogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
      })
      
      test.only('blogs are arranged in order according to likes', async ({ page }) => {
        const blogText = page.getByText('second_blog by second_author')
        const blogElement = blogText.locator('..')
        await blogElement.getByRole('button', { name: 'view' }).click()
        await blogElement.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()

        const firstBlog = await page.locator('div div [id]').first()

        await expect(firstBlog).toContainText('second_blog by second_author')
      })
    })
  })
})