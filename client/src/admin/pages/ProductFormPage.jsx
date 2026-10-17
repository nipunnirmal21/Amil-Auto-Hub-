import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ImagePlus, Save, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';
import { apiRequest, resolveMediaUrl } from '../adminApi';

const emptyForm = {
  name: '', slug: '', brand: '', price: '', stockQuantity: '0', category: '', subcategory: '',
  shortDescription: '', description: '', sku: '', vehicleCompatibility: '', warranty: '',
  featuresText: '', specificationsText: '', featured: false, active: true,
};

const toSlug = value => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function specificationsFromText(value) {
  return Object.fromEntries(value.split('\n').map(line => line.split(':')).filter(parts => parts.length >= 2).map(([key, ...rest]) => [key.trim(), rest.join(':').trim()]).filter(([key]) => key));
}

function referenceId(value) {
  if (!value) return '';
  return typeof value === 'string' ? value : String(value._id || value.id || '');
}

export default function ProductFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { token, user } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [existingMainImage, setExistingMainImage] = useState('');
  const [existingGallery, setExistingGallery] = useState([]);
  const [status, setStatus] = useState({ loading: editing, saving: false, error: '' });
  const [categoryStatus, setCategoryStatus] = useState({ loading: true, error: '' });

  useEffect(() => {
    if (!editing) return undefined;
    let active = true;
    apiRequest(`/admin/products/${id}`, { token }).then(({ product }) => {
      if (!active) return;
      const specs = product.specifications || {};
      setForm({
        name: product.name || '', slug: product.slug || '', brand: product.brand || '', price: String(product.price ?? ''),
        stockQuantity: String(product.stockQuantity ?? 0), category: referenceId(product.category), subcategory: referenceId(product.subcategory),
        shortDescription: product.shortDescription || '', description: product.description || '', sku: product.sku || '',
        vehicleCompatibility: product.vehicleCompatibility || '', warranty: product.warranty || '',
        featuresText: (product.features || []).join('\n'),
        specificationsText: Object.entries(specs).map(([key, value]) => `${key}: ${value}`).join('\n'),
        featured: Boolean(product.featured), active: Boolean(product.active),
      });
      setExistingMainImage(product.mainImage || '');
      setExistingGallery(product.images || []);
      setStatus({ loading: false, saving: false, error: '' });
    }).catch(error => {
      if (active) setStatus({ loading: false, saving: false, error: error.message });
    });
    return () => { active = false; };
  }, [id, editing, token]);

  const loadCategories = async () => {
    setCategoryStatus({ loading: true, error: '' });
    try {
      const data = await apiRequest('/admin/categories', { token });
      if (!Array.isArray(data.categories)) throw new Error('The categories response was not in the expected format.');
      setCategories(data.categories.filter(category => category?._id && category?.name));
      setCategoryStatus({ loading: false, error: '' });
    } catch (error) {
      setCategories([]);
      setCategoryStatus({ loading: false, error: error.message });
    }
  };

  useEffect(() => { loadCategories(); }, [token]);

  const selectedCategory = categories.find(category => String(category._id) === String(form.category));
  const subcategories = Array.isArray(selectedCategory?.subcategories) ? selectedCategory.subcategories : [];
  const categoryUnavailable = categoryStatus.loading || Boolean(categoryStatus.error) || categories.length === 0;
  const stockStatus = Number(form.stockQuantity) === 0 ? 'Out of Stock' : Number(form.stockQuantity) <= 5 ? 'Low Stock' : 'In Stock';
  const mainPreview = useMemo(() => mainImage ? URL.createObjectURL(mainImage) : resolveMediaUrl(existingMainImage), [mainImage, existingMainImage]);

  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));
  const submit = async event => {
    event.preventDefault();
    if (categoryUnavailable) {
      setStatus(current => ({ ...current, error: categoryStatus.error || 'Create a main category before saving a product.' }));
      return;
    }
    if (!form.name || !form.category || form.price === '' || form.stockQuantity === '' || (!mainImage && !existingMainImage)) {
      setStatus(current => ({ ...current, error: 'Complete all required fields, including the main product image.' }));
      return;
    }
    if (Number(form.price) < 0 || Number(form.stockQuantity) < 0) {
      setStatus(current => ({ ...current, error: 'Price and stock quantity cannot be negative.' }));
      return;
    }
    setStatus(current => ({ ...current, saving: true, error: '' }));
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (!['featuresText', 'specificationsText'].includes(key)) body.append(key, String(value));
    });
    body.set('slug', form.slug || toSlug(form.name));
    body.append('features', JSON.stringify(form.featuresText.split('\n').map(value => value.trim()).filter(Boolean)));
    body.append('specifications', JSON.stringify(specificationsFromText(form.specificationsText)));
    body.append('retainedImages', JSON.stringify(existingGallery));
    if (mainImage) body.append('mainImage', mainImage);
    galleryImages.forEach(image => body.append('images', image));
    try {
      await apiRequest(editing ? `/admin/products/${id}` : '/admin/products', { token, method: editing ? 'PUT' : 'POST', body });
      navigate('/admin/products');
    } catch (error) {
      setStatus(current => ({ ...current, saving: false, error: error.message }));
    }
  };

  if (status.loading) return <p className="admin-loading">Loading product form…</p>;

  const categoryPlaceholder = categoryStatus.loading
    ? 'Loading categories…'
    : categoryStatus.error
      ? 'Categories unavailable'
      : categories.length === 0
        ? 'No categories available'
        : 'Select category';

  return <div><div className="admin-page-heading"><div><span>CATALOGUE</span><h1>{editing ? 'Edit Product' : 'Add New Product'}</h1><p>{editing ? 'Update product information and availability.' : 'Create a product for the public storefront.'}</p></div><Link className="admin-button admin-button--ghost" to="/admin/products"><ArrowLeft size={18} />Back</Link></div>{status.error && <p className="admin-alert admin-alert--error" role="alert">{status.error}</p>}<form className="admin-product-form" onSubmit={submit}><section className="admin-panel"><div className="admin-panel__heading"><h2>Core information</h2><p>Required fields are marked with an asterisk.</p></div><div className="admin-form-grid"><label>Product name *<input required value={form.name} onChange={event => { update('name', event.target.value); if (!editing && !form.slug) update('slug', toSlug(event.target.value)); }} /></label><label>Slug *<input required value={form.slug} onChange={event => update('slug', toSlug(event.target.value))} /></label><label>Brand<input value={form.brand} onChange={event => update('brand', event.target.value)} /></label><label>SKU / Part number<input value={form.sku} onChange={event => update('sku', event.target.value)} /></label><label>Main category *<select required value={form.category} disabled={categoryUnavailable} aria-invalid={Boolean(categoryStatus.error)} aria-describedby="main-category-status" onChange={event => setForm(current => ({ ...current, category: event.target.value, subcategory: '' }))}><option value="" disabled>{categoryPlaceholder}</option>{categories.map(category => <option value={category._id} key={category._id}>{category.name}</option>)}</select><small id="main-category-status" className={categoryStatus.error ? 'admin-field-status admin-field-status--error' : 'admin-field-status'} aria-live="polite">{categoryStatus.loading && 'Loading categories from the catalogue…'}{categoryStatus.error && <>Could not load categories: {categoryStatus.error} <button type="button" onClick={loadCategories}>Retry</button></>}{!categoryStatus.loading && !categoryStatus.error && categories.length === 0 && <>No categories available. {user?.role === 'Admin' ? <Link to="/admin/categories">Create a category first.</Link> : 'Ask an administrator to create one first.'}</>}</small></label><label>Subcategory<select value={form.subcategory} onChange={event => update('subcategory', event.target.value)} disabled={!selectedCategory}><option value="">{selectedCategory ? (subcategories.length ? 'No subcategory' : 'No subcategories available') : 'Select a main category first'}</option>{subcategories.map(item => <option value={item._id} key={item._id}>{item.name}</option>)}</select></label><label>Price (LKR) *<input required type="number" min="0" step="0.01" value={form.price} onChange={event => update('price', event.target.value)} /></label><label>Stock quantity *<input required type="number" min="0" step="1" value={form.stockQuantity} onChange={event => update('stockQuantity', event.target.value)} /><small>Calculated status: <strong>{stockStatus}</strong></small></label></div></section><section className="admin-panel"><div className="admin-panel__heading"><h2>Product images</h2><p>JPEG, PNG, or WebP. Maximum 5 MB per image.</p></div><div className="admin-image-fields"><label className="admin-image-upload"><ImagePlus /><strong>Main image *</strong><span>{mainImage?.name || (existingMainImage ? 'Replace current image' : 'Choose image')}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setMainImage(event.target.files[0] || null)} /></label>{mainPreview && <img className="admin-main-image-preview" src={mainPreview} alt="Main product preview" />}<label className="admin-image-upload"><ImagePlus /><strong>Gallery images</strong><span>{galleryImages.length ? `${galleryImages.length} selected` : `${6 - existingGallery.length} slots available`}</span><input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={event => setGalleryImages([...event.target.files].slice(0, Math.max(0, 6 - existingGallery.length)))} /></label></div>{existingGallery.length > 0 && <div className="admin-gallery-list" aria-label="Existing gallery images">{existingGallery.map(image => <div key={image}><img src={resolveMediaUrl(image)} alt="Existing product gallery" /><button type="button" aria-label="Remove gallery image" onClick={() => setExistingGallery(items => items.filter(item => item !== image))}><X size={15} /></button></div>)}</div>}</section><section className="admin-panel"><div className="admin-panel__heading"><h2>Descriptions and fitment</h2></div><div className="admin-form-grid"><label className="admin-field-full">Short description<textarea rows="2" value={form.shortDescription} onChange={event => update('shortDescription', event.target.value)} /></label><label className="admin-field-full">Full description<textarea rows="5" value={form.description} onChange={event => update('description', event.target.value)} /></label><label className="admin-field-full">Vehicle compatibility<textarea rows="3" value={form.vehicleCompatibility} onChange={event => update('vehicleCompatibility', event.target.value)} /></label><label>Features <small>One feature per line</small><textarea rows="5" value={form.featuresText} onChange={event => update('featuresText', event.target.value)} /></label><label>Specifications <small>One “Name: Value” per line</small><textarea rows="5" value={form.specificationsText} onChange={event => update('specificationsText', event.target.value)} /></label><label className="admin-field-full">Warranty information<textarea rows="2" value={form.warranty} onChange={event => update('warranty', event.target.value)} /></label></div><div className="admin-check-row"><label><input type="checkbox" checked={form.featured} onChange={event => update('featured', event.target.checked)} />Featured product</label><label><input type="checkbox" checked={form.active} onChange={event => update('active', event.target.checked)} />Active on storefront</label></div></section><div className="admin-form-actions"><Link className="admin-button admin-button--ghost" to="/admin/products">Cancel</Link><button className="admin-button admin-button--primary" type="submit" disabled={status.saving || categoryUnavailable}><Save size={18} />{status.saving ? 'Saving…' : 'Save Product'}</button></div></form></div>;
}
