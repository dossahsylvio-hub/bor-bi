'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  Package,
  Star,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';


interface VendorProduct {
  id: string;
  productName: string;
  productNameWolof: string;
  brand?: string;
  category: string;
  productType: 'default' | 'custom';
  unit: string;
  priceCents: number;
  stock: number;
  lowStockAlert: number;
  lastMovement: string;
  lastMovementType: 'sale' | 'restock' | 'adjustment';
  sponsored: boolean;
}

const mockProducts: VendorProduct[] = [
  { id: 'vp-001', productName: 'Riz brisé Thaïlande 50kg', productNameWolof: 'Ceeb bu wekk', brand: 'Marque Sénégal', category: 'Épicerie', productType: 'default', unit: 'sac', priceCents: 2500000, stock: 2, lowStockAlert: 10, lastMovement: 'Il y a 1h', lastMovementType: 'sale', sponsored: true },
  { id: 'vp-002', productName: 'Huile végétale 5L', productNameWolof: 'Dëkk bu tuuti', brand: 'Jumbo', category: 'Épicerie', productType: 'default', unit: 'bidon', priceCents: 650000, stock: 3, lowStockAlert: 8, lastMovement: 'Il y a 2h', lastMovementType: 'sale', sponsored: false },
  { id: 'vp-003', productName: 'Poulet PAC entier 1.5kg', productNameWolof: 'Ginaar bu dëkk', brand: 'Avicole Sénégal', category: 'Frais & Protéines', productType: 'default', unit: 'pièce', priceCents: 350000, stock: 4, lowStockAlert: 10, lastMovement: 'Hier', lastMovementType: 'restock', sponsored: false },
  { id: 'vp-004', productName: 'Thiof frais', productNameWolof: 'Thiof bu dëkk', brand: 'Pêcherie Dakar', category: 'Frais & Protéines', productType: 'default', unit: 'kg', priceCents: 450000, stock: 8, lowStockAlert: 5, lastMovement: 'Il y a 3h', lastMovementType: 'sale', sponsored: false },
  { id: 'vp-005', productName: 'Tomates fraîches', productNameWolof: 'Tomati', brand: 'Maraîchers Locaux', category: 'Fruits & Légumes', productType: 'default', unit: 'kg', priceCents: 80000, stock: 3, lowStockAlert: 15, lastMovement: 'Aujourd\'hui', lastMovementType: 'restock', sponsored: false },
  { id: 'vp-006', productName: 'Banane douce', productNameWolof: 'Banana bu nëkk', brand: 'Vergers du Sénégal', category: 'Fruits & Légumes', productType: 'default', unit: 'régime', priceCents: 120000, stock: 12, lowStockAlert: 5, lastMovement: 'Il y a 4h', lastMovementType: 'sale', sponsored: false },
  { id: 'vp-007', productName: 'Sardines fraîches', productNameWolof: 'Yeet', brand: 'Pêche Atlantique', category: 'Frais & Protéines', productType: 'default', unit: 'kg', priceCents: 120000, stock: 1, lowStockAlert: 5, lastMovement: 'Il y a 30min', lastMovementType: 'sale', sponsored: false },
  { id: 'vp-008', productName: 'Lait concentré Nestlé x48', productNameWolof: 'Meew', brand: 'Nestlé', category: 'Épicerie', productType: 'default', unit: 'carton', priceCents: 2800000, stock: 18, lowStockAlert: 3, lastMovement: 'Hier', lastMovementType: 'restock', sponsored: true },
  { id: 'vp-009', productName: 'Savon Omo 1kg', productNameWolof: 'Saawu', brand: 'Omo', category: 'Hygiène & Bazar', productType: 'default', unit: 'paquet', priceCents: 185000, stock: 4, lowStockAlert: 12, lastMovement: 'Il y a 6h', lastMovementType: 'sale', sponsored: false },
  { id: 'vp-010', productName: 'Gaz butane 6kg', productNameWolof: 'Gaz', brand: 'TechPower', category: 'Énergie & Tech', productType: 'default', unit: 'bouteille', priceCents: 450000, stock: 1, lowStockAlert: 4, lastMovement: 'Hier', lastMovementType: 'sale', sponsored: false },
  { id: 'vp-011', productName: 'Mangue Kent', productNameWolof: 'Maango', brand: 'Vergers du Sénégal', category: 'Fruits & Légumes', productType: 'default', unit: 'kg', priceCents: 95000, stock: 25, lowStockAlert: 10, lastMovement: 'Il y a 2h', lastMovementType: 'sale', sponsored: false },
  { id: 'vp-012', productName: 'Ataya Gunpowder 500g', productNameWolof: 'Attaya', brand: 'Lipton', category: 'Boissons', productType: 'custom', unit: 'boîte', priceCents: 320000, stock: 30, lowStockAlert: 5, lastMovement: 'Hier', lastMovementType: 'restock', sponsored: false },
  { id: 'vp-013', productName: 'Ciment Portland 50kg', productNameWolof: 'Siman', brand: 'Sococim', category: 'Matériaux', productType: 'custom', unit: 'sac', priceCents: 480000, stock: 45, lowStockAlert: 10, lastMovement: 'Il y a 1j', lastMovementType: 'restock', sponsored: false },
  { id: 'vp-014', productName: 'Marmite aluminium 20L', productNameWolof: 'Marmit', brand: 'Cuisine Pro', category: 'Ustensiles', productType: 'custom', unit: 'pièce', priceCents: 1200000, stock: 7, lowStockAlert: 3, lastMovement: 'Il y a 2j', lastMovementType: 'sale', sponsored: false },
  { id: 'vp-015', productName: 'Oignons violets', productNameWolof: 'Soble', brand: 'Maraîchers Locaux', category: 'Fruits & Légumes', productType: 'default', unit: 'kg', priceCents: 55000, stock: 40, lowStockAlert: 20, lastMovement: 'Aujourd\'hui', lastMovementType: 'restock', sponsored: false },
];

