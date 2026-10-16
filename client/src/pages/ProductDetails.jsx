import { ArrowLeft, Check, MessageCircle, PackageCheck, Store, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductSpecifications from '../components/ProductSpecifications';
import RelatedProducts from '../components/RelatedProducts';
import { apiEnabled, business } from '../data/business';
import demoProducts from '../data/demoProducts';
import { buildProductInquiry, buildWhatsAppInquiryUrl } from '../utils/cartInquiry';
import { fetchPublicProduct, fetchPublicProducts } from '../utils/publicApi';

const defaultTitle = 'Amil Auto Hub | Vehicle Spare Parts Sri Lanka';
const defaultDescription = 'Amil Auto Hub provides quality vehicle spare parts, automotive products and friendly customer service in Sri Lanka.';
const serviceIcons = [Truck, PackageCheck, Store];

export default function ProductDetails() {
  const { slug } = useParams();
  const fallbackProduct = demoProducts.find(item => item.slug === slug);
  const [product, setProduct] = useState(fallbackProduct);
  const [catalog, setCatalog] = useState(demoProducts);
  const [loading, setLoading] = useState(apiEnabled && !fallbackProduct);

  useEffect(() => {
    const fallback = demoProducts.find(item => item.slug === slug);
    setProduct(fallback);
    setCatalog(demoProducts);
    if (!apiEnabled) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    setLoading(!fallback);
    fetchPublicProduct(slug)
      .then(item => { if (active) setProduct(item); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    fetchPublicProducts()
      .then(items => { if (active) setCatalog(items); })
      .catch(() => {});
    return () => { active = false; };
  }, [slug, fallbackProduct]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return catalog.filter(item => (
      item.id !== product.id && (
        item.category === product.category
        || item.brand === product.brand
        || item.categoryIds?.some(categoryId => product.categoryIds?.includes(categoryId))
      )
    )).slice(0, 4);
  }, [catalog, product]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const descriptionMeta = document.querySelector('meta[name="description"]');
    document.title = product ? `${product.name} | Amil Auto Hub` : 'Product Not Found | Amil Auto Hub';
    descriptionMeta?.setAttribute(
      'content',
      product ? `${product.shortDescription} Contact Amil Auto Hub to confirm availability and compatibility.` : defaultDescription,
    );
    return () => {
      document.title = defaultTitle;
      descriptionMeta?.setAttribute('content', defaultDescription);
    };
  }, [product]);

  if (loading) {
    return <div className="product-not-found container"><span>PRODUCT CATALOGUE</span><h1>Loading product…</h1></div>;
  }

  if (!product) {
    return (
      <div className="product-not-found container">
        <span>PRODUCT CATALOGUE</span>
        <h1>Product not found.</h1>
        <p>This product may no longer be available, or the address may be incorrect.</p>
        <div>
          <Link className="product-details-add" to="/#products"><ArrowLeft size={18} /> Back to Products</Link>
          <Link className="product-details-outline" to="/#contact">Contact Amil Auto Hub</Link>
        </div>
      </div>
    );
  }

  const compatibilityUrl = buildWhatsAppInquiryUrl(
    business.whatsappLink,
    buildProductInquiry(product, business.name),
  );

  return (
    <div className="product-details-page">
      <div className="container product-details-container">
        <nav className="product-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/#top">Home</Link><span aria-hidden="true">/</span>
          <Link to="/#products">Products</Link><span aria-hidden="true">/</span>
          <span>{product.category}</span><span aria-hidden="true">/</span>
          <strong aria-current="page">{product.name}</strong>
        </nav>

        <Link className="back-to-products" to="/#products"><ArrowLeft size={16} /> Back to Products</Link>

        <section className="product-details-hero" aria-labelledby="product-title">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </section>

        <div className="product-details-content">
          <section className="product-detail-block">
            <div className="product-details-section-heading">
              <span>PRODUCT OVERVIEW</span>
              <h2>Description</h2>
            </div>
            <p>{product.description}</p>
            <p className="product-warranty"><strong>Warranty information:</strong> {product.warranty}</p>
          </section>

          <section className="product-detail-block">
            <div className="product-details-section-heading">
              <span>AT A GLANCE</span>
              <h2>Features</h2>
            </div>
            <ul className="product-feature-list">
              {product.features.map(feature => <li key={feature}><Check size={17} />{feature}</li>)}
            </ul>
          </section>

          <section className="product-detail-block product-detail-block--full">
            <div className="product-details-section-heading">
              <span>PRODUCT INFORMATION</span>
              <h2>Specifications</h2>
            </div>
            <ProductSpecifications product={product} />
          </section>
        </div>

        <section className="compatibility-panel">
          <div className="compatibility-panel__icon"><PackageCheck size={30} /></div>
          <div>
            <span>VEHICLE COMPATIBILITY</span>
            <h2>Not sure whether this part fits your vehicle?</h2>
            <p>{product.vehicleCompatibility} We will help you check compatibility.</p>
          </div>
          <a href={compatibilityUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={19} /> Check Compatibility on WhatsApp
          </a>
        </section>

        <section className="delivery-panel">
          <div className="product-details-section-heading">
            <span>HOW TO RECEIVE YOUR ORDER</span>
            <h2>Delivery &amp; Collection</h2>
          </div>
          <div className="delivery-options">
            {business.services.map((service, index) => {
              const Icon = serviceIcons[index] || Store;
              return <div key={service}><Icon size={23} /><strong>{service}</strong></div>;
            })}
          </div>
          <p>Availability and delivery options may vary by product. Contact Amil Auto Hub to confirm before ordering.</p>
        </section>

        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}
