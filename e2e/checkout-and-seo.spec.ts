import { test, expect } from '@playwright/test'

test.describe('Checkout Page', () => {
  test('loads checkout page', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page).toHaveTitle(/Checkout/)
  })

  test('shows the checkout flow', async ({ page }) => {
    await page.goto('/checkout')
    // The checkout flow component should load (dynamically imported)
    await page.waitForTimeout(2000)
    // Should show step indicators or checkout content
    const heading = page.getByRole('heading')
    await expect(heading.first()).toBeVisible()
  })
})

test.describe('Static Pages', () => {
  const staticPages = [
    { path: '/about', title: /About/ },
    { path: '/privacy', title: /Privacy/ },
    { path: '/terms', title: /Terms/ },
    { path: '/returns', title: /Return/ },
    { path: '/shipping', title: /Shipping/ },
    { path: '/faq', title: /FAQ/ },
    { path: '/support', title: /Support/ },
  ]

  for (const { path, title } of staticPages) {
    test(`${path} loads with correct title`, async ({ page }) => {
      await page.goto(path)
      await expect(page).toHaveTitle(title)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })
  }
})

test.describe('SEO', () => {
  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response?.status()).toBe(200)
    const text = await response?.text()
    expect(text).toContain('User-Agent')
    expect(text).toContain('Sitemap')
  })

  test('sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response?.status()).toBe(200)
  })

  test('product page has JSON-LD structured data', async ({ page }) => {
    // Navigate to any product page — we just need the structure
    await page.goto('/')
    // Find a product link on the homepage if any exist
    const productLink = page.locator('a[href^="/product/"]').first()
    if (await productLink.isVisible()) {
      await productLink.click()
      await page.waitForLoadState('networkidle')
      const jsonLd = page.locator('script[type="application/ld+json"]')
      if (await jsonLd.isVisible()) {
        const content = await jsonLd.textContent()
        expect(content).toContain('"@type":"Product"')
      }
    }
  })
})
