'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Trash2, Package, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  nameWolof: string;
  category: string;
  unit: string;
  priceCents: number;
  stock: number;
  sponsored: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const availableProducts: Product[] = [
  { id: 'prod-001', name: 'Riz brisé 50kg', nameWolof: 'Ceeb bu wekk', category: 'Épicerie', unit: 'sac', priceCents: 2500000, stock: 2, sponsored: true },
  { id: 'prod-002', name: 'Huile végétale 5L', nameWolof: 'Dëkk', category: 'Épicerie', unit: 'bidon', priceCents: 650000, stock: 3, sponsored: false },
  { id: 'prod-003', name: 'Poulet PAC entier', nameWolof: 'Ginaar', category: 'Frais', unit: 'pièce', priceCents: 350000, stock: 4, sponsored: false },
  { id: 'prod-004', name: 'Thiof frais', nameWolof: 'Thiof', category: 'Frais', unit: 'kg', priceCents: 450000, stock: 8, sponsored: false },
  { id: 'prod-005', name: 'Sardines fraîches', nameWolof: 'Yeet', category: 'Frais', unit: 'kg', priceCents: 120000, stock: 1, sponsored: false },
  { id: 'prod-006', name: 'Tomates fraîches', nameWolof: 'Tomati', category: 'Légumes', unit: 'kg', priceCents: 80000, stock: 3, sponsored: false },
  { id: 'prod-007', name: 'Oignons violets', nameWolof: 'Soble', category: 'Légumes', unit: 'kg', priceCents: 55000, stock: 40, sponsored: false },
  { id: 'prod-008', name: 'Lait concentré x48', nameWolof: 'Meew', category: 'Épicerie', unit: 'carton', priceCents: 2800000, stock: 18, sponsored: true },
  { id: 'prod-009', name: 'Pain baguette', nameWolof: 'Mburu', category: 'Boulangerie', unit: 'pièce', priceCents: 15000, stock: 30, sponsored: false },
  { id: 'prod-010', name: 'Sucre en poudre 1kg', nameWolof: 'Sukër', category: 'Épicerie', unit: 'paquet', priceCents: 120000, stock: 25, sponsored: false },
  { id: 'prod-011', name: 'Ataya Gunpowder', nameWolof: 'Attaya', category: 'Boissons', unit: 'boîte', priceCents: 320000, stock: 30, sponsored: false },
  { id: 'prod-012', name: 'Mangue Kent', nameWolof: 'Maango', category: 'Fruits', unit: 'kg', priceCents: 95000, stock: 25, sponsored: false },
];

interface ProductCartProps {
  cartItems: CartItem[];
  onCartChange: (items: CartItem[]) => void;
}

export default function ProductCart({ cartItems, onCartChange }: ProductCartProps) {
  const [productSearch, setProductSearch] = useState('');
  const [showProductList, setShowProductList] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase();
    const sorted = [...availableProducts].sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0));
    if (!q) return sorted;
    return sorted.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameWolof.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [productSearch]);

  const addToCart = (product: Product) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    if (existing) {
      onCartChange(
        cartItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      );
    } else {
      onCartChange([...cartItems, { product, quantity: 1 }]);
    }
    setShowProductList(false);
    setProductSearch('');
  };

  const updateQty = (productId: string, delta: number) => {
    onCartChange(
      cartItems
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, Math.min(item.quantity + delta, item.product.stock)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    onCartChange(cartItems.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);

  return (
    <div className="space-y-3">
      <h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wider">
        2. Articles
      </h3>

      {/* Product search */}
      <div className="relative">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={productSearch}
            onChange={(e) => { setProductSearch(e.target.value); setShowProductList(true); }}
            onFocus={() => setShowProductList(true)}
            placeholder="Ajouter un article..."
            className="w-full pl-9 pr-3 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-[13px] text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
          />
        </div>

        {showProductList && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-card-hover z-20 overflow-hidden animate-fade-in">
            <div className="max-h-60 overflow-y-auto scrollbar-thin">
              {filteredProducts.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-[12px] text-gray-500">Aucun produit trouvé</p>
                </div>
              )}
              {filteredProducts.map((product) => {
                const inCart = cartItems.find((i) => i.product.id === product.id);
                return (
                  <button
                    key={`prod-opt-${product.id}`}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package size={13} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {product.sponsored && <Star size={10} className="text-warning fill-warning flex-shrink-0" />}
                        <p className="text-[13px] font-semibold text-gray-900 truncate">{product.name}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 italic">{product.nameWolof} · Stock: {product.stock} {product.unit}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[12px] font-mono font-semibold text-gray-800">
                        {(product.priceCents / 100).toLocaleString('fr-FR')}
                      </p>
                      <p className="text-[10px] text-gray-400">FCFA/{product.unit}</p>
                    </div>
                    {inCart && (
                      <span className="w-5 h-5 rounded-full bg-primary-800 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {inCart.quantity}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => setShowProductList(false)}
                className="w-full text-center text-[11px] text-gray-400 hover:text-gray-600 py-1 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cart items */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 border-2 border-dashed border-gray-100 rounded-xl">
          <Package size={28} className="text-gray-300" />
          <p className="text-[13px] text-gray-400 font-medium">Panier vide</p>
          <p className="text-[11px] text-gray-400">Recherchez et ajoutez des articles ci-dessus</p>
        </div>
      ) : (
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div
              key={`cart-${item.product.id}`}
              className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-3 border border-gray-100 group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 truncate">{item.product.name}</p>
                <p className="text-[11px] text-gray-400 font-mono">
                  {(item.product.priceCents / 100).toLocaleString('fr-FR')} FCFA/{item.product.unit}
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => updateQty(item.product.id, -1)}
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-danger transition-all duration-150 active:scale-90"
                >
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center text-[14px] font-mono font-bold text-gray-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQty(item.product.id, +1)}
                  disabled={item.quantity >= item.product.stock}
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 hover:text-success transition-all duration-150 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Line total */}
              <div className="w-20 text-right flex-shrink-0">
                <p className="text-[13px] font-mono font-bold text-gray-900">
                  {((item.product.priceCents * item.quantity) / 100).toLocaleString('fr-FR')}
                </p>
                <p className="text-[9px] text-gray-400">FCFA</p>
              </div>

              <button
                onClick={() => removeFromCart(item.product.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-danger transition-all duration-150 flex-shrink-0"
                title="Retirer cet article"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          {/* Cart subtotal */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-primary-50 rounded-xl border border-primary-100">
            <span className="text-[13px] font-semibold text-primary-800">
              Sous-total ({cartItems.reduce((s, i) => s + i.quantity, 0)} articles)
            </span>
            <span className="text-[16px] font-mono font-bold text-primary-900">
              {(cartTotal / 100).toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>
      )}
    </div>
  );
}