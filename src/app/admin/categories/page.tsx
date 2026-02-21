'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FolderTree, Plus, Pencil, Trash2, Check, X, GripVertical,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: number
  parent_id: number | null
  name: string
  slug: string
  icon_svg: string | null
  sort_order: number
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editParent, setEditParent] = useState<number | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newParent, setNewParent] = useState<number | null>(null)

  const loadCategories = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .order('name')
    if (data) setCategories(data as Category[])
    setLoading(false)
  }, [])

  useEffect(() => { loadCategories() }, [loadCategories])

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleAdd = async () => {
    if (!newName.trim()) return
    const supabase = createClient()
    if (!supabase) return
    const finalSlug = newSlug.trim() || slugify(newName)
    const maxSort = categories.length > 0 ? Math.max(...categories.map((c) => c.sort_order)) : 0
    const { error } = await supabase.from('categories').insert({
      name: newName.trim(),
      slug: finalSlug,
      parent_id: newParent,
      sort_order: maxSort + 1,
    })
    if (error) {
      alert(error.message)
      return
    }
    setAddingNew(false)
    setNewName('')
    setNewSlug('')
    setNewParent(null)
    loadCategories()
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditSlug(cat.slug)
    setEditParent(cat.parent_id)
  }

  const handleUpdate = async () => {
    if (!editName.trim() || editingId === null) return
    const supabase = createClient()
    if (!supabase) return
    const { error } = await supabase
      .from('categories')
      .update({
        name: editName.trim(),
        slug: editSlug.trim() || slugify(editName),
        parent_id: editParent,
      })
      .eq('id', editingId)
    if (error) {
      alert(error.message)
      return
    }
    setEditingId(null)
    loadCategories()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category? Child categories will be unlinked.')) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('categories').delete().eq('id', id)
    loadCategories()
  }

  // Build tree structure
  const topLevel = categories.filter((c) => c.parent_id === null)
  const childrenOf = (parentId: number) => categories.filter((c) => c.parent_id === parentId)

  const renderRow = (cat: Category, depth: number) => {
    const isEditing = editingId === cat.id
    const children = childrenOf(cat.id)

    return (
      <div key={cat.id}>
        <div
          className={`flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)]/50 hover:bg-[var(--color-bg-alt)] transition-colors`}
          style={{ paddingLeft: `${20 + depth * 24}px` }}
        >
          <GripVertical className="w-4 h-4 text-[var(--color-text-tertiary)] shrink-0" />

          {isEditing ? (
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <input
                value={editName}
                onChange={(e) => { setEditName(e.target.value); setEditSlug(slugify(e.target.value)) }}
                className="px-2.5 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-sm w-48 outline-none"
                autoFocus
              />
              <input
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="px-2.5 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-sm w-40 outline-none font-mono text-xs"
                placeholder="slug"
              />
              <select
                value={editParent ?? ''}
                onChange={(e) => setEditParent(e.target.value ? Number(e.target.value) : null)}
                className="px-2.5 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-sm outline-none"
              >
                <option value="">No parent</option>
                {categories
                  .filter((c) => c.id !== cat.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
              <button onClick={handleUpdate} className="p-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-alt)] transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="ml-2 text-xs text-[var(--color-text-tertiary)] font-mono">/{cat.slug}</span>
              </div>
              <span className="text-xs text-[var(--color-text-tertiary)]">#{cat.sort_order}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(cat)}
                  className="p-1.5 rounded-lg hover:bg-[var(--color-bg-alt)] transition-colors text-[var(--color-text-secondary)]"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
        {children.map((child) => renderRow(child, depth + 1))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{categories.length} categories</p>
        </div>
        <button
          onClick={() => setAddingNew(true)}
          className="px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]/50 overflow-hidden">
        {/* Add new row */}
        {addingNew && (
          <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-[var(--color-border)]/50 bg-[var(--color-bg-alt)]">
            <input
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setNewSlug(slugify(e.target.value)) }}
              placeholder="Category name"
              className="px-2.5 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-sm w-48 outline-none"
              autoFocus
            />
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="slug"
              className="px-2.5 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-sm w-40 outline-none font-mono text-xs"
            />
            <select
              value={newParent ?? ''}
              onChange={(e) => setNewParent(e.target.value ? Number(e.target.value) : null)}
              className="px-2.5 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-sm outline-none"
            >
              <option value="">No parent (top-level)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button onClick={handleAdd} className="p-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setAddingNew(false); setNewName(''); setNewSlug(''); setNewParent(null) }}
              className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-alt)] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-sm text-[var(--color-text-tertiary)] animate-pulse">
            Loading categories…
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm text-[var(--color-text-tertiary)]">No categories yet</p>
          </div>
        ) : (
          topLevel.map((cat) => renderRow(cat, 0))
        )}
      </div>
    </div>
  )
}
