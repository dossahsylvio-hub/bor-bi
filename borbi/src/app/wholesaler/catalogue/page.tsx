'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Package, Plus, Search, Edit2, Trash2, Star, Globe, X, Save, AlertTriangle } from 'lucide-react';

interface WholesalerProduct {
  id: string;
  productName: string;
  category: string;
  unit: string;
  conditioning: string;
  priceCents: number;
  originalPrice?: number;
  currency: string;
  stock: number;
  featured: boolean;
  imageUrl: string;
  brand?: string;
}

interface ProductFormData {
  productName: string;
  category: string;
  unit: string;
  conditioning: string;
  priceCents: number;
  currency: string;
  stock: number;
  featured: boolean;
}

const MOCK_PRODUCTS: WholesalerProduct[] = [
  { id: '1', productName: 'Riz brisé 25kg', category: 'epicerie', unit: 'sac', conditioning: 'sac 25kg', priceCents: 1500000, currency: 'XOF', stock: 500, featured: true, imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Riz+25kg', brand: 'Marque Sénégal' },
  { id: '2', productName: 'Huile végétale 5L', category: 'epicerie', unit: 'bidon', conditioning: 'carton 6 bidons', priceCents: 600000, currency: 'XOF', stock: 200, featured: false, imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Huile+5L', brand: 'Jumbo' },
  { id: '3', productName: 'Sardines en boîte', category: 'epicerie', unit: 'boîte', conditioning: 'carton 24', priceCents: 100000, originalPrice: 150, currency: 'EUR', stock: 1000, featured: true, imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Sardines', brand: 'Saupiquet' },
  { id: '4', productName: 'Sucre en poudre 1kg', category: 'epicerie', unit: 'kg', conditioning: 'sac 50kg', priceCents: 80000, currency: 'XOF', stock: 300, featured: false, imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Sucre', brand: 'Sucrerie Sénégal' },
  { id: '5', productName: 'Lait Nido 400g', category: 'boissons', unit: 'boîte', conditioning: 'carton 12', priceCents: 350000, currency: 'XOF', stock: 150, featured: false, imageUrl: 'https://placehold.co/150x150/06b6d4/white?text=Lait+Nido', brand: 'Nestlé' },
  { id: '6', productName: 'Chemise homme coton', category: 'pretAPorter', unit: 'pièce', conditioning: 'carton 12', priceCents: 450000, currency: 'XOF', stock: 80, featured: true, imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Chemise', brand: 'Dakar Mode' },
  { id: '7', productName: 'Tissu wax africain 6m', category: 'vetements', unit: 'pièce', conditioning: 'rouleau 10 pièces', priceCents: 1200000, currency: 'XOF', stock: 50, featured: false, imageUrl: 'https://placehold.co/150x150/f97316/white?text=Wax', brand: 'Vlisco' },
];

const CATEGORY_LABELS: Record<string, string> = {
  epicerie: 'Épicerie',
  boissons: 'Boissons',
  fraisProteines: 'Frais & Protéines',
  fruitsLegumes: 'Fruits & Légumes',
  hygiene: 'Hygiène',
  energieTech: 'Énergie & Tech',
  quincaillerie: 'Quincaillerie',
  ustensilesCuisine: 'Ustensiles',
  materiaux: 'Matériaux',
  mobilier: 'Mobilier',
  boulangerie: 'Boulangerie',
  pretAPorter: 'Prêt-à-porter',
  vetements: 'Vêtements',
  electronique: 'Électronique',
};

const CURRENCIES = ['XOF', 'EUR', 'USD', 'GBP', 'MAD', 'CNY'];

const EMPTY_FORM: ProductFormData = {
  productName: '',
  category: 'epicerie',
  unit: 'pièce',
  conditioning: '',
  priceCents: 0,
  currency: 'XOF',
  stock: 0,
  featured: false,
};

export default function WholesalerCataloguePage() {
  const [products, setProducts] = useState<WholesalerProduct[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<WholesalerProduct | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = products.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase()) ||
    CATEGORY_LABELS[p.category]?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const handleOpenEdit = (p: WholesalerProduct) => {
    setEditProduct(p);
    setForm({
      productName: p.productName,
      category: p.category,
      unit: p.unit,
      conditioning: p.conditioning,
      priceCents: p.priceCents,
      currency: p.currency,
      stock: p.stock,
      featured: p.featured,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.productName || !form.conditioning || form.priceCents <= 0) return;
    setSaving(true);

    try {
      const imageUrl = `https://placehold.co/150x150/8b5cf6/white?text=${encodeURIComponent(form.productName.substring(0, 10))}`;

      if (editProduct) {
        setProducts(prev => prev.map(p =>
          p.id === editProduct.id ? { ...p, ...form, imageUrl } : p
        ));
      } else {
        const newProduct: WholesalerProduct = {
          id: `wp-${Date.now()}`,
          ...form,
          imageUrl,
        };
        setProducts(prev => [...prev, newProduct]);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = (id: string) => {
    if (confirm('Supprimer ce produit du catalogue ?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleToggleFeatured = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  return (
    <AppLayout pageTitle="Catalogue Grossiste" pageSubtitle="Gérez vos produits et tarifs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900">Mon Catalogue</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">{products.length} produits · {products.filter(p => p.featured).length} mis en avant</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-800 text-white text-[13px] font-semibold hover:bg-primary-700 transition-all active:scale-95 shadow-sm"
        >
          <Plus size={15} />
          Ajouter un produit
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="relative">
              <img
                src={p.imageUrl}
                alt={p.productName}
                width={150}
                height={150}
                className="w-full h-[150px] object-cover bg-gray-50"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/150x150/6b7280/white?text=${encodeURIComponent(p.productName.substring(0, 8))}`;
                }}
              />
              {p.featured && (
                <span className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Star size={9} fill="currentColor" /> Mis en avant
                </span>
              )}
              {p.stock < 10 && (
                <span className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <AlertTriangle size={9} /> Stock bas
                </span>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-[13px] font-semibold text-gray-900 leading-tight">{p.productName}</p>
                  {p.brand && (
                    <p className="text-[11px] text-primary-700 font-medium mt-0.5">{p.brand}</p>
                  )}
                  <p className="text-[11px] text-gray-500 mt-0.5">{CATEGORY_LABELS[p.category]} · {p.conditioning}</p>
                </div>
                <span className="flex items-center gap-0.5 text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200 flex-shrink-0">
                  <Globe size={10} />
                  {p.currency}
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-[15px] font-bold text-primary-800">
                  {(p.priceCents / 100).toLocaleString('fr-FR')} {p.currency}
                </p>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  Stock: {p.stock}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleFeatured(p.id)}
                  className={`flex-1 py-1.5 rounded-lg text-[12px] font-medium transition-all ${p.featured ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {p.featured ? '⭐ En avant' : '☆ Mettre en avant'}
                </button>
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 text-gray-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleRemove(p.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Package size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-[14px]">Aucun produit trouvé</p>
          <button onClick={handleOpenAdd} className="mt-3 text-primary-700 text-[13px] font-medium hover:underline">
            Ajouter votre premier produit
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-[16px] font-bold text-gray-900">
                {editProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Nom du produit *</label>
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => setForm(f => ({ ...f, productName: e.target.value }))}
                  placeholder="Ex: Riz brisé 25kg"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200 bg-white"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Unité</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))}
                    placeholder="sac, bidon, pièce..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Conditionnement *</label>
                <input
                  type="text"
                  value={form.conditioning}
                  onChange={(e) => setForm(f => ({ ...f, conditioning: e.target.value }))}
                  placeholder="Ex: carton 24 boîtes, sac 25kg..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Prix (centimes) *</label>
                  <input
                    type="number"
                    value={form.priceCents || ''}
                    onChange={(e) => setForm(f => ({ ...f, priceCents: parseInt(e.target.value) || 0 }))}
                    placeholder="Ex: 1500000"
                    min={0}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  {form.priceCents > 0 && (
                    <p className="text-[10px] text-gray-500 mt-0.5">= {(form.priceCents / 100).toLocaleString('fr-FR')} {form.currency}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">Devise</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200 bg-white"
                  >
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Stock disponible</label>
                <input
                  type="number"
                  value={form.stock || ''}
                  onChange={(e) => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))}
                  min={0}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 rounded accent-primary-700"
                />
                <span className="text-[13px] text-gray-700">Mettre en avant sur la vitrine</span>
              </label>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.productName || !form.conditioning || form.priceCents <= 0}
                className="flex-1 py-2.5 bg-primary-800 text-white rounded-lg text-[13px] font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={14} />
                {saving ? 'Enregistrement...' : editProduct ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
