'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Building2, MapPin, ArrowRight, Loader2, Globe, Phone, Store } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import LanguageSelector from '@/components/LanguageSelector';

type Role = 'VENDOR' | 'WHOLESALER';

const BUSINESS_TYPES = [
  { value: 'epicerie', label: 'Épicerie' },
  { value: 'poissonnerie', label: 'Poissonnerie / Fruits de mer' },
  { value: 'boucherie', label: 'Boucherie / Volaille' },
  { value: 'fruitsLegumes', label: 'Fruits & Légumes' },
  { value: 'boulangerie', label: 'Boulangerie / Pâtisserie' },
  { value: 'quincaillerie', label: 'Quincaillerie / Matériaux' },
  { value: 'pretAPorter', label: 'Prêt-à-porter / Vêtements' },
  { value: 'electronique', label: 'Électronique / Tech' },
  { value: 'autre', label: 'Autre (préciser)' },
];

const CURRENCIES = [
  { code: 'XOF', label: 'FCFA (XOF)' },
  { code: 'EUR', label: 'Euro (EUR)' },
  { code: 'USD', label: 'Dollar US (USD)' },
  { code: 'GBP', label: 'Livre sterling (GBP)' },
  { code: 'MAD', label: 'Dirham marocain (MAD)' },
  { code: 'DZD', label: 'Dinar algérien (DZD)' },
  { code: 'TND', label: 'Dinar tunisien (TND)' },
  { code: 'GNF', label: 'Franc guinéen (GNF)' },
  { code: 'NGN', label: 'Naira nigérian (NGN)' },
  { code: 'GHS', label: 'Cedi ghanéen (GHS)' },
  { code: 'CNY', label: 'Yuan chinois (CNY)' },
];