const CATEGORIES = ['Toutes', 'Épicerie', 'Frais & Protéines', 'Fruits & Légumes', 'Boissons', 'Hygiène & Bazar', 'Énergie & Tech', 'Matériaux', 'Ustensiles', 'Quincaillerie', 'Mobilier', 'Boulangerie'];

const categoryColors: Record<string, string> = {
  'Épicerie': 'bg-blue-50 text-blue-700 border-blue-200',
  'Frais & Protéines': 'bg-orange-50 text-orange-700 border-orange-200',
  'Fruits & Légumes': 'bg-green-50 text-green-700 border-green-200',
  'Boissons': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Hygiène & Bazar': 'bg-purple-50 text-purple-700 border-purple-200',
  'Énergie & Tech': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Matériaux': 'bg-stone-50 text-stone-700 border-stone-200',
  'Ustensiles': 'bg-pink-50 text-pink-700 border-pink-200',
  'Quincaillerie': 'bg-gray-50 text-gray-700 border-gray-200',
  'Mobilier': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Boulangerie': 'bg-amber-50 text-amber-700 border-amber-200',
};

function getProductImageUrl(productName: string, category: string): string {
  const colorMap: Record<string, string> = {
    'Épicerie': '8b5cf6/white',
    'Frais & Protéines': 'ef4444/white',
    'Fruits & Légumes': '10b981/white',
    'Boissons': '06b6d4/white',
    'Hygiène & Bazar': 'ec4899/white',
    'Énergie & Tech': 'f59e0b/white',
    'Matériaux': '78716c/white',
    'Ustensiles': 'f97316/white',
    'Quincaillerie': '6b7280/white',
    'Mobilier': '6366f1/white',
    'Boulangerie': 'f59e0b/white',
  };
  const color = colorMap[category] || '6b7280/white';
  const text = encodeURIComponent(productName.substring(0, 12).replace(/\s+/g, '+'));
  return `https://placehold.co/150x150/${color}?text=${text}`;
}

type SortKey = 'productName' | 'category' | 'stock' | 'priceCents';
type SortDir = 'asc' | 'desc' | null;

interface SortState {
  key: SortKey | null;
  dir: SortDir;
}

interface StockTableProps {
  searchQuery: string;
  selectedCategory: string;
  onEditProduct: (product: VendorProduct) => void;
  onViewMovements: (product: VendorProduct) => void;
}

