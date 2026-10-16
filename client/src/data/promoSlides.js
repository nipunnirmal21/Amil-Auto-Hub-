const promoSlides = [
  {
    id: 'engine-oils',
    theme: 'oils',
    badge: 'GENUINE PARTS',
    title: 'PREMIUM ENGINE OILS',
    highlight: 'FOR A SMOOTHER RIDE',
    benefits: [
      { icon: 'shield', lines: ['Engine', 'Protection'] },
      { icon: 'gauge', lines: ['Better', 'Performance'] },
      { icon: 'settings', lines: ['Longer', 'Engine Life'] },
    ],
    images: [
      { src: '/products/castrol-magnatec-5w30.jpg', className: 'promo-product--castrol' },
      { src: '/products/shell-helix-hx8.jpg', className: 'promo-product--shell' },
    ],
  },
  {
    id: 'filters',
    theme: 'filters',
    badge: 'QUALITY PARTS',
    title: 'KEEP YOUR ENGINE',
    highlight: 'RUNNING CLEAN',
    benefits: [
      { icon: 'wind', lines: ['Cleaner', 'Air Flow'] },
      { icon: 'filter', lines: ['Better', 'Filtration'] },
      { icon: 'gauge', lines: ['Reliable', 'Performance'] },
    ],
    images: [
      { src: '/products/engine-oil-filter.jpg', className: 'promo-product--filter-photo' },
      { src: '/images/products/filter.svg', className: 'promo-product--filter-art' },
    ],
  },
  {
    id: 'brakes',
    theme: 'brakes',
    badge: 'DRIVE WITH CONFIDENCE',
    title: 'QUALITY BRAKE PARTS',
    highlight: 'FOR SAFER DRIVING',
    benefits: [
      { icon: 'shield', lines: ['Reliable', 'Braking'] },
      { icon: 'gauge', lines: ['Better', 'Control'] },
      { icon: 'check', lines: ['Trusted', 'Parts'] },
    ],
    images: [
      { src: '/images/products/brakes.svg', className: 'promo-product--brakes-primary' },
      { src: '/images/products/brakes.svg', className: 'promo-product--brakes-secondary' },
    ],
  },
];

export default promoSlides;