// Comprehensive country list with phone codes
const COUNTRIES = [
  // Afrique de l'Ouest
  { code: '+221', flag: '🇸🇳', label: 'Sénégal', country: 'Sénégal' },
  { code: '+224', flag: '🇬🇳', label: 'Guinée', country: 'Guinée' },
  { code: '+225', flag: '🇨🇮', label: "Côte d\'Ivoire", country: "Côte d\'Ivoire" },
  { code: '+223', flag: '🇲🇱', label: 'Mali', country: 'Mali' },
  { code: '+226', flag: '🇧🇫', label: 'Burkina Faso', country: 'Burkina Faso' },
  { code: '+227', flag: '🇳🇪', label: 'Niger', country: 'Niger' },
  { code: '+228', flag: '🇹🇬', label: 'Togo', country: 'Togo' },
  { code: '+229', flag: '🇧🇯', label: 'Bénin', country: 'Bénin' },
  { code: '+234', flag: '🇳🇬', label: 'Nigeria', country: 'Nigeria' },
  { code: '+233', flag: '🇬🇭', label: 'Ghana', country: 'Ghana' },
  { code: '+220', flag: '🇬🇲', label: 'Gambie', country: 'Gambie' },
  { code: '+245', flag: '🇬🇼', label: 'Guinée-Bissau', country: 'Guinée-Bissau' },
  { code: '+232', flag: '🇸🇱', label: 'Sierra Leone', country: 'Sierra Leone' },
  { code: '+231', flag: '🇱🇷', label: 'Liberia', country: 'Liberia' },
  { code: '+222', flag: '🇲🇷', label: 'Mauritanie', country: 'Mauritanie' },
  { code: '+238', flag: '🇨🇻', label: 'Cap-Vert', country: 'Cap-Vert' },
  // Afrique Centrale
  { code: '+237', flag: '🇨🇲', label: 'Cameroun', country: 'Cameroun' },
  { code: '+236', flag: '🇨🇫', label: 'Centrafrique', country: 'Centrafrique' },
  { code: '+235', flag: '🇹🇩', label: 'Tchad', country: 'Tchad' },
  { code: '+242', flag: '🇨🇬', label: 'Congo', country: 'Congo' },
  { code: '+243', flag: '🇨🇩', label: 'RD Congo', country: 'RD Congo' },
  { code: '+241', flag: '🇬🇦', label: 'Gabon', country: 'Gabon' },
  { code: '+240', flag: '🇬🇶', label: 'Guinée Équatoriale', country: 'Guinée Équatoriale' },
  { code: '+239', flag: '🇸🇹', label: 'São Tomé', country: 'São Tomé' },
  // Afrique du Nord
  { code: '+212', flag: '🇲🇦', label: 'Maroc', country: 'Maroc' },
  { code: '+213', flag: '🇩🇿', label: 'Algérie', country: 'Algérie' },
  { code: '+216', flag: '🇹🇳', label: 'Tunisie', country: 'Tunisie' },
  { code: '+218', flag: '🇱🇾', label: 'Libye', country: 'Libye' },
  { code: '+20', flag: '🇪🇬', label: 'Égypte', country: 'Égypte' },
  { code: '+249', flag: '🇸🇩', label: 'Soudan', country: 'Soudan' },
  // Afrique de l'Est
  { code: '+254', flag: '🇰🇪', label: 'Kenya', country: 'Kenya' },
  { code: '+255', flag: '🇹🇿', label: 'Tanzanie', country: 'Tanzanie' },
  { code: '+256', flag: '🇺🇬', label: 'Ouganda', country: 'Ouganda' },
  { code: '+251', flag: '🇪🇹', label: 'Éthiopie', country: 'Éthiopie' },
  { code: '+252', flag: '🇸🇴', label: 'Somalie', country: 'Somalie' },
  { code: '+250', flag: '🇷🇼', label: 'Rwanda', country: 'Rwanda' },
  // Afrique Australe
  { code: '+27', flag: '🇿🇦', label: 'Afrique du Sud', country: 'Afrique du Sud' },
  { code: '+263', flag: '🇿🇼', label: 'Zimbabwe', country: 'Zimbabwe' },
  { code: '+260', flag: '🇿🇲', label: 'Zambie', country: 'Zambie' },
  { code: '+258', flag: '🇲🇿', label: 'Mozambique', country: 'Mozambique' },
  // Europe
  { code: '+33', flag: '🇫🇷', label: 'France', country: 'France' },
  { code: '+44', flag: '🇬🇧', label: 'Royaume-Uni', country: 'Royaume-Uni' },
  { code: '+49', flag: '🇩🇪', label: 'Allemagne', country: 'Allemagne' },
  { code: '+34', flag: '🇪🇸', label: 'Espagne', country: 'Espagne' },
  { code: '+39', flag: '🇮🇹', label: 'Italie', country: 'Italie' },
  { code: '+351', flag: '🇵🇹', label: 'Portugal', country: 'Portugal' },
  { code: '+32', flag: '🇧🇪', label: 'Belgique', country: 'Belgique' },
  { code: '+41', flag: '🇨🇭', label: 'Suisse', country: 'Suisse' },
  { code: '+31', flag: '🇳🇱', label: 'Pays-Bas', country: 'Pays-Bas' },
  // Amérique
  { code: '+1', flag: '🇺🇸', label: 'États-Unis', country: 'États-Unis' },
  { code: '+1', flag: '🇨🇦', label: 'Canada', country: 'Canada' },
  { code: '+55', flag: '🇧🇷', label: 'Brésil', country: 'Brésil' },
  { code: '+52', flag: '🇲🇽', label: 'Mexique', country: 'Mexique' },
  { code: '+57', flag: '🇨🇴', label: 'Colombie', country: 'Colombie' },
  { code: '+54', flag: '🇦🇷', label: 'Argentine', country: 'Argentine' },
  // Asie
  { code: '+86', flag: '🇨🇳', label: 'Chine', country: 'Chine' },
  { code: '+81', flag: '🇯🇵', label: 'Japon', country: 'Japon' },
  { code: '+82', flag: '🇰🇷', label: 'Corée du Sud', country: 'Corée du Sud' },
  { code: '+91', flag: '🇮🇳', label: 'Inde', country: 'Inde' },
  { code: '+966', flag: '🇸🇦', label: 'Arabie Saoudite', country: 'Arabie Saoudite' },
  { code: '+971', flag: '🇦🇪', label: 'Émirats Arabes Unis', country: 'Émirats Arabes Unis' },
  { code: '+90', flag: '🇹🇷', label: 'Turquie', country: 'Turquie' },
];

