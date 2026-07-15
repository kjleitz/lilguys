import { Link, useParams } from "react-router-dom";
import { getShop, shopItemCount, PURCHASING_ENABLED, type Shop, type ShopItem } from "../data/shops";
import PlaceholderArt from "../components/PlaceholderArt";

// An NPC shop front: the shopkeeper, a greeting, and a grid of items with
// prices and stock. This mirrors the reference /viewshop/ layout. Buying is
// intentionally off — browsing runs on the mock catalog and no NP moves until
// Phase 4 (see PURCHASING_ENABLED). Each item's "buy" is disabled with a note.

/** A small, stable inflation figure per shop, so the market feels alive. */
function inflationPct(shop: Shop): string {
  let hash = 0;
  for (const char of shop.id) hash = (hash * 31 + char.charCodeAt(0)) % 1000;
  return (0.5 + (hash % 250) / 100).toFixed(2); // 0.50%–2.99%
}

export default function ShopFront() {
  const { shopId = "" } = useParams();
  const shop = getShop(shopId);

  if (!shop) {
    return (
      <div className="page">
        <div className="banner">
          <h1 className="banner-title">shop not found</h1>
        </div>
        <p className="lead">
          that shop isn't here. <Link to="/shops">back to neopia central →</Link>
        </p>
      </div>
    );
  }

  const hubPath = shop.hub === "central" ? "/shops" : `/shops/${shop.hub}`;

  return (
    <div className="page shop-front">
      <nav className="shop-crumbs" aria-label="breadcrumb">
        <Link to="/shops">neopia central</Link>
        <span aria-hidden="true"> / </span>
        <Link to={hubPath}>{shop.hub === "central" ? "central" : shop.hub}</Link>
        <span aria-hidden="true"> / </span>
        <span>{shop.name}</span>
      </nav>

      <div className="banner">
        <h1 className="banner-title">{shop.name}</h1>
      </div>

      <section className="shop-keeper">
        <PlaceholderArt glyph={shop.keeperGlyph} tint={shop.tint} size={120} label={`${shop.name} shopkeeper`} round />
        <div className="shop-keeper-text">
          <p className="shop-greeting">{shop.greeting}</p>
          <p className="shop-inflation">
            neopian inflation is currently at <b>{inflationPct(shop)}%</b> · {shopItemCount(shop)} items in stock
          </p>
        </div>
      </section>

      {!PURCHASING_ENABLED && (
        <p className="shop-note" role="note">
          👀 browsing only for now — actually buying items arrives in a later update.
        </p>
      )}

      <ul className="item-grid">
        {shop.items.map((item) => (
          <ItemCell key={item.id} item={item} shopName={shop.name} />
        ))}
      </ul>
    </div>
  );
}

function ItemCell({ item, shopName }: { item: ShopItem; shopName: string }) {
  const soldOut = item.stock <= 0;
  return (
    <li className="item-cell">
      <PlaceholderArt glyph={item.glyph} size={80} label={item.name} />
      <span className="item-name">{item.name}</span>
      <span className="item-blurb">{item.blurb}</span>
      <span className="item-stock">{soldOut ? "sold out" : `${item.stock} in stock`}</span>
      <span className="item-price">{item.price.toLocaleString()} NP</span>
      <button
        type="button"
        className="btn item-buy"
        disabled
        title={`buying isn't available yet — you'll be able to purchase ${item.name} from ${shopName} in a later update`}
      >
        buy
      </button>
    </li>
  );
}
