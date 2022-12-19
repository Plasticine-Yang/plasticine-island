import { expect, test } from '@playwright/test'

const E2E_DEV_SERVER_URL = 'http://localhost:5173'

test('Verify that the page renders properly', async ({ page }) => {
  await page.goto(E2E_DEV_SERVER_URL)

  const res = await page.evaluate(async () => {
    const pageContent = document.body.innerText
    return pageContent.includes('This is Layout Component')
  })

  expect(res).toBe(true)
})
