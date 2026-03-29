'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, TrendingUp, Globe, Shield, Star, ArrowRight, Package, X, Plus, ShoppingCart } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

// Public homepage - no auth required
// Sponsored products loaded from API: GET /api/public/sponsored-products

interface SponsoredProductDisplay {
  id: string;
  nameFr: string;
  brand: string | null;
  imageUrl: string | null;
  category: string;
}

interface SessionUser {
  userId: string;
  role: 'ADMIN' | 'VENDOR' | 'WHOLESALER';
  email: string;
  vendorId?: string;
  wholesalerId?: string;
}

function getMockProducts(): SponsoredProductDisplay[] {
  return [
    { id: '1', nameFr: 'Riz brisé 25kg', brand: 'Marque Sénégal', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Riz', category: 'epicerie' },
    { id: '2', nameFr: 'Huile végétale 5L', brand: 'Jumbo', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Huile', category: 'epicerie' },
    { id: '3', nameFr: 'Poulet PAC entier', brand: 'Avicole Sénégal', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Poulet', category: 'fraisProteines' },
    { id: '4', nameFr: 'Thiof frais', brand: 'Pêcherie Dakar', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Thiof', category: 'fraisProteines' },
    { id: '5', nameFr: 'Mangue', brand: 'Vergers du Sénégal', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Mangue', category: 'fruitsLegumes' },
    { id: '6', nameFr: 'Tomate fraîche', brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Tomate', category: 'fruitsLegumes' },
    { id: '7', nameFr: 'Coca-Cola 1.5L', brand: 'Coca-Cola', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Coca', category: 'boissons' },
    { id: '8', nameFr: 'Jus de bissap', brand: 'Bissap Dakar', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Bissap', category: 'boissons' },
    { id: '9', nameFr: 'Savon de Marseille', brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Savon', category: 'hygiene' },
    { id: '10', nameFr: 'Lessive poudre 1kg', brand: 'Omo', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Lessive', category: 'hygiene' },
    { id: '11', nameFr: 'Marmite 10L', brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Marmite', category: 'ustensilesCuisine' },
    { id: '12', nameFr: 'Poêle antiadhésive', brand: 'Tefal', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Poele', category: 'ustensilesCuisine' },
    { id: '13', nameFr: 'Ciment Portland 50kg', brand: 'Sococim', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Ciment', category: 'materiaux' },
    { id: '14', nameFr: 'Fer à béton 10mm', brand: 'Acier Sénégal', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Fer', category: 'materiaux' },
    { id: '15', nameFr: 'Chaise plastique', brand: 'Mobilier Dakar', imageUrl: 'https://placehold.co/150x150/7c3aed/white?text=Chaise', category: 'mobilier' },
    { id: '16', nameFr: 'Lit simple', brand: 'Confort Home', imageUrl: 'https://placehold.co/150x150/7c3aed/white?text=Lit', category: 'mobilier' },
    { id: '17', nameFr: 'Marteau', brand: 'Stanley', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Marteau', category: 'quincaillerie' },
    { id: '18', nameFr: 'Chargeur USB universel', brand: 'TechPower', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Chargeur', category: 'energieTech' },
    { id: '19', nameFr: 'Baguette tradition', brand: 'Grand Moulin de Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Baguette', category: 'boulangerie' },
    { id: '20', nameFr: 'Sardines fraîches', brand: 'Pêche Atlantique', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Sardines', category: 'fraisProteines' },
  ];
}

const CATEGORY_LABELS: Record<string, string> = {
  boulangerie: 'Boulangerie',
  fraisProteines: 'Frais & Protéines',
  fruitsLegumes: 'Fruits & Légumes',
  epicerie: 'Épicerie',
  boissons: 'Boissons',
  hygiene: 'Hygiène',
  energieTech: 'Énergie & Tech',
  quincaillerie: 'Quincaillerie',
  ustensilesCuisine: 'Ustensiles',
  materiaux: 'Matériaux',
  mobilier: 'Mobilier',
  pretAPorter: 'Prêt-à-porter',
  vetements: 'Vêtements',
  detaillant: 'Détaillant',
};

// Vendor modal for adding product to stock or sale
function VendorProductModal({ product, onClose }: { product: SponsoredProductDisplay; onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold text-gray-900">Ajouter le produit</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
          {product.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.nameFr}
              width={60}
              height={60}
              className="w-[60px] h-[60px] rounded-lg object-cover"
            />
          )}
          <div>
            <p className="text-[14px] font-semibold text-gray-900">{product.nameFr}</p>
            {product.brand && <p className="text-[12px] text-gray-500">{product.brand}</p>}
            <span className="text-[11px] text-primary-700 font-medium">{CATEGORY_LABELS[product.category] || product.category}</span>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => { router.push('/stock-management'); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-primary-800 text-white rounded-xl font-semibold text-[14px] hover:bg-primary-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            Ajouter à mon stock
          </button>
          <button
            onClick={() => { router.push('/new-sale'); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-success text-white rounded-xl font-semibold text-[14px] hover:bg-emerald-600 transition-all active:scale-95"
          >
            <ShoppingCart size={18} />
            Ajouter à une vente
          </button>
        </div>
        <button onClick={onClose} className="w-full mt-3 text-[13px] text-gray-500 hover:text-gray-700 transition-colors">
          Annuler
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<SponsoredProductDisplay[]>([]);
  const [session, setSession] = useState<SessionUser | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SponsoredProductDisplay | null>(null);

  useEffect(() => {
    // Load products
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    fetch(`${baseUrl}/api/public/sponsored-products`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setProducts(data && data.length > 0 ? data : getMockProducts()))
      .catch(() => setProducts(getMockProducts()));

    // Check session from cookie
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { setSession(data); setSessionLoaded(true); })
      .catch(() => setSessionLoaded(true));
  }, []);

  const handleProductClick = (product: SponsoredProductDisplay) => {
    if (!session) {
      // Not logged in → register
      router.push('/register');
      return;
    }
    if (session.role === 'VENDOR') {
      // Show modal to add to stock or sale
      setSelectedProduct(product);
    } else if (session.role === 'WHOLESALER') {
      // Redirect to wholesaler catalogue
      router.push('/wholesaler/catalogue');
    } else if (session.role === 'ADMIN') {
      // Redirect to admin portal vitrine tab
      router.push('/admin-portal?tab=vitrine');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Vendor modal */}
      {selectedProduct && (
        <VendorProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Header */}
      <header className="bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ShoppingBag size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Bor-Bi</h1>
              <p className="text-primary-200 text-xs">par TransTech Solution</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            {session ? (
              <Link
                href={session.role === 'ADMIN' ? '/admin-portal' : session.role === 'WHOLESALER' ? '/wholesaler/dashboard' : '/dashboard'}
                className="flex items-center gap-1.5 px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-all active:scale-95"
              >
                <ArrowRight size={14} />
                Mon espace
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-primary-200 hover:text-white transition-colors">
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-all active:scale-95"
                >
                  <ArrowRight size={14} />
                  Commencer
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Star size={14} className="text-yellow-400" />
            Gratuit pour tous les vendeurs et grossistes
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            La plateforme de gestion pour commerçants en Afrique et dans le monde
          </h2>
          <p className="text-primary-200 text-lg mb-8 max-w-2xl mx-auto">
            Gérez vos ventes, stocks et créances en FCFA. Connectez-vous avec des grossistes du monde entier. En français, wolof, arabe, anglais et mandarin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-success text-white rounded-xl font-bold text-base hover:bg-emerald-600 transition-all active:scale-95 shadow-lg"
            >
              <ArrowRight size={18} />
              Créer mon compte gratuitement
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-base hover:bg-white/20 transition-all border border-white/20"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">Pourquoi choisir Bor-Bi ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <TrendingUp size={24} className="text-success" />, title: 'Gestion des ventes', desc: 'Enregistrez chaque vente, gérez les créances et suivez vos revenus en temps réel.' },
              { icon: <Package size={24} className="text-primary-600" />, title: 'Gestion du stock', desc: 'Alertes de stock bas, historique des mouvements, catalogue de 500+ produits.' },
              { icon: <Globe size={24} className="text-violet" />, title: 'Grossistes mondiaux', desc: 'Connectez-vous avec des grossistes de Guinée, Maroc, Europe, Amérique et plus.' },
              { icon: <Shield size={24} className="text-danger" />, title: 'Sécurisé & conforme', desc: "Données chiffrées, conformité OHADA, droit à l'oubli, consentement RGPD." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{f.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsored Products Grid */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Produits à la une</h3>
              <p className="text-gray-500 text-sm mt-1">
                {session
                  ? 'Cliquez sur un produit pour l\'ajouter à votre catalogue' :'Inscrivez-vous pour accéder à tous les produits'}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full">
              ⭐ Sponsorisé
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="group bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all overflow-hidden text-left cursor-pointer"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={`${product.nameFr} - ${product.brand || 'Bor-Bi'}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width={150}
                      height={150}
                      loading="lazy"
                    />
                  ) : (
                    <Package size={32} className="text-gray-300" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 truncate">{product.nameFr}</p>
                  {product.brand && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{product.brand}</p>
                  )}
                  <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full">
                    {CATEGORY_LABELS[product.category] || product.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-800 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all active:scale-95"
            >
              <ArrowRight size={16} />
              Voir tout le catalogue — Inscription gratuite
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-primary-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Prêt à gérer votre commerce ?</h3>
          <p className="text-primary-200 mb-8">Rejoignez des milliers de vendeurs et grossistes qui font confiance à Bor-Bi.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-success text-white rounded-xl font-bold text-base hover:bg-emerald-600 transition-all active:scale-95"
          >
            <ArrowRight size={18} />
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary-400" />
            <span className="text-sm font-medium text-white">Bor-Bi par TransTech Solution</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms.html" className="text-sm hover:text-white transition-colors">CGU</Link>
            <Link href="/privacy.html" className="text-sm hover:text-white transition-colors">Confidentialité</Link>
            <Link href="/legal.html" className="text-sm hover:text-white transition-colors">Mentions légales</Link>
          </div>
          <p className="text-xs">© 2026 TransTech Solution. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
