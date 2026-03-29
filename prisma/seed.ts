import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ===== EXISTING PRODUCTS (kept from original) =====
const existingProducts = [
  // BOULANGERIE (20)
  { nameFr: 'Baguette tradition', nameWolof: 'Mburu', category: 'boulangerie', unit: 'pièce', defaultPrice: 25000, brand: 'Grand Moulin de Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Baguette' },
  { nameFr: 'Pain de mie', nameWolof: 'Mburu bu dëkk', category: 'boulangerie', unit: 'paquet', defaultPrice: 120000, brand: 'Boulangerie Centrale', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Pain+mie' },
  { nameFr: 'Croissant', nameWolof: 'Croissant', category: 'boulangerie', unit: 'pièce', defaultPrice: 50000, brand: 'Pâtisserie Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Croissant' },
  { nameFr: 'Pain complet', nameWolof: 'Mburu bu dëkk', category: 'boulangerie', unit: 'pièce', defaultPrice: 150000, brand: 'Grand Moulin de Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Pain+complet' },
  { nameFr: 'Brioche', nameWolof: 'Brioche', category: 'boulangerie', unit: 'pièce', defaultPrice: 200000, brand: 'Pâtisserie Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Brioche' },
  { nameFr: 'Pain au chocolat', nameWolof: 'Pain chocolat', category: 'boulangerie', unit: 'pièce', defaultPrice: 75000, brand: 'Boulangerie Centrale', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Pain+choco' },
  { nameFr: 'Fougasse', nameWolof: 'Fougasse', category: 'boulangerie', unit: 'pièce', defaultPrice: 100000, brand: 'Grand Moulin de Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Fougasse' },
  { nameFr: 'Pain beurre', nameWolof: 'Mburu ak diwul', category: 'boulangerie', unit: 'pièce', defaultPrice: 30000, brand: 'Boulangerie Centrale', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Pain+beurre' },
  { nameFr: 'Sandwich jambon', nameWolof: 'Sandwich', category: 'boulangerie', unit: 'pièce', defaultPrice: 250000, brand: 'Pâtisserie Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Sandwich' },
  { nameFr: 'Tarte aux fruits', nameWolof: 'Tarte', category: 'boulangerie', unit: 'pièce', defaultPrice: 300000, brand: 'Pâtisserie Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Tarte' },
  { nameFr: 'Gâteau yaourt', nameWolof: 'Gâteau', category: 'boulangerie', unit: 'pièce', defaultPrice: 500000, brand: 'Boulangerie Centrale', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Gateau' },
  { nameFr: 'Madeleine', nameWolof: 'Madeleine', category: 'boulangerie', unit: 'paquet', defaultPrice: 150000, brand: 'Grand Moulin de Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Madeleine' },
  { nameFr: 'Eclair chocolat', nameWolof: 'Eclair', category: 'boulangerie', unit: 'pièce', defaultPrice: 100000, brand: 'Pâtisserie Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Eclair' },
  { nameFr: 'Chausson aux pommes', nameWolof: 'Chausson', category: 'boulangerie', unit: 'pièce', defaultPrice: 75000, brand: 'Boulangerie Centrale', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Chausson' },
  { nameFr: 'Pain de seigle', nameWolof: 'Mburu seigle', category: 'boulangerie', unit: 'pièce', defaultPrice: 200000, brand: 'Grand Moulin de Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Seigle' },
  { nameFr: 'Biscuit sec', nameWolof: 'Biscuit', category: 'boulangerie', unit: 'paquet', defaultPrice: 100000, brand: 'Jap', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Biscuit' },
  { nameFr: 'Galette', nameWolof: 'Galette', category: 'boulangerie', unit: 'pièce', defaultPrice: 50000, brand: 'Boulangerie Centrale', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Galette' },
  { nameFr: 'Cake aux raisins', nameWolof: 'Cake', category: 'boulangerie', unit: 'pièce', defaultPrice: 350000, brand: 'Pâtisserie Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Cake' },
  { nameFr: 'Kouign-amann', nameWolof: 'Kouign', category: 'boulangerie', unit: 'pièce', defaultPrice: 250000, brand: 'Grand Moulin de Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Kouign' },
  { nameFr: 'Financier', nameWolof: 'Financier', category: 'boulangerie', unit: 'pièce', defaultPrice: 75000, brand: 'Pâtisserie Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Financier' },
  { nameFr: 'Fougasse', nameWolof: 'Fougasse', category: 'boulangerie', unit: 'pièce', defaultPrice: 100000, brand: 'Grand Moulin de Dakar', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Fougasse' },

  // FRAIS & PROTÉINES (20 selected)
  { nameFr: 'Poulet PAC entier', nameWolof: 'Ginaar bu dëkk', category: 'fraisProteines', unit: 'kg', defaultPrice: 250000, brand: 'Avicole Sénégal', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Poulet+PAC' },
  { nameFr: 'Poulet Cayar', nameWolof: 'Ginaar Cayar', category: 'fraisProteines', unit: 'kg', defaultPrice: 300000, brand: 'Pêcherie Cayar', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Poulet+Cayar' },
  { nameFr: 'Thiof frais', nameWolof: 'Thiof', category: 'fraisProteines', unit: 'kg', defaultPrice: 350000, brand: 'Pêcherie Dakar', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Thiof' },
  { nameFr: 'Kéthiakh fumé', nameWolof: 'Kéthiakh', category: 'fraisProteines', unit: 'kg', defaultPrice: 400000, brand: 'Pêche Atlantique', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Kethiakh' },
  { nameFr: 'Bœuf (viande)', nameWolof: 'Yàpp bu nag', category: 'fraisProteines', unit: 'kg', defaultPrice: 400000, brand: 'Boucherie Nationale', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Boeuf' },
  { nameFr: 'Mouton (viande)', nameWolof: 'Yàpp bu xar', category: 'fraisProteines', unit: 'kg', defaultPrice: 450000, brand: 'Boucherie Nationale', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Mouton' },
  { nameFr: 'Œufs (plateau 30)', nameWolof: 'Nëgg', category: 'fraisProteines', unit: 'plateau', defaultPrice: 250000, brand: 'Avicole Sénégal', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Oeufs' },
  { nameFr: 'Sardines fraîches', nameWolof: 'Yabboy', category: 'fraisProteines', unit: 'kg', defaultPrice: 120000, brand: 'Pêche Atlantique', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Sardines' },
  { nameFr: 'Dorade fraîche', nameWolof: 'Jën bu dëkk', category: 'fraisProteines', unit: 'kg', defaultPrice: 250000, brand: 'Pêcherie Dakar', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Dorade' },
  { nameFr: 'Crevettes fraîches', nameWolof: 'Crevettes', category: 'fraisProteines', unit: 'kg', defaultPrice: 500000, brand: 'Pêche Atlantique', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Crevettes' },
  { nameFr: 'Lait frais', nameWolof: 'Meew bu dëkk', category: 'fraisProteines', unit: 'litre', defaultPrice: 80000, brand: 'Laiterie du Berger', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Lait' },
  { nameFr: 'Yaourt nature', nameWolof: 'Yaourt', category: 'fraisProteines', unit: 'pot', defaultPrice: 100000, brand: 'Laiterie du Berger', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Yaourt' },
  { nameFr: 'Guedj (poisson séché)', nameWolof: 'Guedj', category: 'fraisProteines', unit: 'kg', defaultPrice: 350000, brand: 'Pêche Atlantique', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Guedj' },
  { nameFr: 'Capitaine frais', nameWolof: 'Capitaine', category: 'fraisProteines', unit: 'kg', defaultPrice: 300000, brand: 'Pêcherie Dakar', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Capitaine' },
  { nameFr: 'Tilapia frais', nameWolof: 'Tilapia', category: 'fraisProteines', unit: 'kg', defaultPrice: 200000, brand: 'Pêcherie Dakar', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Tilapia' },
  { nameFr: 'Poulet chair', nameWolof: 'Ginaar bu yàpp', category: 'fraisProteines', unit: 'kg', defaultPrice: 220000, brand: 'Avicole Sénégal', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Poulet+chair' },
  { nameFr: 'Blanc de poulet', nameWolof: 'Blanc ginaar', category: 'fraisProteines', unit: 'kg', defaultPrice: 280000, brand: 'Avicole Sénégal', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Blanc' },
  { nameFr: 'Foie de bœuf', nameWolof: 'Foie', category: 'fraisProteines', unit: 'kg', defaultPrice: 300000, brand: 'Boucherie Nationale', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Foie' },
  { nameFr: 'Fromage blanc', nameWolof: 'Fromage', category: 'fraisProteines', unit: 'pot', defaultPrice: 200000, brand: 'Laiterie du Berger', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Fromage' },
  { nameFr: 'Beurre frais', nameWolof: 'Diwul bu dëkk', category: 'fraisProteines', unit: 'kg', defaultPrice: 500000, brand: 'Laiterie du Berger', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Beurre' },

  // FRUITS & LÉGUMES (20 selected)
  { nameFr: 'Oignon', nameWolof: 'Soxor', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 60000, brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Oignon' },
  { nameFr: 'Tomate fraîche', nameWolof: 'Tomaat', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 80000, brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Tomate' },
  { nameFr: 'Mangue', nameWolof: 'Maango', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 100000, brand: 'Vergers du Sénégal', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Mangue' },
  { nameFr: 'Bissap (hibiscus)', nameWolof: 'Bisaab', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 200000, brand: 'Vergers du Sénégal', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Bissap' },
  { nameFr: 'Aviva (pomme de cajou)', nameWolof: 'Aviva', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 120000, brand: 'Vergers du Sénégal', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Aviva' },
  { nameFr: 'Piment', nameWolof: 'Kaani', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 150000, brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Piment' },
  { nameFr: 'Ail', nameWolof: 'Ay', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 300000, brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Ail' },
  { nameFr: 'Carotte', nameWolof: 'Carotte', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 100000, brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Carotte' },
  { nameFr: 'Pomme de terre', nameWolof: 'Pomme de terre', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 80000, brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=PDT' },
  { nameFr: 'Gombo', nameWolof: 'Kànja', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 150000, brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Gombo' },
  { nameFr: 'Papaye', nameWolof: 'Papaye', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 100000, brand: 'Vergers du Sénégal', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Papaye' },
  { nameFr: 'Citron', nameWolof: 'Limonn', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 100000, brand: 'Vergers du Sénégal', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Citron' },
  { nameFr: 'Ananas', nameWolof: 'Ananas', category: 'fruitsLegumes', unit: 'pièce', defaultPrice: 150000, brand: 'Vergers du Sénégal', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Ananas' },
  { nameFr: 'Manioc', nameWolof: 'Manioc', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 80000, brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Manioc' },
  { nameFr: 'Igname', nameWolof: 'Nyami', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 120000, brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Igname' },
  { nameFr: 'Chou blanc', nameWolof: 'Chou', category: 'fruitsLegumes', unit: 'pièce', defaultPrice: 100000, brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Chou' },
  { nameFr: 'Aubergine', nameWolof: 'Aubergine', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 100000, brand: 'Maraîchers Locaux', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Aubergine' },
  { nameFr: 'Pastèque', nameWolof: 'Pastèque', category: 'fruitsLegumes', unit: 'pièce', defaultPrice: 200000, brand: 'Vergers du Sénégal', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Pasteque' },
  { nameFr: 'Goyave', nameWolof: 'Goyave', category: 'fruitsLegumes', unit: 'kg', defaultPrice: 80000, brand: 'Vergers du Sénégal', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Goyave' },

  // ÉPICERIE (30 selected)
  { nameFr: 'Riz brisé 25kg', nameWolof: 'Ceeb', category: 'epicerie', unit: 'sac', defaultPrice: 1500000, brand: 'Marque Sénégal', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Riz+25kg' },
  { nameFr: 'Huile végétale 5L', nameWolof: 'Dëkk', category: 'epicerie', unit: 'bidon', defaultPrice: 600000, brand: 'Jumbo', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Huile+5L' },
  { nameFr: 'Sucre en poudre 1kg', nameWolof: 'Sukër', category: 'epicerie', unit: 'kg', defaultPrice: 80000, brand: 'Sucrerie Sénégal', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Sucre' },
  { nameFr: 'Farine de blé 1kg', nameWolof: 'Farine', category: 'epicerie', unit: 'kg', defaultPrice: 70000, brand: 'Grand Moulin de Dakar', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Farine' },
  { nameFr: 'Sel iodé 1kg', nameWolof: 'Mel', category: 'epicerie', unit: 'kg', defaultPrice: 30000, brand: 'Salins du Sénégal', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Sel' },
  { nameFr: 'Tomate concentrée 70g', nameWolof: 'Tomaat bu séex', category: 'epicerie', unit: 'boîte', defaultPrice: 50000, brand: 'Tomapom', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Tomate+conc' },
  { nameFr: 'Cube Maggi', nameWolof: 'Maggi', category: 'epicerie', unit: 'boîte', defaultPrice: 100000, brand: 'Maggi', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Maggi' },
  { nameFr: 'Lait en poudre 400g', nameWolof: 'Meew bu séex', category: 'epicerie', unit: 'boîte', defaultPrice: 300000, brand: 'Nestlé', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Lait+poudre' },
  { nameFr: 'Sardines en boîte', nameWolof: 'Yabboy bu séex', category: 'epicerie', unit: 'boîte', defaultPrice: 100000, brand: 'Saupiquet', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Sardines+boite' },
  { nameFr: 'Thon en boîte', nameWolof: 'Thon', category: 'epicerie', unit: 'boîte', defaultPrice: 150000, brand: 'Saupiquet', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Thon' },
  { nameFr: 'Pâtes spaghetti 500g', nameWolof: 'Pâtes', category: 'epicerie', unit: 'paquet', defaultPrice: 100000, brand: 'Panzani', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Spaghetti' },
  { nameFr: 'Riz parfumé 5kg', nameWolof: 'Ceeb bu dëkk', category: 'epicerie', unit: 'sac', defaultPrice: 400000, brand: 'Marque Sénégal', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Riz+5kg' },
  { nameFr: 'Huile de palme 1L', nameWolof: 'Dëkk bu tànn', category: 'epicerie', unit: 'bouteille', defaultPrice: 150000, brand: 'Jumbo', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Huile+palme' },
  { nameFr: 'Café soluble', nameWolof: 'Café', category: 'epicerie', unit: 'boîte', defaultPrice: 250000, brand: 'Nescafé', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Cafe' },
  { nameFr: 'Thé Lipton', nameWolof: 'Attaya', category: 'epicerie', unit: 'boîte', defaultPrice: 150000, brand: 'Lipton', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=The' },
  { nameFr: 'Arachides grillées', nameWolof: 'Tigadège', category: 'epicerie', unit: 'kg', defaultPrice: 200000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Arachides' },
  { nameFr: 'Mil (sorgho)', nameWolof: 'Soona', category: 'epicerie', unit: 'kg', defaultPrice: 100000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Mil' },
  { nameFr: 'Niébé (haricot local)', nameWolof: 'Niébé', category: 'epicerie', unit: 'kg', defaultPrice: 150000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Niebe' },
  { nameFr: 'Fonio', nameWolof: 'Fonio', category: 'epicerie', unit: 'kg', defaultPrice: 200000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Fonio' },
  { nameFr: 'Miel naturel', nameWolof: 'Miel', category: 'epicerie', unit: 'pot', defaultPrice: 500000, brand: 'Miel du Sénégal', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Miel' },
  { nameFr: 'Pâte d\'arachide', nameWolof: 'Tigadège bu séex', category: 'epicerie', unit: 'pot', defaultPrice: 300000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Pate+arachide' },
  { nameFr: 'Moule à gâteau', nameWolof: 'Moule', category: 'epicerie', unit: 'pièce', defaultPrice: 500000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Moule' },
  { nameFr: 'Céréales petit-déjeuner', nameWolof: 'Céréales', category: 'epicerie', unit: 'boîte', defaultPrice: 400000, brand: 'Kellogg\'s', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Cereales' },
  { nameFr: 'Vinaigre blanc', nameWolof: 'Vinaigre', category: 'epicerie', unit: 'bouteille', defaultPrice: 80000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Vinaigre' },
  { nameFr: 'Moutarde', nameWolof: 'Moutarde', category: 'epicerie', unit: 'pot', defaultPrice: 150000, brand: 'Amora', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Moutarde' },
  { nameFr: 'Mayonnaise', nameWolof: 'Mayonnaise', category: 'epicerie', unit: 'pot', defaultPrice: 200000, brand: 'Amora', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Mayonnaise' },
  { nameFr: 'Ketchup', nameWolof: 'Ketchup', category: 'epicerie', unit: 'bouteille', defaultPrice: 200000, brand: 'Heinz', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Ketchup' },
  { nameFr: 'Sauce soja', nameWolof: 'Sauce soja', category: 'epicerie', unit: 'bouteille', defaultPrice: 250000, brand: 'Kikkoman', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Soja' },
  { nameFr: 'Poivre noir', nameWolof: 'Poivre', category: 'epicerie', unit: 'sachet', defaultPrice: 50000, brand: 'Ducros', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Poivre' },
  { nameFr: 'Cumin', nameWolof: 'Cumin', category: 'epicerie', unit: 'sachet', defaultPrice: 50000, brand: 'Ducros', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Cumin' },
  { nameFr: 'Curry', nameWolof: 'Curry', category: 'epicerie', unit: 'sachet', defaultPrice: 75000, brand: 'Ducros', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Curry' },
  { nameFr: 'Cannelle', nameWolof: 'Cannelle', category: 'epicerie', unit: 'sachet', defaultPrice: 75000, brand: 'Ducros', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Cannelle' },
  { nameFr: 'Levure chimique', nameWolof: 'Levure', category: 'epicerie', unit: 'sachet', defaultPrice: 50000, brand: 'Alsa', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Levure' },
  { nameFr: 'Bicarbonate', nameWolof: 'Bicarbonate', category: 'epicerie', unit: 'sachet', defaultPrice: 50000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Bicarbonate' },
  { nameFr: 'Noix de coco râpée', nameWolof: 'Coco', category: 'epicerie', unit: 'sachet', defaultPrice: 100000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Coco' },
  { nameFr: 'Arachides grillées', nameWolof: 'Tigadège', category: 'epicerie', unit: 'kg', defaultPrice: 200000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Arachides' },
  { nameFr: 'Pâte d\'arachide', nameWolof: 'Tigadège bu séex', category: 'epicerie', unit: 'pot', defaultPrice: 300000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Pate+arachide' },
  { nameFr: 'Miel naturel', nameWolof: 'Miel', category: 'epicerie', unit: 'pot', defaultPrice: 500000, brand: 'Miel du Sénégal', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Miel' },
  { nameFr: 'Confiture fraise', nameWolof: 'Confiture', category: 'epicerie', unit: 'pot', defaultPrice: 250000, brand: 'Bonne Maman', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Confiture' },
  { nameFr: 'Chocolat en poudre', nameWolof: 'Chocolat', category: 'epicerie', unit: 'boîte', defaultPrice: 300000, brand: 'Nestlé', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Chocolat' },
  { nameFr: 'Biscuits Oreo', nameWolof: 'Biscuits', category: 'epicerie', unit: 'paquet', defaultPrice: 200000, brand: 'Oreo', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Oreo' },
  { nameFr: 'Chips', nameWolof: 'Chips', category: 'epicerie', unit: 'paquet', defaultPrice: 150000, brand: 'Lay\'s', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Chips' },
  { nameFr: 'Céréales petit-déjeuner', nameWolof: 'Céréales', category: 'epicerie', unit: 'boîte', defaultPrice: 400000, brand: 'Kellogg\'s', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Cereales' },
  { nameFr: 'Vinaigre blanc', nameWolof: 'Vinaigre', category: 'epicerie', unit: 'bouteille', defaultPrice: 80000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Vinaigre' },
  { nameFr: 'Moutarde', nameWolof: 'Moutarde', category: 'epicerie', unit: 'pot', defaultPrice: 150000, brand: 'Amora', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Moutarde' },
  { nameFr: 'Mayonnaise', nameWolof: 'Mayonnaise', category: 'epicerie', unit: 'pot', defaultPrice: 200000, brand: 'Amora', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Mayonnaise' },
  { nameFr: 'Ketchup', nameWolof: 'Ketchup', category: 'epicerie', unit: 'bouteille', defaultPrice: 200000, brand: 'Heinz', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Ketchup' },
  { nameFr: 'Sauce soja', nameWolof: 'Sauce soja', category: 'epicerie', unit: 'bouteille', defaultPrice: 250000, brand: 'Kikkoman', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Soja' },
  { nameFr: 'Poivre noir', nameWolof: 'Poivre', category: 'epicerie', unit: 'sachet', defaultPrice: 50000, brand: 'Ducros', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Poivre' },
  { nameFr: 'Cumin', nameWolof: 'Cumin', category: 'epicerie', unit: 'sachet', defaultPrice: 50000, brand: 'Ducros', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Cumin' },
  { nameFr: 'Curry', nameWolof: 'Curry', category: 'epicerie', unit: 'sachet', defaultPrice: 75000, brand: 'Ducros', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Curry' },
  { nameFr: 'Cannelle', nameWolof: 'Cannelle', category: 'epicerie', unit: 'sachet', defaultPrice: 75000, brand: 'Ducros', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Cannelle' },
  { nameFr: 'Levure chimique', nameWolof: 'Levure', category: 'epicerie', unit: 'sachet', defaultPrice: 50000, brand: 'Alsa', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Levure' },
  { nameFr: 'Bicarbonate', nameWolof: 'Bicarbonate', category: 'epicerie', unit: 'sachet', defaultPrice: 50000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Bicarbonate' },
  { nameFr: 'Noix de coco râpée', nameWolof: 'Coco', category: 'epicerie', unit: 'sachet', defaultPrice: 100000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Coco' },
  { nameFr: 'Arachides grillées', nameWolof: 'Tigadège', category: 'epicerie', unit: 'kg', defaultPrice: 200000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Arachides' },
  { nameFr: 'Pâte d\'arachide', nameWolof: 'Tigadège bu séex', category: 'epicerie', unit: 'pot', defaultPrice: 300000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Pate+arachide' },
  { nameFr: 'Miel naturel', nameWolof: 'Miel', category: 'epicerie', unit: 'pot', defaultPrice: 500000, brand: 'Miel du Sénégal', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Miel' },
  { nameFr: 'Confiture fraise', nameWolof: 'Confiture', category: 'epicerie', unit: 'pot', defaultPrice: 250000, brand: 'Bonne Maman', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Confiture' },
  { nameFr: 'Chocolat en poudre', nameWolof: 'Chocolat', category: 'epicerie', unit: 'boîte', defaultPrice: 300000, brand: 'Nestlé', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Chocolat' },
  { nameFr: 'Biscuits Oreo', nameWolof: 'Biscuits', category: 'epicerie', unit: 'paquet', defaultPrice: 200000, brand: 'Oreo', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Oreo' },
  { nameFr: 'Chips', nameWolof: 'Chips', category: 'epicerie', unit: 'paquet', defaultPrice: 150000, brand: 'Lay\'s', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Chips' },
  { nameFr: 'Céréales petit-déjeuner', nameWolof: 'Céréales', category: 'epicerie', unit: 'boîte', defaultPrice: 400000, brand: 'Kellogg\'s', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Cereales' },
  { nameFr: 'Flocons d\'avoine', nameWolof: 'Avoine', category: 'epicerie', unit: 'paquet', defaultPrice: 250000, brand: 'Quaker', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Avoine' },
  { nameFr: 'Lait concentré sucré', nameWolof: 'Meew bu sukër', category: 'epicerie', unit: 'boîte', defaultPrice: 150000, brand: 'Nestlé', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Lait+concentre' },
  { nameFr: 'Crème de coco', nameWolof: 'Crème coco', category: 'epicerie', unit: 'boîte', defaultPrice: 200000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Creme+coco' },
  { nameFr: 'Bouillon de poulet', nameWolof: 'Bouillon', category: 'epicerie', unit: 'boîte', defaultPrice: 100000, brand: 'Maggi', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Bouillon' },
  { nameFr: 'Soupe en sachet', nameWolof: 'Soupe', category: 'epicerie', unit: 'sachet', defaultPrice: 75000, brand: 'Knorr', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Soupe' },
  { nameFr: 'Purée en flocons', nameWolof: 'Purée', category: 'epicerie', unit: 'paquet', defaultPrice: 200000, brand: 'Mousline', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Puree' },
  { nameFr: 'Maïs en boîte', nameWolof: 'Maïs', category: 'epicerie', unit: 'boîte', defaultPrice: 120000, brand: 'Bonduelle', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Mais' },
  { nameFr: 'Petits pois en boîte', nameWolof: 'Petits pois', category: 'epicerie', unit: 'boîte', defaultPrice: 120000, brand: 'Bonduelle', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Petits+pois' },
  { nameFr: 'Champignons en boîte', nameWolof: 'Champignons', category: 'epicerie', unit: 'boîte', defaultPrice: 150000, brand: 'Bonduelle', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Champignons' },
  { nameFr: 'Olives vertes', nameWolof: 'Olives', category: 'epicerie', unit: 'bocal', defaultPrice: 250000, brand: 'Borges', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Olives' },
  { nameFr: 'Cornichons', nameWolof: 'Cornichons', category: 'epicerie', unit: 'bocal', defaultPrice: 200000, brand: 'Amora', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Cornichons' },
  { nameFr: 'Huile d\'olive', nameWolof: 'Huile olive', category: 'epicerie', unit: 'bouteille', defaultPrice: 500000, brand: 'Borges', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Huile+olive' },
  { nameFr: 'Beurre de karité', nameWolof: 'Diwul bu karite', category: 'epicerie', unit: 'pot', defaultPrice: 300000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Karite' },
  { nameFr: 'Fonio', nameWolof: 'Fonio', category: 'epicerie', unit: 'kg', defaultPrice: 200000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Fonio' },
  { nameFr: 'Mil (sorgho)', nameWolof: 'Soona', category: 'epicerie', unit: 'kg', defaultPrice: 100000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Mil' },
  { nameFr: 'Maïs grain', nameWolof: 'Maïs bu dëkk', category: 'epicerie', unit: 'kg', defaultPrice: 80000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Mais+grain' },
  { nameFr: 'Niébé (haricot local)', nameWolof: 'Niébé', category: 'epicerie', unit: 'kg', defaultPrice: 150000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Niebe' },
  { nameFr: 'Arachides crues', nameWolof: 'Tigadège bu dëkk', category: 'epicerie', unit: 'kg', defaultPrice: 150000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Arachides+crues' },

  // BOISSONS (20 selected)
  { nameFr: 'Eau minérale 1.5L', nameWolof: 'Ndox', category: 'boissons', unit: 'bouteille', defaultPrice: 50000, brand: 'Kirène', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Eau+1.5L' },
  { nameFr: 'Coca-Cola 33cl', nameWolof: 'Coca', category: 'boissons', unit: 'canette', defaultPrice: 75000, brand: 'Coca-Cola', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Coca' },
  { nameFr: 'Jus de bissap', nameWolof: 'Bisaab', category: 'boissons', unit: 'bouteille', defaultPrice: 100000, brand: 'Bissap Dakar', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Bissap' },
  { nameFr: 'Jus de gingembre', nameWolof: 'Gëmb', category: 'boissons', unit: 'bouteille', defaultPrice: 100000, brand: 'Bissap Dakar', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Gingembre' },
  { nameFr: 'Café Touba', nameWolof: 'Café Touba', category: 'boissons', unit: 'sachet', defaultPrice: 50000, brand: 'Café Touba Sénégal', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Cafe+Touba' },
  { nameFr: 'Thé vert Gunpowder', nameWolof: 'Attaya bu wëñ', category: 'boissons', unit: 'boîte', defaultPrice: 200000, brand: 'Lipton', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=The+vert' },
  { nameFr: 'Lait Nido 400g', nameWolof: 'Nido', category: 'boissons', unit: 'boîte', defaultPrice: 350000, brand: 'Nestlé', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Nido' },
  { nameFr: 'Fanta Orange 33cl', nameWolof: 'Fanta', category: 'boissons', unit: 'canette', defaultPrice: 75000, brand: 'Coca-Cola', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Fanta' },
  { nameFr: 'Sprite 33cl', nameWolof: 'Sprite', category: 'boissons', unit: 'canette', defaultPrice: 75000, brand: 'Coca-Cola', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Sprite' },
  { nameFr: 'Jus de baobab (bouye)', nameWolof: 'Bouye', category: 'boissons', unit: 'bouteille', defaultPrice: 100000, brand: 'Bissap Dakar', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Bouye' },
  { nameFr: 'Jus de tamarin', nameWolof: 'Dakhar', category: 'boissons', unit: 'bouteille', defaultPrice: 100000, brand: 'Bissap Dakar', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Tamarin' },
  { nameFr: 'Jus de mangue', nameWolof: 'Jus maango', category: 'boissons', unit: 'bouteille', defaultPrice: 120000, brand: 'Tropicana', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Jus+mangue' },
  { nameFr: 'Jus d\'orange', nameWolof: 'Jus orañs', category: 'boissons', unit: 'bouteille', defaultPrice: 120000, brand: 'Tropicana', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Jus+orange' },
  { nameFr: 'Jus de goyave', nameWolof: 'Jus goyave', category: 'boissons', unit: 'bouteille', defaultPrice: 120000, brand: 'Tropicana', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Jus+goyave' },
  { nameFr: 'Eau en sachet', nameWolof: 'Ndox bu saket', category: 'boissons', unit: 'sachet', defaultPrice: 10000, brand: 'Kirène', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Eau+sachet' },
  { nameFr: 'Bière Gazelle 33cl', nameWolof: 'Bière', category: 'boissons', unit: 'bouteille', defaultPrice: 100000, brand: 'Gazelle', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Gazelle' },
  { nameFr: 'Bière Flag 33cl', nameWolof: 'Flag', category: 'boissons', unit: 'bouteille', defaultPrice: 100000, brand: 'Flag', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Flag' },
  { nameFr: 'Bière Heineken 33cl', nameWolof: 'Heineken', category: 'boissons', unit: 'bouteille', defaultPrice: 150000, brand: 'Heineken', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Heineken' },
  { nameFr: 'Vin rouge 75cl', nameWolof: 'Vin', category: 'boissons', unit: 'bouteille', defaultPrice: 500000, brand: 'Castel', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Vin+rouge' },
  { nameFr: 'Vin blanc 75cl', nameWolof: 'Vin bu weex', category: 'boissons', unit: 'bouteille', defaultPrice: 500000, brand: 'Castel', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Vin+blanc' },
  { nameFr: 'Whisky 70cl', nameWolof: 'Whisky', category: 'boissons', unit: 'bouteille', defaultPrice: 2000000, brand: 'Johnnie Walker', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Whisky' },
  { nameFr: 'Rhum 70cl', nameWolof: 'Rhum', category: 'boissons', unit: 'bouteille', defaultPrice: 1500000, brand: 'Bacardi', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Rhum' },
  { nameFr: 'Café Nescafé', nameWolof: 'Nescafé', category: 'boissons', unit: 'boîte', defaultPrice: 300000, brand: 'Nescafé', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Nescafe' },
  { nameFr: 'Limonade', nameWolof: 'Limonade', category: 'boissons', unit: 'bouteille', defaultPrice: 75000, brand: 'Kirène', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Limonade' },
  { nameFr: 'Tonic water', nameWolof: 'Tonic', category: 'boissons', unit: 'canette', defaultPrice: 100000, brand: 'Schweppes', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Tonic' },
  { nameFr: 'Energy drink', nameWolof: 'Energy drink', category: 'boissons', unit: 'canette', defaultPrice: 150000, brand: 'Red Bull', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Energy' },
  { nameFr: 'Smoothie tropical', nameWolof: 'Smoothie', category: 'boissons', unit: 'bouteille', defaultPrice: 200000, brand: 'Tropicana', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Smoothie' },
  { nameFr: 'Lait de soja', nameWolof: 'Meew soja', category: 'boissons', unit: 'brique', defaultPrice: 150000, brand: 'Alpro', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Soja' },
  { nameFr: 'Lait d\'amande', nameWolof: 'Meew amande', category: 'boissons', unit: 'brique', defaultPrice: 200000, brand: 'Alpro', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Amande' },
  { nameFr: 'Sirop de grenadine', nameWolof: 'Sirop', category: 'boissons', unit: 'bouteille', defaultPrice: 200000, brand: 'Teisseire', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Grenadine' },
  { nameFr: 'Sirop de menthe', nameWolof: 'Sirop nana', category: 'boissons', unit: 'bouteille', defaultPrice: 200000, brand: 'Teisseire', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Sirop+menthe' },
  { nameFr: 'Jus de citron pressé', nameWolof: 'Jus limonn', category: 'boissons', unit: 'bouteille', defaultPrice: 150000, brand: 'Tropicana', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Citron+presse' },
  { nameFr: 'Kombucha', nameWolof: 'Kombucha', category: 'boissons', unit: 'bouteille', defaultPrice: 300000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Kombucha' },
  { nameFr: 'Eau de coco', nameWolof: 'Ndox coco', category: 'boissons', unit: 'bouteille', defaultPrice: 150000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Eau+coco' },
  { nameFr: 'Jus de pastèque', nameWolof: 'Jus pastèque', category: 'boissons', unit: 'bouteille', defaultPrice: 120000, brand: 'Bissap Dakar', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Pasteque+jus' },
  { nameFr: 'Boisson maltée', nameWolof: 'Malta', category: 'boissons', unit: 'bouteille', defaultPrice: 100000, brand: 'Malta', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Malta' },
  { nameFr: 'Jus de papaye', nameWolof: 'Jus papaye', category: 'boissons', unit: 'bouteille', defaultPrice: 120000, brand: 'Tropicana', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Papaye+jus' },
  { nameFr: 'Jus de corossol', nameWolof: 'Jus corossol', category: 'boissons', unit: 'bouteille', defaultPrice: 150000, brand: 'Bissap Dakar', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Corossol' },
  { nameFr: 'Jus de carotte', nameWolof: 'Jus carotte', category: 'boissons', unit: 'bouteille', defaultPrice: 120000, brand: 'Tropicana', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Carotte+jus' },
  { nameFr: 'Jus de tomate', nameWolof: 'Jus tomaat', category: 'boissons', unit: 'bouteille', defaultPrice: 120000, brand: 'Tropicana', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Tomate+jus' },
  { nameFr: 'Boisson au gingembre', nameWolof: 'Gëmb bu dëkk', category: 'boissons', unit: 'bouteille', defaultPrice: 100000, brand: 'Bissap Dakar', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Gingembre+boisson' },
  { nameFr: 'Jus de pomme', nameWolof: 'Jus pom', category: 'boissons', unit: 'bouteille', defaultPrice: 150000, brand: 'Tropicana', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Pomme+jus' },

  // HYGIÈNE (20 selected)
  { nameFr: 'Savon de Marseille', nameWolof: 'Sabu', category: 'hygiene', unit: 'pièce', defaultPrice: 50000, brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Savon' },
  { nameFr: 'Dentifrice', nameWolof: 'Dentifrice', category: 'hygiene', unit: 'tube', defaultPrice: 150000, brand: 'Colgate', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Dentifrice' },
  { nameFr: 'Shampoing 400ml', nameWolof: 'Shampoing', category: 'hygiene', unit: 'flacon', defaultPrice: 300000, brand: 'Pantene', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Shampoing' },
  { nameFr: 'Gel douche 250ml', nameWolof: 'Gel douche', category: 'hygiene', unit: 'flacon', defaultPrice: 250000, brand: 'Dove', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Gel+douche' },
  { nameFr: 'Lessive poudre 1kg', nameWolof: 'Lessive', category: 'hygiene', unit: 'kg', defaultPrice: 200000, brand: 'Omo', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Lessive' },
  { nameFr: 'Eau de Javel', nameWolof: 'Javel', category: 'hygiene', unit: 'bouteille', defaultPrice: 100000, brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Javel' },
  { nameFr: 'Papier toilette (6 rouleaux)', nameWolof: 'Papier WC', category: 'hygiene', unit: 'paquet', defaultPrice: 200000, brand: 'Lotus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=PQ' },
  { nameFr: 'Couches bébé taille 3', nameWolof: 'Couches', category: 'hygiene', unit: 'paquet', defaultPrice: 500000, brand: 'Pampers', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Couches' },
  { nameFr: 'Serviettes hygiéniques', nameWolof: 'Serviettes', category: 'hygiene', unit: 'paquet', defaultPrice: 250000, brand: 'Always', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Serviettes' },
  { nameFr: 'Moustiquaire', nameWolof: 'Moustiquaire', category: 'hygiene', unit: 'pièce', defaultPrice: 500000, brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Moustiquaire' },
  { nameFr: 'Insecticide spray', nameWolof: 'Insecticide', category: 'hygiene', unit: 'bombe', defaultPrice: 300000, brand: 'Raid', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Insecticide' },
  { nameFr: 'Gel hydroalcoolique', nameWolof: 'Gel', category: 'hygiene', unit: 'flacon', defaultPrice: 150000, brand: 'Sanytol', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Gel+hydro' },
  { nameFr: 'Paracétamol', nameWolof: 'Paracétamol', category: 'hygiene', unit: 'boîte', defaultPrice: 100000, brand: 'Doliprane', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Paracetamol' },
  { nameFr: 'Crème hydratante', nameWolof: 'Crème', category: 'hygiene', unit: 'pot', defaultPrice: 300000, brand: 'Nivea', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Creme+hydra' },
  { nameFr: 'Huile de coco cosmétique', nameWolof: 'Huile coco', category: 'hygiene', unit: 'flacon', defaultPrice: 400000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Huile+coco' },
  { nameFr: 'Coton hydrophile', nameWolof: 'Coton', category: 'hygiene', unit: 'sachet', defaultPrice: 100000, brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Coton' },
  { nameFr: 'Pansements', nameWolof: 'Pansements', category: 'hygiene', unit: 'boîte', defaultPrice: 150000, brand: 'Hansaplast', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Pansements' },
  { nameFr: 'Vitamine C', nameWolof: 'Vitamine C', category: 'hygiene', unit: 'boîte', defaultPrice: 200000, brand: 'Bayer', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Vitamine+C' },
  { nameFr: 'Masques chirurgicaux', nameWolof: 'Masques', category: 'hygiene', unit: 'boîte', defaultPrice: 150000, brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Masques' },
  { nameFr: 'Déodorant roll-on', nameWolof: 'Déodorant', category: 'hygiene', unit: 'flacon', defaultPrice: 250000, brand: 'Dove', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Deodorant' },
  { nameFr: 'Savon liquide 500ml', nameWolof: 'Sabu bu dëkk', category: 'hygiene', unit: 'flacon', defaultPrice: 200000, brand: 'Dettol', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Savon+liquide' },
  { nameFr: 'Liquide vaisselle', nameWolof: 'Liquide vaisselle', category: 'hygiene', unit: 'flacon', defaultPrice: 150000, brand: 'Fairy', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Vaisselle' },
  { nameFr: 'Balai', nameWolof: 'Balai', category: 'hygiene', unit: 'pièce', defaultPrice: 300000, brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Balai' },
  { nameFr: 'Seau plastique', nameWolof: 'Seau', category: 'hygiene', unit: 'pièce', defaultPrice: 200000, brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Seau' },
  { nameFr: 'Bassine plastique', nameWolof: 'Bassine', category: 'hygiene', unit: 'pièce', defaultPrice: 300000, brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Bassine' },
  { nameFr: 'Éponge vaisselle', nameWolof: 'Éponge', category: 'hygiene', unit: 'pièce', defaultPrice: 50000, brand: 'Scotch-Brite', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Eponge' },
  { nameFr: 'Allumettes', nameWolof: 'Allumettes', category: 'hygiene', unit: 'boîte', defaultPrice: 25000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Allumettes' },
  { nameFr: 'Sac poubelle', nameWolof: 'Sac poubelle', category: 'hygiene', unit: 'rouleau', defaultPrice: 100000, brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Sac+poubelle' },
  { nameFr: 'Film alimentaire', nameWolof: 'Film', category: 'hygiene', unit: 'rouleau', defaultPrice: 150000, brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Film' },
  { nameFr: 'Papier aluminium', nameWolof: 'Papier alu', category: 'hygiene', unit: 'rouleau', defaultPrice: 150000, brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Alu' },
  { nameFr: 'Boîtes hermétiques', nameWolof: 'Boîtes', category: 'hygiene', unit: 'lot', defaultPrice: 300000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Boites' },
  { nameFr: 'Serviettes de table', nameWolof: 'Serviettes table', category: 'hygiene', unit: 'paquet', defaultPrice: 100000, brand: 'Lotus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Serviettes+table' },
  { nameFr: 'Essuie-tout', nameWolof: 'Essuie-tout', category: 'hygiene', unit: 'rouleau', defaultPrice: 100000, brand: 'Lotus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Essuie-tout' },
  { nameFr: 'Papier toilette (6 rouleaux)', nameWolof: 'Papier WC', category: 'hygiene', unit: 'paquet', defaultPrice: 200000, brand: 'Lotus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=PQ' },

  // ÉNERGIE & TECH (15 selected)
  { nameFr: 'Chargeur USB universel', nameWolof: 'Chargeur', category: 'energieTech', unit: 'pièce', defaultPrice: 500000, brand: 'TechPower', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Chargeur' },
  { nameFr: 'Câble USB-C', nameWolof: 'Câble', category: 'energieTech', unit: 'pièce', defaultPrice: 300000, brand: 'TechPower', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Cable+USB-C' },
  { nameFr: 'Batterie externe 10000mAh', nameWolof: 'Batterie', category: 'energieTech', unit: 'pièce', defaultPrice: 1500000, brand: 'Anker', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Batterie+ext' },
  { nameFr: 'Ampoule LED E27', nameWolof: 'Ampoule', category: 'energieTech', unit: 'pièce', defaultPrice: 200000, brand: 'Philips', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Ampoule+LED' },
  { nameFr: 'Ventilateur de table', nameWolof: 'Ventilateur', category: 'energieTech', unit: 'pièce', defaultPrice: 2000000, brand: 'Rowenta', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Ventilateur' },
  { nameFr: 'Panneau solaire 50W', nameWolof: 'Panneau solaire', category: 'energieTech', unit: 'pièce', defaultPrice: 25000000, brand: 'SolarTech', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Solaire' },
  { nameFr: 'Pile AA (lot 4)', nameWolof: 'Pile', category: 'energieTech', unit: 'lot', defaultPrice: 100000, brand: 'Duracell', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Pile+AA' },
  { nameFr: 'Multiprise 4 prises', nameWolof: 'Multiprise', category: 'energieTech', unit: 'pièce', defaultPrice: 800000, brand: 'TechPower', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Multiprise' },
  { nameFr: 'Fer à repasser', nameWolof: 'Fer', category: 'energieTech', unit: 'pièce', defaultPrice: 2500000, brand: 'Rowenta', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Fer' },
  { nameFr: 'Radio FM portable', nameWolof: 'Radio', category: 'energieTech', unit: 'pièce', defaultPrice: 1500000, brand: 'Sony', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Radio' },
  { nameFr: 'Smartphone entrée de gamme', nameWolof: 'Smartphone', category: 'energieTech', unit: 'pièce', defaultPrice: 30000000, brand: 'Tecno', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Smartphone' },
  { nameFr: 'Calculatrice', nameWolof: 'Calculatrice', category: 'energieTech', unit: 'pièce', defaultPrice: 500000, brand: 'Casio', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Calculatrice' },
  { nameFr: 'Lampe torche LED', nameWolof: 'Lampe', category: 'energieTech', unit: 'pièce', defaultPrice: 500000, brand: 'Maglite', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Lampe+LED' },
  { nameFr: 'Carte mémoire 32GB', nameWolof: 'Carte mémoire', category: 'energieTech', unit: 'pièce', defaultPrice: 1000000, brand: 'SanDisk', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Carte+32GB' },
  { nameFr: 'Enceinte Bluetooth', nameWolof: 'Enceinte', category: 'energieTech', unit: 'pièce', defaultPrice: 3000000, brand: 'JBL', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Enceinte' },

  // QUINCAILLERIE (15 selected)
  { nameFr: 'Marteau', nameWolof: 'Marteau', category: 'quincaillerie', unit: 'pièce', defaultPrice: 500000, brand: 'Stanley', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Marteau' },
  { nameFr: 'Tournevis plat', nameWolof: 'Tournevis', category: 'quincaillerie', unit: 'pièce', defaultPrice: 200000, brand: 'Stanley', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Tournevis' },
  { nameFr: 'Clé à molette', nameWolof: 'Clé', category: 'quincaillerie', unit: 'pièce', defaultPrice: 800000, brand: 'Facom', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Cle+molette' },
  { nameFr: 'Cadenas', nameWolof: 'Cadenas', category: 'quincaillerie', unit: 'pièce', defaultPrice: 500000, brand: 'Master Lock', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Cadenas' },
  { nameFr: 'Peinture blanche 1L', nameWolof: 'Peinture', category: 'quincaillerie', unit: 'pot', defaultPrice: 500000, brand: 'Sococim', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Peinture' },
  { nameFr: 'Câble électrique 10m', nameWolof: 'Câble élec', category: 'quincaillerie', unit: 'rouleau', defaultPrice: 1000000, brand: 'Nexans', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Cable+elec' },
  { nameFr: 'Robinet', nameWolof: 'Robinet', category: 'quincaillerie', unit: 'pièce', defaultPrice: 1500000, brand: 'Grohe', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Robinet' },
  { nameFr: 'Clous 100g', nameWolof: 'Clous', category: 'quincaillerie', unit: 'sachet', defaultPrice: 100000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Clous' },
  { nameFr: 'Colle forte', nameWolof: 'Colle', category: 'quincaillerie', unit: 'tube', defaultPrice: 200000, brand: 'Loctite', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Colle' },
  { nameFr: 'Mètre ruban 5m', nameWolof: 'Mètre', category: 'quincaillerie', unit: 'pièce', defaultPrice: 300000, brand: 'Stanley', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Metre' },
  { nameFr: 'Serrure de porte', nameWolof: 'Serrure', category: 'quincaillerie', unit: 'pièce', defaultPrice: 2000000, brand: 'Vachette', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Serrure' },
  { nameFr: 'Tuyau PVC 1m', nameWolof: 'Tuyau', category: 'quincaillerie', unit: 'pièce', defaultPrice: 500000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Tuyau+PVC' },
  { nameFr: 'Perceuse manuelle', nameWolof: 'Perceuse', category: 'quincaillerie', unit: 'pièce', defaultPrice: 3000000, brand: 'Bosch', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Perceuse' },
  { nameFr: 'Vis à bois 100g', nameWolof: 'Vis', category: 'quincaillerie', unit: 'sachet', defaultPrice: 150000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Vis' },
  { nameFr: 'Niveau à bulle', nameWolof: 'Niveau', category: 'quincaillerie', unit: 'pièce', defaultPrice: 800000, brand: 'Stanley', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Niveau' },

  // USTENSILES (15 selected)
  { nameFr: 'Marmite 10L', nameWolof: 'Marmite', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 2000000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Marmite+10L' },
  { nameFr: 'Poêle antiadhésive', nameWolof: 'Poêle', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 1500000, brand: 'Tefal', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Poele' },
  { nameFr: 'Cocotte minute', nameWolof: 'Cocotte', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 3000000, brand: 'SEB', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Cocotte' },
  { nameFr: 'Couteau de chef', nameWolof: 'Couteau', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 1000000, brand: 'Sabatier', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Couteau' },
  { nameFr: 'Mortier et pilon', nameWolof: 'Mortier', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 800000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Mortier' },
  { nameFr: 'Blender', nameWolof: 'Blender', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 3000000, brand: 'Moulinex', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Blender' },
  { nameFr: 'Assiettes (lot 6)', nameWolof: 'Assiettes', category: 'ustensilesCuisine', unit: 'lot', defaultPrice: 1000000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Assiettes' },
  { nameFr: 'Verres (lot 6)', nameWolof: 'Verres', category: 'ustensilesCuisine', unit: 'lot', defaultPrice: 500000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Verres' },
  { nameFr: 'Théière', nameWolof: 'Théière', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 800000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Theiere' },
  { nameFr: 'Casserole 3L', nameWolof: 'Casserole', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 800000, brand: 'Tefal', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Casserole' },
  { nameFr: 'Louche', nameWolof: 'Louche', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 200000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Louche' },
  { nameFr: 'Passoire', nameWolof: 'Passoire', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 400000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Passoire' },
  { nameFr: 'Planche à découper', nameWolof: 'Planche', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 500000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Planche' },
  { nameFr: 'Tablier de cuisine', nameWolof: 'Tablier', category: 'ustensilesCuisine', unit: 'pièce', defaultPrice: 300000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Tablier' },
  { nameFr: 'Couverts inox (lot 24)', nameWolof: 'Couverts', category: 'ustensilesCuisine', unit: 'lot', defaultPrice: 1500000, brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Couverts' },

  // MATÉRIAUX (15 selected)
  { nameFr: 'Ciment Portland 50kg', nameWolof: 'Ciment', category: 'materiaux', unit: 'sac', defaultPrice: 600000, brand: 'Sococim', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Ciment' },
  { nameFr: 'Fer à béton 10mm (barre)', nameWolof: 'Fer', category: 'materiaux', unit: 'barre', defaultPrice: 500000, brand: 'Acier Sénégal', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Fer+beton' },
  { nameFr: 'Tôle ondulée', nameWolof: 'Tôle', category: 'materiaux', unit: 'feuille', defaultPrice: 1500000, brand: 'Acier Sénégal', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Tole' },
  { nameFr: 'Carrelage sol 60x60', nameWolof: 'Carrelage', category: 'materiaux', unit: 'm²', defaultPrice: 1500000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Carrelage' },
  { nameFr: 'Brique rouge', nameWolof: 'Brique', category: 'materiaux', unit: 'pièce', defaultPrice: 30000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Brique' },
  { nameFr: 'Sable fin (m³)', nameWolof: 'Sable', category: 'materiaux', unit: 'm³', defaultPrice: 2000000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Sable' },
  { nameFr: 'Porte métallique', nameWolof: 'Porte', category: 'materiaux', unit: 'pièce', defaultPrice: 50000000, brand: 'Acier Sénégal', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Porte' },
  { nameFr: 'Peinture façade 10L', nameWolof: 'Peinture façade', category: 'materiaux', unit: 'seau', defaultPrice: 3000000, brand: 'Sococim', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Peinture+facade' },
  { nameFr: 'Parpaing creux', nameWolof: 'Parpaing', category: 'materiaux', unit: 'pièce', defaultPrice: 80000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Parpaing' },
  { nameFr: 'Planche de bois 3m', nameWolof: 'Planche', category: 'materiaux', unit: 'pièce', defaultPrice: 800000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Planche+bois' },
  { nameFr: 'Câble électrique 100m', nameWolof: 'Câble 100m', category: 'materiaux', unit: 'rouleau', defaultPrice: 8000000, brand: 'Nexans', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Cable+100m' },
  { nameFr: 'Robinet', nameWolof: 'Robinet', category: 'materiaux', unit: 'pièce', defaultPrice: 1500000, brand: 'Grohe', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Robinet' },
  { nameFr: 'Clous 100g', nameWolof: 'Clous', category: 'materiaux', unit: 'sachet', defaultPrice: 100000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Clous' },
  { nameFr: 'Colle forte', nameWolof: 'Colle', category: 'materiaux', unit: 'tube', defaultPrice: 200000, brand: 'Loctite', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Colle' },
  { nameFr: 'Mètre ruban 5m', nameWolof: 'Mètre', category: 'materiaux', unit: 'pièce', defaultPrice: 300000, brand: 'Stanley', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Metre' },
  { nameFr: 'Serrure de porte', nameWolof: 'Serrure', category: 'materiaux', unit: 'pièce', defaultPrice: 2000000, brand: 'Vachette', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Serrure' },
];

// ===== NEW: PRÊT-À-PORTER (30 products) =====
const pretAPorterProducts = [
  { nameFr: 'Chemise homme manches longues', nameWolof: 'Chemise', category: 'pretAPorter', unit: 'pièce', defaultPrice: 1500000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Chemise+H' },
  { nameFr: 'Chemise homme manches courtes', nameWolof: 'Chemise bu ndaw', category: 'pretAPorter', unit: 'pièce', defaultPrice: 1200000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Chemise+MC' },
  { nameFr: 'Pantalon homme classique', nameWolof: 'Pantalon', category: 'pretAPorter', unit: 'pièce', defaultPrice: 2500000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Pantalon+H' },
  { nameFr: 'Pantalon jean homme', nameWolof: 'Jean', category: 'pretAPorter', unit: 'pièce', defaultPrice: 3000000, brand: 'Levi\'s', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Jean+H' },
  { nameFr: 'Robe femme casual', nameWolof: 'Robe', category: 'pretAPorter', unit: 'pièce', defaultPrice: 2000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Robe+F' },
  { nameFr: 'Robe femme soirée', nameWolof: 'Robe bu xew', category: 'pretAPorter', unit: 'pièce', defaultPrice: 5000000, brand: 'Élégance Dakar', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Robe+Soiree' },
  { nameFr: 'Veste homme', nameWolof: 'Veste', category: 'pretAPorter', unit: 'pièce', defaultPrice: 4000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Veste+H' },
  { nameFr: 'Boubou homme grand', nameWolof: 'Mbubb', category: 'pretAPorter', unit: 'pièce', defaultPrice: 5000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Boubou+H' },
  { nameFr: 'Boubou femme brodé', nameWolof: 'Mbubb bu jigéen', category: 'pretAPorter', unit: 'pièce', defaultPrice: 6000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Boubou+F' },
  { nameFr: 'T-shirt homme', nameWolof: 'T-shirt', category: 'pretAPorter', unit: 'pièce', defaultPrice: 800000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=T-shirt+H' },
  { nameFr: 'T-shirt femme', nameWolof: 'T-shirt jigéen', category: 'pretAPorter', unit: 'pièce', defaultPrice: 800000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=T-shirt+F' },
  { nameFr: 'Jupe femme', nameWolof: 'Jupe', category: 'pretAPorter', unit: 'pièce', defaultPrice: 1500000, brand: 'Élégance Dakar', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Jupe' },
  { nameFr: 'Pantalon femme', nameWolof: 'Pantalon jigéen', category: 'pretAPorter', unit: 'pièce', defaultPrice: 2000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Pantalon+F' },
  { nameFr: 'Manteau homme', nameWolof: 'Manteau', category: 'pretAPorter', unit: 'pièce', defaultPrice: 8000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Manteau+H' },
  { nameFr: 'Manteau femme', nameWolof: 'Manteau jigéen', category: 'pretAPorter', unit: 'pièce', defaultPrice: 8000000, brand: 'Élégance Dakar', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Manteau+F' },
  { nameFr: 'Short homme', nameWolof: 'Short', category: 'pretAPorter', unit: 'pièce', defaultPrice: 1000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Short+H' },
  { nameFr: 'Polo homme', nameWolof: 'Polo', category: 'pretAPorter', unit: 'pièce', defaultPrice: 1500000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Polo' },
  { nameFr: 'Blouse femme', nameWolof: 'Blouse', category: 'pretAPorter', unit: 'pièce', defaultPrice: 1800000, brand: 'Élégance Dakar', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Blouse' },
  { nameFr: 'Costume homme complet', nameWolof: 'Costume', category: 'pretAPorter', unit: 'pièce', defaultPrice: 15000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Costume' },
  { nameFr: 'Tailleur femme', nameWolof: 'Tailleur', category: 'pretAPorter', unit: 'pièce', defaultPrice: 10000000, brand: 'Élégance Dakar', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Tailleur' },
  { nameFr: 'Djellaba homme', nameWolof: 'Djellaba', category: 'pretAPorter', unit: 'pièce', defaultPrice: 4000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Djellaba' },
  { nameFr: 'Kaftan femme', nameWolof: 'Kaftan', category: 'pretAPorter', unit: 'pièce', defaultPrice: 7000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Kaftan' },
  { nameFr: 'Pyjama homme', nameWolof: 'Pyjama', category: 'pretAPorter', unit: 'pièce', defaultPrice: 2000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Pyjama+H' },
  { nameFr: 'Pyjama femme', nameWolof: 'Pyjama jigéen', category: 'pretAPorter', unit: 'pièce', defaultPrice: 2000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Pyjama+F' },
  { nameFr: 'Sous-vêtements homme (lot 3)', nameWolof: 'Sous-vêtements', category: 'pretAPorter', unit: 'lot', defaultPrice: 1500000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=SV+H' },
  { nameFr: 'Sous-vêtements femme (lot 3)', nameWolof: 'Sous-vêtements jigéen', category: 'pretAPorter', unit: 'lot', defaultPrice: 1500000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=SV+F' },
  { nameFr: 'Chaussettes (lot 5 paires)', nameWolof: 'Chaussettes', category: 'pretAPorter', unit: 'lot', defaultPrice: 1000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Chaussettes' },
  { nameFr: 'Ceinture cuir homme', nameWolof: 'Ceinture', category: 'pretAPorter', unit: 'pièce', defaultPrice: 1500000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Ceinture' },
  { nameFr: 'Cravate homme', nameWolof: 'Cravate', category: 'pretAPorter', unit: 'pièce', defaultPrice: 1000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Cravate' },
  { nameFr: 'Foulard femme', nameWolof: 'Foulard', category: 'pretAPorter', unit: 'pièce', defaultPrice: 1200000, brand: 'Élégance Dakar', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Foulard' },
];

// ===== NEW: VÊTEMENTS (30 products) =====
const vetementsProducts = [
  { nameFr: 'Tissu bazin riche 5m', nameWolof: 'Bazin', category: 'vetements', unit: 'coupon', defaultPrice: 8000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Bazin' },
  { nameFr: 'Tissu wax africain 6 yards', nameWolof: 'Wax', category: 'vetements', unit: 'coupon', defaultPrice: 5000000, brand: 'Vlisco', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Wax' },
  { nameFr: 'Tissu coton blanc 5m', nameWolof: 'Coton', category: 'vetements', unit: 'coupon', defaultPrice: 3000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Coton+blanc' },
  { nameFr: 'Tissu soie artificielle 3m', nameWolof: 'Soie', category: 'vetements', unit: 'coupon', defaultPrice: 4000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Soie' },
  { nameFr: 'Tissu lin 3m', nameWolof: 'Lin', category: 'vetements', unit: 'coupon', defaultPrice: 3500000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Lin' },
  { nameFr: 'Tissu denim 2m', nameWolof: 'Denim', category: 'vetements', unit: 'coupon', defaultPrice: 2500000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Denim' },
  { nameFr: 'Fil à coudre (lot 10)', nameWolof: 'Fil', category: 'vetements', unit: 'lot', defaultPrice: 500000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Fil' },
  { nameFr: 'Boutons (lot 50)', nameWolof: 'Boutons', category: 'vetements', unit: 'lot', defaultPrice: 300000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Boutons' },
  { nameFr: 'Fermeture éclair (lot 10)', nameWolof: 'Fermeture', category: 'vetements', unit: 'lot', defaultPrice: 500000, brand: 'YKK', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Fermeture' },
  { nameFr: 'Broderie dorée 1m', nameWolof: 'Broderie', category: 'vetements', unit: 'mètre', defaultPrice: 1000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Broderie' },
  { nameFr: 'Dentelle 1m', nameWolof: 'Dentelle', category: 'vetements', unit: 'mètre', defaultPrice: 800000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Dentelle' },
  { nameFr: 'Élastique couture 5m', nameWolof: 'Élastique', category: 'vetements', unit: 'rouleau', defaultPrice: 300000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Elastique' },
  { nameFr: 'Doublure tissu 3m', nameWolof: 'Doublure', category: 'vetements', unit: 'coupon', defaultPrice: 1500000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Doublure' },
  { nameFr: 'Tissu pagne sénégalais', nameWolof: 'Pagne', category: 'vetements', unit: 'coupon', defaultPrice: 3000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Pagne' },
  { nameFr: 'Tissu bogolan malien', nameWolof: 'Bogolan', category: 'vetements', unit: 'coupon', defaultPrice: 4000000, brand: 'Artisan Mali', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Bogolan' },
  { nameFr: 'Chaussures homme cuir', nameWolof: 'Chaussures', category: 'vetements', unit: 'paire', defaultPrice: 5000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Chaussures+H' },
  { nameFr: 'Chaussures femme talon', nameWolof: 'Chaussures jigéen', category: 'vetements', unit: 'paire', defaultPrice: 4000000, brand: 'Élégance Dakar', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Chaussures+F' },
  { nameFr: 'Sandales homme', nameWolof: 'Sandales', category: 'vetements', unit: 'paire', defaultPrice: 2000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Sandales+H' },
  { nameFr: 'Sandales femme', nameWolof: 'Sandales jigéen', category: 'vetements', unit: 'paire', defaultPrice: 2500000, brand: 'Élégance Dakar', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Sandales+F' },
  { nameFr: 'Baskets homme', nameWolof: 'Baskets', category: 'vetements', unit: 'paire', defaultPrice: 6000000, brand: 'Nike', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Baskets' },
  { nameFr: 'Sac à main femme', nameWolof: 'Sac', category: 'vetements', unit: 'pièce', defaultPrice: 5000000, brand: 'Élégance Dakar', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Sac+main' },
  { nameFr: 'Sac à dos', nameWolof: 'Sac bu kanam', category: 'vetements', unit: 'pièce', defaultPrice: 4000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Sac+dos' },
  { nameFr: 'Chapeau homme', nameWolof: 'Chapeau', category: 'vetements', unit: 'pièce', defaultPrice: 1500000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Chapeau' },
  { nameFr: 'Casquette', nameWolof: 'Casquette', category: 'vetements', unit: 'pièce', defaultPrice: 1000000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Casquette' },
  { nameFr: 'Écharpe laine', nameWolof: 'Écharpe', category: 'vetements', unit: 'pièce', defaultPrice: 1500000, brand: 'Dakar Mode', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Echarpe' },
  { nameFr: 'Gants cuir', nameWolof: 'Gants cuir', category: 'vetements', unit: 'paire', defaultPrice: 2000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Gants+cuir' },
  { nameFr: 'Lunettes de soleil', nameWolof: 'Lunettes', category: 'vetements', unit: 'pièce', defaultPrice: 2500000, brand: 'Ray-Ban', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Lunettes' },
  { nameFr: 'Montre homme', nameWolof: 'Montre', category: 'vetements', unit: 'pièce', defaultPrice: 8000000, brand: 'Casio', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Montre+H' },
  { nameFr: 'Montre femme', nameWolof: 'Montre jigéen', category: 'vetements', unit: 'pièce', defaultPrice: 6000000, brand: 'Casio', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Montre+F' },
  { nameFr: 'Bijoux fantaisie (lot)', nameWolof: 'Bijoux', category: 'vetements', unit: 'lot', defaultPrice: 3000000, brand: 'Artisan Sénégal', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Bijoux' },
];

// ===== NEW: DÉTAILLANT (30 products) =====
const detaillantProducts = [
  { nameFr: 'Sachet plastique 100 pièces', nameWolof: 'Sachet', category: 'detaillant', unit: 'lot', defaultPrice: 200000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Sachet' },
  { nameFr: 'Sac kraft 50 pièces', nameWolof: 'Sac kraft', category: 'detaillant', unit: 'lot', defaultPrice: 500000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Sac+kraft' },
  { nameFr: 'Boîte carton 20 pièces', nameWolof: 'Boîte carton', category: 'detaillant', unit: 'lot', defaultPrice: 800000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Boite+carton' },
  { nameFr: 'Étiquettes prix (rouleau)', nameWolof: 'Étiquettes', category: 'detaillant', unit: 'rouleau', defaultPrice: 300000, brand: 'Avery', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Etiquettes' },
  { nameFr: 'Caisse enregistreuse portable', nameWolof: 'Caisse', category: 'detaillant', unit: 'pièce', defaultPrice: 50000000, brand: 'Casio', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Caisse' },
  { nameFr: 'Balance commerciale 30kg', nameWolof: 'Balance', category: 'detaillant', unit: 'pièce', defaultPrice: 5000000, brand: 'Kern', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Balance' },
  { nameFr: 'Balance de précision 5kg', nameWolof: 'Balance bu ndaw', category: 'detaillant', unit: 'pièce', defaultPrice: 3000000, brand: 'Kern', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Balance+5kg' },
  { nameFr: 'Présentoir tournant', nameWolof: 'Présentoir', category: 'detaillant', unit: 'pièce', defaultPrice: 8000000, brand: 'Mobilier Dakar', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Presentoir' },
  { nameFr: 'Étagère métallique 5 niveaux', nameWolof: 'Étagère métal', category: 'detaillant', unit: 'pièce', defaultPrice: 15000000, brand: 'Mobilier Dakar', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Etagere+metal' },
  { nameFr: 'Vitrine réfrigérée', nameWolof: 'Vitrine', category: 'detaillant', unit: 'pièce', defaultPrice: 200000000, brand: 'Hisense', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Vitrine+frigo' },
  { nameFr: 'Congélateur coffre 200L', nameWolof: 'Congélateur', category: 'detaillant', unit: 'pièce', defaultPrice: 150000000, brand: 'Hisense', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Congelateur' },
  { nameFr: 'Réfrigérateur 150L', nameWolof: 'Réfrigérateur', category: 'detaillant', unit: 'pièce', defaultPrice: 120000000, brand: 'Samsung', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Frigo' },
  { nameFr: 'Comptoir vitrine bois', nameWolof: 'Comptoir', category: 'detaillant', unit: 'pièce', defaultPrice: 50000000, brand: 'Mobilier Dakar', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Comptoir' },
  { nameFr: 'Tabouret vendeur', nameWolof: 'Tabouret', category: 'detaillant', unit: 'pièce', defaultPrice: 3000000, brand: 'Mobilier Dakar', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Tabouret' },
  { nameFr: 'Calculatrice de caisse', nameWolof: 'Calculatrice caisse', category: 'detaillant', unit: 'pièce', defaultPrice: 1000000, brand: 'Casio', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Calc+caisse' },
  { nameFr: 'Rouleau papier thermique (lot 10)', nameWolof: 'Papier thermique', category: 'detaillant', unit: 'lot', defaultPrice: 500000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Papier+therm' },
  { nameFr: 'Stylo bille (lot 12)', nameWolof: 'Stylo', category: 'detaillant', unit: 'lot', defaultPrice: 200000, brand: 'Bic', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Stylo' },
  { nameFr: 'Cahier de caisse', nameWolof: 'Cahier', category: 'detaillant', unit: 'pièce', defaultPrice: 200000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Cahier' },
  { nameFr: 'Tampon encreur', nameWolof: 'Tampon', category: 'detaillant', unit: 'pièce', defaultPrice: 500000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Tampon' },
  { nameFr: 'Agrafeuse de bureau', nameWolof: 'Agrafeuse', category: 'detaillant', unit: 'pièce', defaultPrice: 500000, brand: 'Rapid', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Agrafeuse' },
  { nameFr: 'Scotch transparent (lot 5)', nameWolof: 'Scotch', category: 'detaillant', unit: 'lot', defaultPrice: 300000, brand: 'Scotch', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Scotch+lot' },
  { nameFr: 'Ciseaux de bureau', nameWolof: 'Ciseaux', category: 'detaillant', unit: 'pièce', defaultPrice: 200000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Ciseaux' },
  { nameFr: 'Panneau publicitaire A4', nameWolof: 'Panneau', category: 'detaillant', unit: 'pièce', defaultPrice: 1000000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Panneau' },
  { nameFr: 'Enseigne lumineuse LED', nameWolof: 'Enseigne', category: 'detaillant', unit: 'pièce', defaultPrice: 20000000, brand: 'TechPower', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Enseigne+LED' },
  { nameFr: 'Miroir de boutique', nameWolof: 'Miroir boutique', category: 'detaillant', unit: 'pièce', defaultPrice: 5000000, brand: 'Mobilier Dakar', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Miroir+boutique' },
  { nameFr: 'Cintre (lot 20)', nameWolof: 'Cintre', category: 'detaillant', unit: 'lot', defaultPrice: 500000, brand: 'Produits Locaux', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Cintre' },
  { nameFr: 'Portant vêtements roulant', nameWolof: 'Portant', category: 'detaillant', unit: 'pièce', defaultPrice: 8000000, brand: 'Mobilier Dakar', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Portant' },
  { nameFr: 'Mannequin de vitrine', nameWolof: 'Mannequin', category: 'detaillant', unit: 'pièce', defaultPrice: 10000000, brand: 'Mobilier Dakar', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Mannequin' },
  { nameFr: 'Cabine d\'essayage portable', nameWolof: 'Cabine', category: 'detaillant', unit: 'pièce', defaultPrice: 15000000, brand: 'Mobilier Dakar', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Cabine' },
  { nameFr: 'Caméra de surveillance', nameWolof: 'Caméra', category: 'detaillant', unit: 'pièce', defaultPrice: 25000000, brand: 'Hikvision', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Camera' },
];

const allProducts = [...existingProducts, ...pretAPorterProducts, ...vetementsProducts, ...detaillantProducts];

async function main() {
  console.log('🌱 Starting seed...');
  console.log(`📦 Inserting ${allProducts?.length} products...`);

  // Clear existing products
  await prisma?.defaultProduct?.deleteMany();

  // Insert all products in batches
  for (const product of allProducts) {
    await prisma?.defaultProduct?.create({ data: product });
  }

  console.log(`✅ Seeded ${allProducts?.length} products successfully!`);

  // Create demo accounts
  const bcrypt = await import('bcryptjs');

  // Admin
  const adminHash = await bcrypt?.hash('admin123', 12);
  await prisma?.user?.upsert({
    where: { email: 'pauledoux@protonmail.com' },
    update: { passwordHash: adminHash },
    create: { email: 'pauledoux@protonmail.com', passwordHash: adminHash, role: 'ADMIN' },
  });
  console.log('✅ Admin: pauledoux@protonmail.com / admin123');

  // Vendor demo
  const vendorHash = await bcrypt?.hash('vendor123', 12);
  const vendorUser = await prisma?.user?.upsert({
    where: { email: 'vendeur@bor-bi.com' },
    update: { passwordHash: vendorHash },
    create: { email: 'vendeur@bor-bi.com', phone: '+221771234567', passwordHash: vendorHash, role: 'VENDOR' },
  });
  await prisma?.vendor?.upsert({
    where: { userId: vendorUser?.id },
    update: {},
    create: { userId: vendorUser?.id, businessName: 'Boutique Amadou', phone: '+221771234567', location: 'Dakar, Sénégal' },
  });
  console.log('✅ Vendor: vendeur@bor-bi.com / vendor123');

  // Wholesaler demo
  const wholesalerHash = await bcrypt?.hash('wholesaler123', 12);
  const wholesalerUser = await prisma?.user?.upsert({
    where: { email: 'grossiste@bor-bi.com' },
    update: { passwordHash: wholesalerHash },
    create: { email: 'grossiste@bor-bi.com', phone: '+221779876543', passwordHash: wholesalerHash, role: 'WHOLESALER' },
  });
  await prisma?.wholesaler?.upsert({
    where: { userId: wholesalerUser?.id },
    update: {},
    create: { userId: wholesalerUser?.id, businessName: 'Grossiste Diallo & Fils', phone: '+221779876543', location: 'Dakar, Sénégal', currency: 'XOF', featured: true },
  });
  console.log('✅ Wholesaler: grossiste@bor-bi.com / wholesaler123');

  // Legacy demo accounts
  const legacyVendorHash = await bcrypt?.hash('Demo@2026!', 12);
  const legacyVendorUser = await prisma?.user?.upsert({
    where: { email: 'demo@borbi.sn' },
    update: {},
    create: { email: 'demo@borbi.sn', phone: '+221771111111', passwordHash: legacyVendorHash, role: 'VENDOR' },
  });
  await prisma?.vendor?.upsert({
    where: { userId: legacyVendorUser?.id },
    update: {},
    create: { userId: legacyVendorUser?.id, businessName: 'Boutique Demo', phone: '+221771111111', location: 'Dakar, Sénégal' },
  });

  console.log(`\n🎉 Seed completed!`);
  console.log(`📊 Total products: ${allProducts?.length}`);
  console.log(`   - Existing categories: ${existingProducts?.length}`);
  console.log(`   - Prêt-à-porter: ${pretAPorterProducts?.length}`);
  console.log(`   - Vêtements: ${vetementsProducts?.length}`);
  console.log(`   - Détaillant: ${detaillantProducts?.length}`);
}

main()?.catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
})?.finally(async () => {
  await prisma?.$disconnect();
});
