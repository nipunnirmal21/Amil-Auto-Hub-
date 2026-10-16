const address = '278/4, High Level Road, Kottawa, Pannipitiya, Kottawa, Sri Lanka, 10230';

export const business = {
  name: 'Amil Auto Hub',
  tagline: 'We care for your vehicle.',
  phone: '077 370 0001',
  phoneInternational: '+94 77 370 0001',
  phoneLink: 'tel:+94773700001',
  whatsapp: '077 370 0001',
  whatsappLink: 'https://wa.me/94773700001',
  email: 'amilautohub@gmail.com',
  emailLink: 'mailto:amilautohub@gmail.com',
  address,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
  facebook: 'https://www.facebook.com/amilautohub',
  instagram: 'https://www.instagram.com/amilautohub',
  tiktok: 'https://www.tiktok.com/@amilautohub',
  website: 'https://amilautohub.com',
  category: 'Oil lube and filter service / Automotive parts and vehicle care',
  services: ['Delivery', 'In-store collection', 'In-store shopping'],
  logo: '/logo.png',
};
export const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const apiEnabled = import.meta.env.DEV || Boolean(import.meta.env.VITE_API_URL);