// Email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterPage() {
  const [role, setRole] = useState<Role>('VENDOR');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneCode, setPhoneCode] = useState('+221');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessTypeOther, setBusinessTypeOther] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('Sénégal');
  const [currency, setCurrency] = useState('XOF');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val && !isValidEmail(val)) {
      setEmailError('Adresse email invalide (ex: nom@domaine.com)');
    } else {
      setEmailError('');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    if (email && !isValidEmail(email)) {
      setError('Adresse email invalide. Vérifiez le format (ex: nom@domaine.com)');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // businessType required for vendors
    if (role === 'VENDOR' && !businessType) {
      setError('Veuillez sélectionner le type de votre boutique');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const fullPhone = phoneNumber ? `${phoneCode}${phoneNumber}` : undefined;
      const finalBusinessType = businessType === 'autre' && businessTypeOther
        ? `autre:${businessTypeOther}`
        : businessType;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: fullPhone,
          phoneWithCode: fullPhone,
          password,
          businessName,
          businessType: finalBusinessType,
          role,
          location: location || country,
          country,
          currency,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'inscription");
      if (role === 'WHOLESALER') window.location.href = '/wholesaler/dashboard';
      else window.location.href = '/dashboard';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo + Language */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1" />
            <div className="inline-flex items-center gap-3">
              <AppLogo size={40} />
              <div className="text-left">
                <h1 className="text-xl font-bold text-white">Bor-Bi</h1>
                <p className="text-primary-200 text-xs">par TransTech Solution</p>
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              <LanguageSelector />
            </div>
          </div>
          <p className="text-primary-200 text-sm">Inscription gratuite — Aucune carte bancaire requise</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Créer un compte</h2>
          <p className="text-sm text-gray-500 mb-6">Rejoignez des milliers de commerçants</p>

          {/* Role toggle */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              onClick={() => setRole('VENDOR')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'VENDOR' ? 'bg-white text-primary-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              🏪 Vendeur
            </button>
            <button
              onClick={() => setRole('WHOLESALER')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'WHOLESALER' ? 'bg-white text-primary-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              🏭 Grossiste
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l&apos;entreprise *</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  placeholder="Boutique Amadou"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Business Type (Vendor only) */}
            {role === 'VENDOR' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Type de boutique <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Store size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none transition-all appearance-none bg-white"
                  >
                    <option value="">Sélectionnez votre type de boutique</option>
                    {BUSINESS_TYPES.map((bt) => (
                      <option key={bt.value} value={bt.value}>{bt.label}</option>
                    ))}
                  </select>
                </div>
                {businessType === 'autre' && (
                  <input
                    type="text"
                    value={businessTypeOther}
                    onChange={(e) => setBusinessTypeOther(e.target.value)}
                    placeholder="Précisez votre type de boutique"
                    className="mt-2 w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="votre@email.com"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none transition-all ${emailError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
            </div>

            {/* Phone with international code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone (avec indicatif)</label>
              <div className="flex gap-2">
                <select
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className="px-2 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-200 bg-white min-w-[120px]"
                >
                  {COUNTRIES.map((c, i) => (
                    <option key={`${c.code}-${i}`} value={c.code}>{c.flag} {c.code} {c.label}</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="77 000 00 00"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pays</label>
              <div className="relative">
                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none transition-all appearance-none bg-white"
                >
                  {COUNTRIES.map((c, i) => (
                    <option key={`country-${i}`} value={c.country}>{c.flag} {c.country}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Dakar"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                />
              </div>
            </div>

            {role === 'WHOLESALER' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Devise principale</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none transition-all appearance-none bg-white"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Min. 8 caractères"
                    className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Répéter"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!emailError}
              className="w-full py-3 bg-primary-800 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-primary-700 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
