'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Search, Package, Plus, Loader2, AlertTriangle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface AddProductModalProps {
  onClose: () => void;
}

const defaultProductsCatalog = [
  { id: 'dp-001', nameFr: 'Riz brisé Thaïlande 50kg', nameWolof: 'Ceeb bu wekk', category: 'Épicerie', unit: 'sac', defaultPrice: 2500000 },
  { id: 'dp-002', nameFr: 'Huile végétale Lesieur 5L', nameWolof: 'Dëkk', category: 'Épicerie', unit: 'bidon', defaultPrice: 650000 },
  { id: 'dp-003', nameFr: 'Poulet PAC entier', nameWolof: 'Ginaar', category: 'Frais & Protéines', unit: 'pièce', defaultPrice: 350000 },
  { id: 'dp-004', nameFr: 'Thiof frais', nameWolof: 'Thiof', category: 'Frais & Protéines', unit: 'kg', defaultPrice: 450000 },
  { id: 'dp-005', nameFr: 'Sardines fraîches', nameWolof: 'Yeet', category: 'Frais & Protéines', unit: 'kg', defaultPrice: 120000 },
  { id: 'dp-006', nameFr: 'Mangue Kent', nameWolof: 'Maango', category: 'Fruits & Légumes', unit: 'kg', defaultPrice: 95000 },
  { id: 'dp-007', nameFr: 'Banane douce', nameWolof: 'Banana', category: 'Fruits & Légumes', unit: 'régime', defaultPrice: 120000 },
  { id: 'dp-008', nameFr: 'Oignons violets', nameWolof: 'Soble', category: 'Fruits & Légumes', unit: 'kg', defaultPrice: 55000 },
  { id: 'dp-009', nameFr: 'Lait concentré Nestlé x48', nameWolof: 'Meew', category: 'Épicerie', unit: 'carton', defaultPrice: 2800000 },
  { id: 'dp-010', nameFr: 'Ciment Portland 50kg', nameWolof: 'Siman', category: 'Matériaux', unit: 'sac', defaultPrice: 480000 },
];

type Step = 'choose' | 'catalogue' | 'custom';

interface CustomForm {
  name: string;
  nameWolof: string;
  category: string;
  unit: string;
  priceCents: number;
  stock: number;
  lowStockAlert: number;
}

