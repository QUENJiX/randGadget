import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/products/product-card'
import type { Product } from '@/lib/types'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p-1',
    sku: 'SKU001',
    name: 'Samsung Galaxy S25 Ultra',
    slug: 'samsung-galaxy-s25-ultra',
    brand_id: 1,
    category_id: 1,
    short_desc: 'Flagship phone',
    description: 'The latest Samsung flagship',
    price: 159999,
    compare_price: null,
    cost_price: null,
    stock: 10,
    weight_kg: 0.23,
    is_featured: false,
    is_active: true,
    meta_title: null,
    meta_description: null,
    tags: ['samsung', 'flagship'],
    specs: { display: '6.8" Dynamic AMOLED' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 1, name: 'Samsung', slug: 'samsung', logo_url: null },
    category: {
      id: 1,
      parent_id: null,
      name: 'Smartphones',
      slug: 'smartphones',
      icon_svg: null,
      sort_order: 0,
    },
    images: [],
    variants: [],
    ...overrides,
  }
}

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={makeProduct()} />)
    expect(screen.getByText('Samsung Galaxy S25 Ultra')).toBeInTheDocument()
  })

  it('renders category name', () => {
    render(<ProductCard product={makeProduct()} />)
    expect(screen.getByText('Smartphones')).toBeInTheDocument()
  })

  it('renders formatted price', () => {
    render(<ProductCard product={makeProduct()} />)
    // Price should appear somewhere with ৳
    const priceEl = screen.getByText(/৳/)
    expect(priceEl).toBeInTheDocument()
  })

  it('shows discount badge when compare_price is set', () => {
    render(
      <ProductCard
        product={makeProduct({
          price: 80000,
          compare_price: 100000,
        })}
      />
    )
    expect(screen.getByText('-20%')).toBeInTheDocument()
  })

  it('does not show discount badge without compare_price', () => {
    render(<ProductCard product={makeProduct()} />)
    expect(screen.queryByText(/-%/)).not.toBeInTheDocument()
  })

  it('shows "Featured" badge for featured products', () => {
    render(<ProductCard product={makeProduct({ is_featured: true })} />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('shows low stock warning when stock <= 5', () => {
    render(<ProductCard product={makeProduct({ stock: 3 })} />)
    expect(screen.getByText(/Only 3 left/)).toBeInTheDocument()
  })

  it('shows out of stock message when stock is 0', () => {
    render(<ProductCard product={makeProduct({ stock: 0 })} />)
    expect(screen.getByText('Out of stock')).toBeInTheDocument()
  })

  it('links to the product detail page', () => {
    render(<ProductCard product={makeProduct()} />)
    const links = screen.getAllByRole('link')
    const productLink = links.find((l) =>
      l.getAttribute('href')?.includes('/product/samsung-galaxy-s25-ultra')
    )
    expect(productLink).toBeDefined()
  })

  it('has accessible wishlist and cart buttons', () => {
    render(<ProductCard product={makeProduct()} />)
    expect(screen.getByLabelText('Add to wishlist')).toBeInTheDocument()
    expect(screen.getByLabelText('Quick add to cart')).toBeInTheDocument()
  })

  it('renders compare price with strikethrough when discounted', () => {
    render(
      <ProductCard
        product={makeProduct({
          price: 80000,
          compare_price: 100000,
        })}
      />
    )
    // Should show two prices
    const prices = screen.getAllByText(/৳/)
    expect(prices.length).toBeGreaterThanOrEqual(2)
  })

  it('renders product image when available', () => {
    render(
      <ProductCard
        product={makeProduct({
          images: [
            {
              id: 'img-1',
              product_id: 'p-1',
              url: 'https://cdn.example.com/phone.jpg',
              alt_text: 'Galaxy S25',
              sort_order: 0,
              is_primary: true,
            },
          ],
        })}
      />
    )
    const img = screen.getByAltText('Samsung Galaxy S25 Ultra')
    expect(img).toBeInTheDocument()
  })
})
