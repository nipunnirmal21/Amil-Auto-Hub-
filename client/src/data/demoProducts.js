// Temporary showcase data only. Replace this file when the real catalogue is ready.
const productSummaries = [
  { id: 1, name: 'Castrol MAGNATEC 5W-30 Engine Oil 4L', category: 'Lubricants', categoryIds: ['engine-oils'], subcategoryIds: ['engine-oils:engine-oil'], brand: 'Castrol', priceValue: 9980, price: 'LKR 9,980', image: '/products/castrol-magnatec-5w30.jpg', stockStatus: 'In Stock', featured: true },
  { id: 2, name: 'Toyota Oil Filter', category: 'Filters', categoryIds: ['filters'], subcategoryIds: ['filters:oil-filters'], brand: 'Toyota', priceValue: 1850, price: 'LKR 1,850', image: '/products/engine-oil-filter.jpg', stockStatus: 'In Stock', featured: true },
  { id: 3, name: 'Shell Helix HX8 5W-40 Engine Oil 4L', category: 'Lubricants', categoryIds: ['engine-oils'], subcategoryIds: ['engine-oils:engine-oil'], brand: 'Shell', priceValue: 10500, price: 'LKR 10,500', image: '/products/shell-helix-hx8.jpg', stockStatus: 'In Stock', featured: true },
  // Denso blocks direct media downloads; this local illustration is intentionally retained as a marked fallback.
  { id: 4, name: 'Denso Iridium Spark Plug', category: 'Ignition', categoryIds: ['engine-parts', 'electrical-parts'], subcategoryIds: ['engine-parts:spark-plugs', 'electrical-parts:ignition-components'], brand: 'Denso', priceValue: 2450, price: 'LKR 2,450', image: '/images/products/electrical.svg', imageFallback: true, stockStatus: 'In Stock', featured: true },
  { id: 5, name: 'Bosch Brake Pads', category: 'Brakes', categoryIds: ['brake-parts'], subcategoryIds: ['brake-parts:brake-pads'], brand: 'Bosch', priceValue: 18900, price: 'LKR 18,900', image: '/images/products/brakes.svg', imageFallback: true, stockStatus: 'In Stock', featured: true },
  { id: 6, name: 'NGK Spark Plug Set', category: 'Ignition', categoryIds: ['engine-parts', 'electrical-parts'], subcategoryIds: ['engine-parts:spark-plugs', 'electrical-parts:ignition-components'], brand: 'NGK', priceValue: 7900, price: 'LKR 7,900', image: '/products/ngk-spark-plug.jpg', stockStatus: 'In Stock', featured: false },
  { id: 7, name: 'Valvoline Engine Oil 4L', category: 'Lubricants', categoryIds: ['engine-oils'], subcategoryIds: ['engine-oils:engine-oil'], brand: 'Valvoline', priceValue: 11500, price: 'LKR 11,500', image: '/images/products/fluids.svg', imageFallback: true, stockStatus: 'In Stock', featured: false },
  { id: 8, name: 'Toyota ATF Transmission Fluid', category: 'Lubricants', categoryIds: ['engine-oils'], subcategoryIds: ['engine-oils:transmission-oil'], brand: 'Toyota', priceValue: 13900, price: 'LKR 13,900', image: '/images/products/fluids.svg', imageFallback: true, stockStatus: 'In Stock', featured: false },
  { id: 9, name: 'Cabin Air Filter', category: 'Filters', categoryIds: ['filters'], subcategoryIds: ['filters:cabin-filters'], brand: 'Mann', priceValue: 6200, price: 'LKR 6,200', image: '/images/products/filter.svg', imageFallback: true, stockStatus: 'In Stock', featured: false },
  { id: 10, name: 'Engine Air Filter', category: 'Filters', categoryIds: ['filters'], subcategoryIds: ['filters:air-filters'], brand: 'Denso', priceValue: 5800, price: 'LKR 5,800', image: '/images/products/filter.svg', imageFallback: true, stockStatus: 'In Stock', featured: false },
  { id: 11, name: 'Long Life Coolant 4L', category: 'Cooling', categoryIds: ['cooling-system', 'engine-oils'], subcategoryIds: ['cooling-system:coolant', 'engine-oils:coolant'], brand: 'Toyota', priceValue: 9800, price: 'LKR 9,800', image: '/images/products/fluids.svg', imageFallback: true, stockStatus: 'In Stock', featured: false },
  { id: 12, name: 'DOT 4 Brake Fluid', category: 'Brakes', categoryIds: ['brake-parts', 'engine-oils'], subcategoryIds: ['brake-parts:brake-fluid', 'engine-oils:brake-fluid'], brand: 'Mobil', priceValue: 4900, price: 'LKR 4,900', image: '/images/products/fluids.svg', imageFallback: true, stockStatus: 'In Stock', featured: false },
  { id: 13, name: 'Wiper Blade Set', category: 'Accessories', categoryIds: ['vehicle-accessories'], subcategoryIds: ['vehicle-accessories:wiper-blades'], brand: 'Bosch', priceValue: 8500, price: 'LKR 8,500', image: '/images/products/mechanical.svg', imageFallback: true, stockStatus: 'In Stock', featured: false },
  { id: 14, name: 'Maintenance-Free Car Battery', category: 'Electrical', categoryIds: ['batteries', 'electrical-parts'], subcategoryIds: [], brand: 'Amaron', priceValue: 39500, price: 'LKR 39,500', image: '/products/car-battery.jpg', stockStatus: 'In Stock', featured: true },
  { id: 15, name: 'Timing Belt Kit', category: 'Engine Parts', categoryIds: ['engine-parts'], subcategoryIds: ['engine-parts:timing-belts', 'engine-parts:timing-kits', 'engine-parts:belts'], brand: 'Gates', priceValue: 32500, price: 'LKR 32,500', image: '/images/products/mechanical.svg', imageFallback: true, stockStatus: 'In Stock', featured: true },
  { id: 16, name: 'Front Wheel Bearing', category: 'Drivetrain', categoryIds: ['suspension-parts'], subcategoryIds: ['suspension-parts:wheel-bearings'], brand: 'Koyo', priceValue: 14900, price: 'LKR 14,900', image: '/images/products/mechanical.svg', imageFallback: true, stockStatus: 'In Stock', featured: false },
  { id: 17, name: 'Gas Shock Absorber', category: 'Suspension', categoryIds: ['suspension-parts'], subcategoryIds: ['suspension-parts:shock-absorbers'], brand: 'KYB', priceValue: 24500, price: 'LKR 24,500', image: '/images/products/mechanical.svg', imageFallback: true, stockStatus: 'In Stock', featured: false },
  { id: 18, name: 'Clutch Plate', category: 'Transmission', categoryIds: [], subcategoryIds: [], brand: 'Exedy', priceValue: 28900, price: 'LKR 28,900', image: '/images/products/mechanical.svg', imageFallback: true, stockStatus: 'Low Stock', featured: false },
  { id: 19, name: 'Upper Radiator Hose', category: 'Cooling', categoryIds: ['cooling-system'], subcategoryIds: ['cooling-system:radiator-hoses'], brand: 'Gates', priceValue: 7500, price: 'LKR 7,500', image: '/images/products/mechanical.svg', imageFallback: true, stockStatus: 'In Stock', featured: false },
  { id: 20, name: 'Hydraulic Engine Mount', category: 'Engine Parts', categoryIds: ['engine-parts'], subcategoryIds: ['engine-parts:engine-mounts'], brand: 'Febest', priceValue: 17800, price: 'LKR 17,800', image: '/images/products/mechanical.svg', imageFallback: true, stockStatus: 'Low Stock', featured: false },
];

