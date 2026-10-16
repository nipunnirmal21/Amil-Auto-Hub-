import { useEffect, useMemo, useState } from 'react';

export default function ProductGallery({ product }) {
  const images = useMemo(
    () => [...new Set(product.images?.length ? product.images : [product.image])],
    [product.image, product.images],
  );
  const [selectedImage, setSelectedImage] = useState(images[0]);

  useEffect(() => setSelectedImage(images[0]), [images]);

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        {product.featured && <span className="product-gallery__badge">Popular product</span>}
        <img src={selectedImage} alt={product.name} />
      </div>
      {images.length > 1 && (
        <div className="product-gallery__thumbnails" aria-label={`${product.name} images`}>
          {images.map((image, index) => (
            <button
              className={selectedImage === image ? 'is-selected' : ''}
              type="button"
              key={image}
              aria-label={`Show image ${index + 1} of ${product.name}`}
              aria-pressed={selectedImage === image}
              onClick={() => setSelectedImage(image)}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
