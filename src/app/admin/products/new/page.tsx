'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, X, Upload, ImageIcon, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { imageUrl } from '@/lib/utils'

interface CategoryOption { id: number; name: string }
interface BrandOption { id: number; name: string }

export default function NewProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [brands, setBrands] = useState<BrandOption[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }])
  const [images, setImages] = useState<{ path: string; is_primary: boolean }[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.from('categories').select('id, name').order('name').then(({ data }: { data: any }) => {
      if (data) setCategories(data)
    })
    supabase.from('brands').select('id, name').order('name').then(({ data }: { data: any }) => {
      if (data) setBrands(data)
    })
  }, [])

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')
    const sku = form.get('sku') as string
    const price = Number(form.get('price'))
    const compare_price = Number(form.get('compare_price')) || null
    const cost_price = Number(form.get('cost_price')) || null
    const stock = Number(form.get('stock')) || 0
    const weight_kg = Number(form.get('weight_kg')) || 0
    const category_id = Number(form.get('category_id')) || null
    const brand_id = Number(form.get('brand_id')) || null
    const short_desc = (form.get('short_desc') as string) || null
    const description = (form.get('description') as string) || null
    const is_featured = form.get('is_featured') === 'on'
    const is_active = form.get('is_active') !== 'off'

    const specsObj: Record<string, string> = {}
    specs.forEach((s) => { if (s.key.trim() && s.value.trim()) specsObj[s.key.trim()] = s.value.trim() })

    if (!name || !sku || !price) {
      setError('Name, SKU, and price are required.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    if (!supabase) { setError('Supabase not configured.'); setLoading(false); return }

    const { error: dbError, data: inserted } = await supabase.from('products').insert({
      name,
      slug,
      sku,
      price,
      compare_price,
      cost_price,
      stock,
      weight_kg,
      category_id,
      brand_id,
      short_desc,
      description,
      is_featured,
      is_active,
      tags,
      specs: specsObj,
    }).select('id').single()

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    // Insert product images
    if (inserted && images.length > 0) {
      const imageRows = images.map((img, i) => ({
        product_id: inserted.id,
        url: img.path,
        sort_order: i,
        is_primary: img.is_primary,
      }))
      await supabase.from('product_images').insert(imageRows)
    }

    router.push('/admin/products')
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to products
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5 space-y-4">
              <h2 className="font-semibold text-sm">Basic Info</h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">Product Name *</label>
                <input name="name" required className="admin-input" placeholder="e.g. iPhone 16 Pro Max — 256GB" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">SKU *</label>
                  <input name="sku" required className="admin-input font-mono" placeholder="e.g. IPH16PM-256" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Weight (kg)</label>
                  <input name="weight_kg" type="number" step="0.01" className="admin-input" placeholder="0.23" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Short Description</label>
                <input name="short_desc" className="admin-input" placeholder="One-line summary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Description</label>
                <textarea name="description" rows={5} className="admin-input resize-none" placeholder="Detailed product description…" />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5 space-y-4">
              <h2 className="font-semibold text-sm">Pricing & Stock</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Price (৳) *</label>
                  <input name="price" type="number" required className="admin-input" placeholder="189999" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Compare Price (৳)</label>
                  <input name="compare_price" type="number" className="admin-input" placeholder="199999" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Cost Price (৳)</label>
                  <input name="cost_price" type="number" className="admin-input" placeholder="170000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Stock</label>
                <input name="stock" type="number" className="admin-input" placeholder="100" defaultValue="0" />
              </div>
            </div>

            {/* Images */}
            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5 space-y-4">
              <h2 className="font-semibold text-sm">Product Images</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={img.path} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--color-border)]/50 group">
                    <Image
                      src={imageUrl(img.path)}
                      alt={`Upload ${i + 1}`}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setImages(images.map((im, j) => ({ ...im, is_primary: j === i })))
                        }}
                        className={`p-1 rounded-md text-white transition-colors ${
                          img.is_primary ? 'bg-amber-500' : 'bg-black/50 hover:bg-amber-500'
                        }`}
                        title="Set as primary"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, j) => j !== i))}
                        className="p-1 rounded-md bg-black/50 hover:bg-red-600 text-white transition-colors"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {img.is_primary && (
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">Primary</span>
                    )}
                  </div>
                ))}
                <label
                  className={`aspect-square rounded-lg border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-alt)] transition-colors ${
                    uploading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  {uploading ? (
                    <span className="w-5 h-5 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                      <span className="text-[11px] text-[var(--color-text-tertiary)]">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files
                      if (!files || files.length === 0) return
                      setUploading(true)
                      const supabase = createClient()
                      if (!supabase) { setUploading(false); return }
                      const newImages = [...images]
                      for (const file of Array.from(files)) {
                        const ext = file.name.split('.').pop() || 'jpg'
                        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
                        const { error: upErr } = await supabase.storage
                          .from('product-images')
                          .upload(path, file, { cacheControl: '3600', upsert: false })
                        if (!upErr) {
                          newImages.push({ path, is_primary: newImages.length === 0 })
                        }
                      }
                      setImages(newImages)
                      setUploading(false)
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-[var(--color-text-tertiary)]">JPG, PNG, WebP, or AVIF. Max 5 MB each. Click the star to set primary.</p>
            </div>

            {/* Specs */}
            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5 space-y-4">
              <h2 className="font-semibold text-sm">Specifications</h2>
              {specs.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={spec.key}
                    onChange={(e) => { const s = [...specs]; s[i].key = e.target.value; setSpecs(s) }}
                    placeholder="Key (e.g. Display)"
                    className="admin-input flex-1"
                  />
                  <input
                    value={spec.value}
                    onChange={(e) => { const s = [...specs]; s[i].value = e.target.value; setSpecs(s) }}
                    placeholder="Value (e.g. 6.7-inch OLED)"
                    className="admin-input flex-1"
                  />
                  {specs.length > 1 && (
                    <button type="button" onClick={() => setSpecs(specs.filter((_, j) => j !== i))} className="p-2 text-[var(--color-text-tertiary)] hover:text-red-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSpecs([...specs, { key: '', value: '' }])}
                className="text-sm text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add spec
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5 space-y-4">
              <h2 className="font-semibold text-sm">Organization</h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select name="category_id" className="admin-input">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Brand</label>
                <select name="brand_id" className="admin-input">
                  <option value="">Select brand</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Tags</label>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                    placeholder="Add tag"
                    className="admin-input flex-1"
                  />
                  <button type="button" onClick={addTag} className="px-3 py-2 bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-surface)] transition-colors">
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-bg-alt)] rounded text-xs">
                        {tag}
                        <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="text-[var(--color-text-tertiary)] hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 p-5 space-y-4">
              <h2 className="font-semibold text-sm">Status</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_active" defaultChecked className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]" />
                <span className="text-sm">Active (visible on store)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_featured" className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]" />
                <span className="text-sm">Featured product</span>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        .admin-input {
          width: 100%;
          padding: 0.625rem 0.75rem;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .admin-input:focus {
          border-color: var(--color-accent);
        }
      `}</style>
    </div>
  )
}
