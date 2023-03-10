export function ItemPrice({price}: {price: number}) {
  return (
    <div className="cat-item-price-root">
    <p className="cat-item-price">
      売値{" "}
      <img
      
        src="https:s3.akarinext.org/assets/*/pso2/n.webp"
        alt="n meseta"
      />{" "}
      {price / (1 - 0.1)}
    </p>
    <p className="cat-item-price">
      純売上
      <img
        src="https:s3.akarinext.org/assets/*/pso2/n.webp"
        alt="n meseta"
      />{" "}
      {price}
    </p>
  </div>
  )
}