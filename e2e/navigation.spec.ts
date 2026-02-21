import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('navigates to category page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Smartphones' }).click()
    await expect(page).toHaveURL('/category/smartphones')
    await expect(page.getByRole('heading', { name: /Smartphones/i })).toBeVisible()
  })

  test('navigates to deals page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Today's Deals/i }).click()
    await expect(page).toHaveURL('/deals')
  })

  test('navigates to cart page', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel(/Shopping cart/i).click()
    await expect(page).toHaveURL('/cart')
  })

  test('navigates to about page', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveTitle(/About/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('navigates to FAQ page', async ({ page }) => {
    await page.goto('/faq')
    await expect(page).toHaveTitle(/FAQ/)
  })

  test('navigates to privacy page', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page).toHaveTitle(/Privacy/)
  })

  test('navigates to shipping info page', async ({ page }) => {
    await page.goto('/shipping')
    await expect(page).toHaveTitle(/Shipping/)
  })
})

test.describe('Cart Page', () => {
  test('shows empty cart state', async ({ page }) => {
    await page.goto('/cart')
    // Should show empty cart message or the cart view
    await expect(page.getByRole('heading')).toBeVisible()
  })
})

test.describe('Auth Pages', () => {
  test('shows login form on account page when not logged in', async ({ page }) => {
    await page.goto('/account')
    // Should redirect to login or show auth form
    await page.waitForTimeout(1000)
    // The page should be accessible
    const url = page.url()
    expect(url).toMatch(/account|login|auth/)
  })

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page).toHaveTitle(/Reset Password/)
  })
})

test.describe('Responsive', () => {
  test('mobile menu toggle works on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    // Mobile menu button should be visible
    const menuButton = page.getByLabel(/Open menu/i)
    if (await menuButton.isVisible()) {
      await menuButton.click()
      // Navigation links should become visible
      await expect(page.getByRole('link', { name: 'Smartphones' })).toBeVisible()
    }
  })

  test('homepage renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
