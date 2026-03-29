'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import StockTable from './components/StockTable';
import EditProductPanel from './components/EditProductPanel';
import AddProductModal from './components/AddProductModal';
import StockMovementsPanel from './components/StockMovementsPanel';
import { Search, Plus, Filter, Download, AlertTriangle } from 'lucide-react';

// Backend integration: GET /api/vendor/products?vendorId=...
// Returns: VendorProduct[] with stock levels, prices, alerts

const CATEGORIES = ['Toutes', 'Épicerie', 'Frais & Protéines', 'Fruits & Légumes', 'Boissons', 'Hygiène & Bazar', 'Énergie & Tech', 'Matériaux', 'Ustensiles', 'Quincaillerie', 'Mobilier', 'Boulangerie'];

interface ProductForPanel {
  id: string;
  productName: string;
  unit: string;
  priceCents: number;
  stock: number;
  lowStockAlert: number;
}

export default function StockManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [editingProduct, setEditingProduct] = useState<ProductForPanel | null>(null);
  const [movementsProduct, setMovementsProduct] = useState<ProductForPanel | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <AppLayout pageTitle="Gestion du Stock" pageSubtitle="Catalogue produits · Amadou Mbaye">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900">Stock & Catalogue</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">15 produits actifs · <span className="text-danger font-semibold">7 alertes de stock</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-all duration-150 active:scale-95">
            <Download size={14} />
            Exporter CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-800 text-white text-[13px] font-semibold hover:bg-primary-700 transition-all duration-150 active:scale-95 shadow-sm"
          >
            <Plus size={15} />
            Ajouter un produit
          </button>
        </div>
      </div>

      {/* Alert banner */}
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
        <AlertTriangle size={16} className="text-danger flex-shrink-0" />
        <p className="text-[13px] text-danger font-medium">
          7 produits sont sous leur seuil d'alerte. Pensez à réapprovisionner rapidement.
        </p>
        <button className="ml-auto text-[12px] font-semibold text-danger underline underline-offset-2 hover:text-red-700 transition-colors flex-shrink-0">
          Filtrer
        </button>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, wolof, catégorie..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary-200 bg-white transition-all"
          />
        </div>

        {/* Filter icon */}
        <button className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-all sm:w-auto">
          <Filter size={14} />
          Filtres
        </button>
      </div>

      {/* Category chips */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-thin pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={`cat-chip-${cat}`}
            onClick={() => setSelectedCategory(cat)}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-150 active:scale-95
              ${selectedCategory === cat
                ? 'bg-primary-800 text-white border-primary-800' :'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <StockTable
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onEditProduct={(p) => setEditingProduct(p)}
        onViewMovements={(p) => setMovementsProduct(p)}
      />

      {/* Edit panel */}
      {editingProduct && (
        <EditProductPanel
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {/* Movements panel */}
      {movementsProduct && (
        <StockMovementsPanel
          product={movementsProduct}
          onClose={() => setMovementsProduct(null)}
        />
      )}

      {/* Add product modal */}
      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} />
      )}
    </AppLayout>
  );
}