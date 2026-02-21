import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads and displays hero section', async ({ page }) => {
    await page.goto('/')
    // Hero headline
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    // CTA links
    await expect(page.getByRole('link', { name: /Explore Collection/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Today's Deals/i })).toBeVisible()
  })

  test('has correct page title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/GadgetBD/)
  })

  test('header shows navigation links on desktop', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Smartphones' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Laptops' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Audio' })).toBeVisible()
  })

  test('footer is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer')).toBeVisible()
  })

  test('skip-to-content link becomes visible on focus', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: /Skip to content/i })
    await expect(skipLink).toBeVisible()
  })
})
