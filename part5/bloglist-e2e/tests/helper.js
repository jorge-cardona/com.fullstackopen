const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()

  await page.getByText(`a new blog ${title} by ${author} added`).waitFor()
  await page.getByText(`a new blog ${title} by ${author} added`).waitFor({ state: 'hidden' });
}

export { createBlog }