export default function StockTable({ searchQuery, selectedCategory, onEditProduct, onViewMovements }: StockTableProps) {
  const [sort, setSort] = useState<SortState>({ key: null, dir: null });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return { key: null, dir: null };
    });
  };

  const filtered = useMemo(() => {
    let data = [...mockProducts];
    if (selectedCategory !== 'Toutes') {
      data = data.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.productNameWolof.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (sort.key && sort.dir) {
      data.sort((a, b) => {
        const va = a[sort.key!];
        const vb = b[sort.key!];
        if (typeof va === 'number' && typeof vb === 'number') {
          return sort.dir === 'asc' ? va - vb : vb - va;
        }
        return sort.dir === 'asc'
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      });
    }
    // Sponsored products first
    data.sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0));
    return data;
  }, [searchQuery, selectedCategory, sort]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === filtered.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filtered.map((p) => p.id)));
    }
  };

  const handleDelete = (product: VendorProduct) => {
    setDeletingId(product.id);
    // Backend integration: DELETE /api/vendor/products/:id
    setTimeout(() => {
      setDeletingId(null);
      toast.success(`"${product.productName}" retiré du catalogue`);
    }, 800);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sort.key !== col) return <ArrowUpDown size={12} className="text-gray-300" />;
    if (sort.dir === 'asc') return <ArrowUp size={12} className="text-primary-800" />;
    return <ArrowDown size={12} className="text-primary-800" />;
  };

  const getStockStatus = (product: VendorProduct) => {
    if (product.stock === 0) return { label: 'Rupture', className: 'bg-red-50 text-danger border border-red-200' };
    if (product.stock <= product.lowStockAlert) return { label: 'Alerte', className: 'bg-amber-50 text-warning border border-amber-200' };
    return { label: 'OK', className: 'bg-emerald-50 text-success border border-emerald-200' };
  };

  const movementIcon = (type: string) => {
    if (type === 'restock') return <ArrowUp size={11} className="text-success" />;
    if (type === 'sale') return <ArrowDown size={11} className="text-danger" />;
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
      {/* Bulk action bar */}
      {selectedRows.size > 0 && (
        <div className="bg-primary-800 text-white px-5 py-2.5 flex items-center gap-4 animate-slide-up">
          <span className="text-[13px] font-semibold">{selectedRows.size} produit(s) sélectionné(s)</span>
          <button
            onClick={() => {
              toast.success(`${selectedRows.size} produits retirés du catalogue`);
              setSelectedRows(new Set());
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[12px] font-semibold transition-colors"
          >
            <Trash2 size={13} />
            Retirer
          </button>
          <button
            onClick={() => setSelectedRows(new Set())}
            className="ml-auto text-[12px] text-white/70 hover:text-white transition-colors"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="w-3.5 h-3.5 rounded border-gray-300 accent-primary-800 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('productName')}
                  className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Produit <SortIcon col="productName" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Catégorie <SortIcon col="category" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Type</span>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('priceCents')}
                  className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition-colors ml-auto"
                >
                  Prix (FCFA) <SortIcon col="priceCents" />
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <button
                  onClick={() => handleSort('stock')}
                  className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition-colors mx-auto"
                >
                  Stock <SortIcon col="stock" />
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Seuil</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Statut</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Dernier mouvement</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Package size={32} className="text-gray-300" />
                    <p className="text-[14px] font-semibold text-gray-500">Aucun produit trouvé</p>
                    <p className="text-[12px] text-gray-400">Modifiez votre recherche ou ajoutez un produit au catalogue</p>
                  </div>
                </td>
              </tr>
            )}
            {filtered.map((product, index) => {
              const stockStatus = getStockStatus(product);
              const isSelected = selectedRows.has(product.id);
              const isDeleting = deletingId === product.id;
              return (
                <tr
                  key={`stock-row-${product.id}`}
                  className={`
                    border-b border-gray-50 transition-all duration-150 group
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                    ${isSelected ? 'bg-primary-50/60' : 'hover:bg-blue-50/30'}
                    ${isDeleting ? 'opacity-40' : ''}
                  `}
                >
                  <td className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(product.id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 accent-primary-800 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {product.sponsored && (
                        <Star size={12} className="text-warning fill-warning flex-shrink-0" />
                      )}
                      {/* Product image */}
                      <img
                        src={getProductImageUrl(product.productName, product.category)}
                        alt={product.productName}
                        width={40}
                        height={40}
                        loading="lazy"
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/40x40/6b7280/white?text=${encodeURIComponent(product.productName.charAt(0))}`;
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-gray-900 truncate max-w-[160px]">
                          {product.productName}
                        </p>
                        {product.brand && (
                          <p className="text-[10px] text-gray-400 truncate">{product.brand}</p>
                        )}
                        <p className="text-[11px] text-gray-400 italic truncate">{product.productNameWolof}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${categoryColors[product.category] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${product.productType === 'custom' ? 'bg-violet-50 text-violet border border-violet-200' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                      {product.productType === 'custom' ? 'Personnalisé' : 'Catalogue'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[13px] font-mono font-semibold text-gray-900">
                      {(product.priceCents / 100).toLocaleString('fr-FR')}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-1">/{product.unit}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[14px] font-mono font-bold ${product.stock <= product.lowStockAlert ? 'text-danger' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[12px] font-mono text-gray-500">{product.lowStockAlert}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`flex items-center justify-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${stockStatus.className}`}>
                      {product.stock <= product.lowStockAlert
                        ? <AlertTriangle size={10} />
                        : <CheckCircle2 size={10} />
                      }
                      {stockStatus.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {movementIcon(product.lastMovementType)}
                      <span className="text-[11px] text-gray-500">{product.lastMovement}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onViewMovements(product)}
                        title="Voir l'historique des mouvements"
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-primary-800 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => onEditProduct(product)}
                        title="Modifier le prix ou le stock"
                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-success transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        title="Retirer du catalogue — cette action ne supprime pas le produit"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-danger transition-colors"
                        disabled={isDeleting}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/40">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-gray-500">Afficher</span>
          <select className="text-[12px] border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-primary-200">
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="50">50</option>
          </select>
          <span className="text-[12px] text-gray-500">sur {filtered.length} produits</span>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((page) => (
            <button
              key={`page-${page}`}
              className={`w-8 h-8 rounded-lg text-[12px] font-semibold transition-all duration-150 active:scale-95 ${page === 1 ? 'bg-primary-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {page}
            </button>
          ))}
          <span className="text-gray-400 px-1 text-[12px]">...</span>
          <button className="w-8 h-8 rounded-lg text-[12px] font-semibold text-gray-600 hover:bg-gray-100 transition-all duration-150 active:scale-95">
            8
          </button>
        </div>
      </div>
    </div>
  );
}