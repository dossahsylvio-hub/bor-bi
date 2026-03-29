import { NextRequest, NextResponse } from 'next/server';

// Public endpoint - no auth required
// Returns sponsored products for homepage vitrine
// Ordered by homepageOrder ASC, active=true only

const MOCK_SPONSORED = [
  { id: '1', nameFr: 'Riz brisé 25kg', brand: 'Marque Sénégal', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Riz', category: 'epicerie', homepageOrder: 1 },
  { id: '2', nameFr: 'Huile végétale 5L', brand: 'Jumbo', imageUrl: 'https://placehold.co/150x150/8b5cf6/white?text=Huile', category: 'epicerie', homepageOrder: 2 },
  { id: '3', nameFr: 'Poulet PAC entier', brand: 'Avicole Sénégal', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Poulet', category: 'fraisProteines', homepageOrder: 3 },
  { id: '4', nameFr: 'Thiof frais', brand: 'Pêcherie Dakar', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Thiof', category: 'fraisProteines', homepageOrder: 4 },
  { id: '5', nameFr: 'Chemise homme', brand: 'Mode Dakar', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Chemise', category: 'pretAPorter', homepageOrder: 5 },
  { id: '6', nameFr: 'Tissu wax africain', brand: 'Wax Premium', imageUrl: 'https://placehold.co/150x150/f97316/white?text=Wax', category: 'vetements', homepageOrder: 6 },
  { id: '7', nameFr: 'Mangue', brand: 'Vergers du Sénégal', imageUrl: 'https://placehold.co/150x150/10b981/white?text=Mangue', category: 'fruitsLegumes', homepageOrder: 7 },
  { id: '8', nameFr: 'Jus de bissap', brand: 'Bissap Dakar', imageUrl: 'https://placehold.co/150x150/1e3a8a/white?text=Bissap', category: 'boissons', homepageOrder: 8 },
  { id: '9', nameFr: 'Savon de Marseille', brand: 'Hygiène Plus', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Savon', category: 'hygiene', homepageOrder: 9 },
  { id: '10', nameFr: 'Boubou homme', brand: 'Couture Dakar', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Boubou', category: 'pretAPorter', homepageOrder: 10 },
  { id: '11', nameFr: 'Marmite 10L', brand: 'Cuisine Pro', imageUrl: 'https://placehold.co/150x150/d97706/white?text=Marmite', category: 'ustensilesCuisine', homepageOrder: 11 },
  { id: '12', nameFr: 'Ciment Portland 50kg', brand: 'Sococim', imageUrl: 'https://placehold.co/150x150/57534e/white?text=Ciment', category: 'materiaux', homepageOrder: 12 },
  { id: '13', nameFr: 'Chaise plastique', brand: 'Mobilier Dakar', imageUrl: 'https://placehold.co/150x150/7c3aed/white?text=Chaise', category: 'mobilier', homepageOrder: 13 },
  { id: '14', nameFr: 'Marteau', brand: 'Stanley', imageUrl: 'https://placehold.co/150x150/78716c/white?text=Marteau', category: 'quincaillerie', homepageOrder: 14 },
  { id: '15', nameFr: 'Chargeur USB universel', brand: 'TechPower', imageUrl: 'https://placehold.co/150x150/0ea5e9/white?text=Chargeur', category: 'energieTech', homepageOrder: 15 },
  { id: '16', nameFr: 'Baguette tradition', brand: 'Boulangerie Centrale', imageUrl: 'https://placehold.co/150x150/f59e0b/white?text=Baguette', category: 'boulangerie', homepageOrder: 16 },
  { id: '17', nameFr: 'Robe femme casual', brand: 'Fashion Dakar', imageUrl: 'https://placehold.co/150x150/ec4899/white?text=Robe', category: 'pretAPorter', homepageOrder: 17 },
  { id: '18', nameFr: 'Balance commerciale', brand: 'Détail Pro', imageUrl: 'https://placehold.co/150x150/14b8a6/white?text=Balance', category: 'detaillant', homepageOrder: 18 },
  { id: '19', nameFr: 'Sardines fraîches', brand: 'Pêche Atlantique', imageUrl: 'https://placehold.co/150x150/ef4444/white?text=Sardines', category: 'fraisProteines', homepageOrder: 19 },
  { id: '20', nameFr: 'Lessive poudre 1kg', brand: 'Omo', imageUrl: 'https://placehold.co/150x150/6366f1/white?text=Lessive', category: 'hygiene', homepageOrder: 20 },
];

export async function GET(request: NextRequest) {
  // In production: query DB for active sponsored products ordered by homepageOrder
  // const products = await prisma.sponsoredProduct.findMany({ where: { active: true }, orderBy: { homepageOrder: 'asc' }, include: { defaultProduct: true } })

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  return NextResponse.json(MOCK_SPONSORED.slice(0, limit), {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