const specificDetails = {
  1: { specifications: { Volume: '4L', Type: 'Engine oil' } },
  3: { specifications: { Volume: '4L', Type: 'Engine oil' } },
  4: { specifications: { Type: 'Spark plug' } },
  6: { specifications: { Type: 'Spark plug set' } },
  7: { specifications: { Volume: '4L', Type: 'Engine oil' } },
  8: { specifications: { Type: 'Transmission fluid' } },
  11: { specifications: { Volume: '4L', Type: 'Coolant' } },
  12: { specifications: { Type: 'Brake fluid' } },
};

const createSlug = name => name
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const demoProducts = productSummaries.map(product => {
  const details = specificDetails[product.id] || {};
  return {
    ...product,
    slug: createSlug(product.name),
    images: [product.image],
    shortDescription: `${product.name} is included in our demo catalogue for product, availability, and compatibility enquiries.`,
    description: `This is a demo listing for ${product.name}. Contact Amil Auto Hub to confirm the exact product details, current availability, and suitability for your vehicle before ordering.`,
    features: [
      'Available for product and availability enquiries',
      'Compatibility support is available before purchase',
      'Delivery or in-store collection options can be confirmed with Amil Auto Hub',
    ],
    specifications: {
      Brand: product.brand,
      Category: product.category,
      'Stock status': product.stockStatus,
      ...details.specifications,
    },
    vehicleCompatibility: 'Check with Amil Auto Hub before purchase. Please provide your vehicle make, model, and year.',
    partNumber: 'Demo',
    warranty: 'Please contact Amil Auto Hub for warranty information.',
    availability: 'Contact for confirmation',
  };
});

export default demoProducts;
