export function ItemPrice({ price }: { price: number }) {
  function NIcon() {
    return (
      <img
        className="cat-n-icon"
        src="https://s3.akarinext.org/assets/*/pso2/n.webp"
        alt="n meseta"
      />
    );
  }

  return (
    <div className="cat-item-price-root">
      <p className="cat-item-price cat-text-ellipsis">
        売値 <NIcon /> {price / (1 - 0.1)}
      </p>
      <p className="cat-item-price cat-text-ellipsis">
        純売上 <NIcon /> {price}
      </p>
    </div>
  );
}
