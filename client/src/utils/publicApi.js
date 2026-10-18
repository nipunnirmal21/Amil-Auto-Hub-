import { apiBase } from '../data/business';

const apiUrl = path => `${apiBase}/api${path}`;

export function resolvePublicMedia(value) {
  if (!value || /^(https?:|blob:|data:)/i.test(value)) return value;
  if (value.startsWith('/api/')) return `${apiBase}${value}`;
  return value;
}

export function normalizeApiProduct(product) {
  const category = product.category || {};
  const subcategory = product.subcategory || {};
  const categoryName = category.name || 'Automotive Parts';
  const categorySlug = category.slug || '';
  const subcategorySlug = subcategory.slug || '';
  const mainImage = resolvePublicMedia(product.mainImage);
  const gallery = (product.images || []).map(resolvePublicMedia).filter(Boolean);
  const priceValue = Number(product.price) || 0;

  return {
    ...product,
    id: product._id || product.id,
    image: mainImage,
    images: [...new Set([mainImage, ...gallery].filter(Boolean))],
    priceValue,
    price: `LKR ${priceValue.toLocaleString('en-LK')}`,
    category: categoryName,
    categoryIds: categorySlug ? [categorySlug] : [],
    subcategoryIds: categorySlug && subcategorySlug ? [`${categorySlug}:${subcategorySlug}`] : [],
    partNumber: product.sku || '',
    availability: product.stockStatus || 'Contact for confirmation',
    features: product.features || [],
    specifications: product.specifications || {},
  };
}

async function readJson(path) {
  const endpoint = apiUrl(path);
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(12000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Unable to load storefront data.');
    error.status = response.status;
    error.endpoint = endpoint;
    throw error;
  }
  return data;
}

export async function fetchPublicProducts() {
  const data = await readJson('/products');
  return (data.products || []).map(normalizeApiProduct);
}

export async function fetchPublicProduct(slug) {
  const data = await readJson(`/products/${encodeURIComponent(slug)}`);
  return normalizeApiProduct(data.product);
}

export async function fetchPublicCategories() {
  const data = await readJson('/categories');
  return data.categories || [];
}

export async function fetchCurrentBillboard() {
  const data = await readJson('/billboard/current');
  return data.billboard ? { ...data.billboard, image: resolvePublicMedia(data.billboard.image) } : null;
}

export async function fetchPublishedBillboards() {
  const data = await readJson('/billboards/history');
  if (!Array.isArray(data.billboards)) throw new Error('The billboard history response was not in the expected format.');
  return data.billboards.map(billboard => ({
    ...billboard,
    image: resolvePublicMedia(billboard.image),
  }));
}
