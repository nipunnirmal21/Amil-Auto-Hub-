export default function ProductSpecifications({ product }) {
  const specifications = {
    ...product.specifications,
    'Part number / SKU': product.partNumber,
    Availability: product.availability,
  };

  return (
    <div className="product-specifications">
      {Object.entries(specifications).map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </div>
  );
}