export default function AddProductModal({ onClose }: AddProductModalProps) {
  const [step, setStep] = useState<Step>('choose');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalogProduct, setSelectedCatalogProduct] = useState<typeof defaultProductsCatalog[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomForm>();

  const filteredCatalog = defaultProductsCatalog.filter((p) =>
    p.nameFr.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const handleAddFromCatalogue = async () => {
    if (!selectedCatalogProduct) return;
    setIsLoading(true);
    // Backend integration: POST /api/vendor/products
    // Body: { productId: selectedCatalogProduct.id, productType: 'DefaultProduct', price: selectedCatalogProduct.defaultPrice, stock: 0 }
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    toast.success(`"${selectedCatalogProduct.nameFr}" ajouté au catalogue`);
    onClose();
  };

  const onCustomSubmit = async (data: CustomForm) => {
    setIsLoading(true);
    // Backend integration: POST /api/vendor/custom-products
    // Body: { name: data.name, nameWolof: data.nameWolof, unit: data.unit, price: data.priceCents * 100, stock: data.stock }
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    toast.success(`"${data.name}" créé et ajouté au catalogue`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">
              {step === 'choose' && 'Ajouter un produit'}
              {step === 'catalogue' && 'Choisir dans le catalogue'}
              {step === 'custom' && 'Créer un produit personnalisé'}
            </h2>
            {step !== 'choose' && (
              <button
                onClick={() => setStep('choose')}
                className="text-[11px] text-primary-800 hover:text-primary-600 mt-0.5 transition-colors"
              >
                ← Retour
              </button>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {/* Step 1: Choose method */}
          {step === 'choose' && (
            <div className="space-y-3">
              <button
                onClick={() => setStep('catalogue')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-150 group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                  <Package size={20} className="text-primary-800" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-900">Choisir dans le catalogue</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">500+ produits prédéfinis avec noms en français et wolof</p>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-primary-800 transition-colors" />
              </button>

              <button
                onClick={() => setStep('custom')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-violet-300 hover:bg-violet-50/30 transition-all duration-150 group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-100 transition-colors">
                  <Plus size={20} className="text-violet" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-900">Créer un produit personnalisé</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">Définissez votre propre produit avec toutes ses informations</p>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-violet transition-colors" />
              </button>
            </div>
          )}

          {/* Step 2: Catalogue */}
          {step === 'catalogue' && (
            <div className="space-y-4">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div className="space-y-1.5 max-h-[340px] overflow-y-auto scrollbar-thin">
                {filteredCatalog.map((product) => (
                  <button
                    key={`catalog-${product.id}`}
                    onClick={() => setSelectedCatalogProduct(
                      selectedCatalogProduct?.id === product.id ? null : product
                    )}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 text-left ${selectedCatalogProduct?.id === product.id
                      ? 'border-primary-400 bg-primary-50 shadow-sm'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package size={14} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900 truncate">{product.nameFr}</p>
                      <p className="text-[11px] text-gray-400 italic">{product.nameWolof} · {product.category}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[12px] font-mono font-semibold text-gray-700">
                        {(product.defaultPrice / 100).toLocaleString('fr-FR')} FCFA
                      </p>
                      <p className="text-[10px] text-gray-400">/{product.unit}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleAddFromCatalogue}
                disabled={!selectedCatalogProduct || isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-800 text-white text-[13px] font-semibold hover:bg-primary-700 transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    <Plus size={15} />
                    Ajouter au catalogue
                    {selectedCatalogProduct && ` — ${selectedCatalogProduct.nameFr}`}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Custom product */}
          {step === 'custom' && (
            <form onSubmit={handleSubmit(onCustomSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Nom du produit (Français)</label>
                  <input
                    {...register('name', { required: 'Le nom est obligatoire' })}
                    placeholder="ex: Huile de palme artisanale"
                    className={`w-full px-3 py-2.5 border rounded-lg text-[13px] text-gray-900 outline-none focus:ring-2 focus:ring-primary-200 transition-all ${errors.name ? 'border-danger' : 'border-gray-200 focus:border-primary-400'}`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-danger mt-1 flex items-center gap-1"><AlertTriangle size={10} />{errors.name.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Nom en Wolof (optionnel)</label>
                  <input
                    {...register('nameWolof')}
                    placeholder="ex: Dëkk bu rafet"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] text-gray-900 outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Catégorie</label>
                  <select
                    {...register('category', { required: 'La catégorie est obligatoire' })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] text-gray-700 outline-none focus:ring-2 focus:ring-primary-200 bg-white"
                  >
                    <option value="">Choisir...</option>
                    <option value="Épicerie">Épicerie</option>
                    <option value="Frais & Protéines">Frais & Protéines</option>
                    <option value="Fruits & Légumes">Fruits & Légumes</option>
                    <option value="Boissons">Boissons</option>
                    <option value="Hygiène & Bazar">Hygiène & Bazar</option>
                    <option value="Énergie & Tech">Énergie & Tech</option>
                    <option value="Matériaux">Matériaux</option>
                    <option value="Ustensiles">Ustensiles</option>
                    <option value="Quincaillerie">Quincaillerie</option>
                    <option value="Mobilier">Mobilier</option>
                    <option value="Boulangerie">Boulangerie</option>
                  </select>
                  {errors.category && (
                    <p className="text-[11px] text-danger mt-1 flex items-center gap-1"><AlertTriangle size={10} />{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Unité</label>
                  <input
                    {...register('unit', { required: 'L\'unité est obligatoire' })}
                    placeholder="ex: kg, sac, pièce"
                    className={`w-full px-3 py-2.5 border rounded-lg text-[13px] text-gray-900 outline-none focus:ring-2 focus:ring-primary-200 transition-all ${errors.unit ? 'border-danger' : 'border-gray-200 focus:border-primary-400'}`}
                  />
                  {errors.unit && (
                    <p className="text-[11px] text-danger mt-1 flex items-center gap-1"><AlertTriangle size={10} />{errors.unit.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Prix (FCFA)</label>
                  <input
                    type="number"
                    step="100"
                    {...register('priceCents', { required: 'Le prix est obligatoire', min: { value: 1, message: 'Prix > 0' } })}
                    className={`w-full px-3 py-2.5 border rounded-lg text-[13px] font-mono text-gray-900 outline-none focus:ring-2 focus:ring-primary-200 transition-all ${errors.priceCents ? 'border-danger' : 'border-gray-200 focus:border-primary-400'}`}
                  />
                  {errors.priceCents && (
                    <p className="text-[11px] text-danger mt-1 flex items-center gap-1"><AlertTriangle size={10} />{errors.priceCents.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Stock initial</label>
                  <input
                    type="number"
                    {...register('stock', { required: true, min: 0 })}
                    defaultValue={0}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] font-mono text-gray-900 outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Seuil d'alerte</label>
                  <input
                    type="number"
                    {...register('lowStockAlert', { required: true, min: 1 })}
                    defaultValue={5}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] font-mono text-gray-900 outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet text-white text-[13px] font-semibold hover:bg-violet-600 transition-all duration-150 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={15} className="animate-spin" /> : <><Plus size={15} />Créer le produit</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}