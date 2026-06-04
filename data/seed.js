export const marketTable = {
  'Honda Civic': 95000,
  'Toyota Corolla': 108000,
  'Chevrolet Onix': 72000,
  'Hyundai HB20': 69000,
  'Volkswagen Gol': 46000,
  'Jeep Compass': 151000,
  'Fiat Pulse': 89000,
  'Nissan Kicks': 112000,
};

export const initialCars = [
  {
    id: 1,
    ownerId: 100,
    ownerName: 'Auto Prime',
    model: 'Honda Civic',
    brand: 'Honda',
    year: 2020,
    km: 52000,
    city: 'Campinas, SP',
    price: 93000,
    marketPrice: 95000,
    acceptsTrade: true,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80',
    description: 'Civic completo, revisado, automático, pneus bons e documentação em dia.'
  },
  {
    id: 2,
    ownerId: 101,
    ownerName: 'Marina Souza',
    model: 'Toyota Corolla',
    brand: 'Toyota',
    year: 2021,
    km: 41000,
    city: 'São Paulo, SP',
    price: 110000,
    marketPrice: 108000,
    acceptsTrade: true,
    image: 'https://images.unsplash.com/photo-1623013438264-d9d5f02bf0fd?auto=format&fit=crop&w=1200&q=80',
    description: 'Corolla conservado, único dono, ideal para família e viagens.'
  },
  {
    id: 3,
    ownerId: 102,
    ownerName: 'Rafael Lima',
    model: 'Chevrolet Onix',
    brand: 'Chevrolet',
    year: 2022,
    km: 26000,
    city: 'Valinhos, SP',
    price: 70500,
    marketPrice: 72000,
    acceptsTrade: false,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80',
    description: 'Onix econômico, multimídia, baixa quilometragem e ótimo para cidade.'
  }
];
