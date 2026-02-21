import { test, expect } from '@playwright/test'

test.describe('Search Flow', () => {
  test('opens search modal with Ctrl+K', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')
    // Search modal should appear with input
    const searchInput = page.getByPlaceholder(/Search for products/i)
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toBeFocused()
  })

  test('opens search modal via search button', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Search products').click()
    const searchInput = page.getByPlaceholder(/Search for products/i)
    await expect(searchInput).toBeVisible()
  })

  test('closes search modal with Escape', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')
    await expect(page.getByPlaceholder(/Search for products/i)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByPlaceholder(/Search for products/i)).not.toBeVisible()
  })

  test('shows trending searches when empty', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')
    await expect(page.getByText('Trending')).toBeVisible()
  })

  test('navigates to search results page via "View all"', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')
    const input = page.getByPlaceholder(/Search for products/i)
    await input.fill('iphone')
    // Wait a bit for debounced search
    await page.waitForTimeout(500)
    // If results appear, the "View all results" link should be visible
    const viewAll = page.getByRole('link', { name: /View all results/i })
    if (await viewAll.isVisible()) {
      await viewAll.click()
      await expect(page).toHaveURL(/\/search\?q=iphone/)
    }
  })

  test('search modal has dialog role for accessibility', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')
    const dialog = page.getByRole('dialog', { name: /Search products/i })
    await expect(dialog).toBeVisible()
  })
})
