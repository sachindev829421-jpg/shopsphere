"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import { Category } from "@/types";
import { toast } from "sonner";

export default function AdminCategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80");
    setFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setFeatured(cat.featured);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, image, featured }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save category");
        return;
      }

      toast.success(editingCategory ? "Category updated" : "Category created");
      setModalOpen(false);

      // Refresh categories list
      const fetchRes = await fetch("/api/categories");
      const fetchData = await fetchRes.json();
      if (fetchData.categories) setCategories(fetchData.categories);
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to delete category");
        return;
      }

      toast.success("Category deleted");
      setCategories(categories.filter((c) => c.id !== id));
    } catch {
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Active Products</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-950 rounded-xl overflow-hidden relative shrink-0 border border-slate-800">
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-800" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white">{cat.name}</p>
                      {cat.description && (
                        <p className="text-[10px] text-slate-500 truncate max-w-xs">{cat.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-400">{cat.slug}</td>
                  <td className="py-4 px-4 font-bold text-white">{cat.productsCount ?? 0}</td>
                  <td className="py-4 px-4">
                    {cat.featured ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400">
                        Featured
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Creation / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? "Edit Category" : "New Category"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Footwear & Watches"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short department summary..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950 border-slate-800"
                />
                <label htmlFor="feat" className="font-semibold text-slate-300 cursor-pointer">
                  Display in Featured Homepage Carousels
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Saving..." : "Save Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
