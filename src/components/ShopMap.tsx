import { Link } from "react-router-dom";
import type { ShopHub } from "../data/shops";

// A hub's shopping map. On the reference site this is one big graphic with
// clickable regions (an image map). We don't have the art, so:
//
//   - No mapImage (today): render a labelled placeholder banner plus a tile
//     grid of the destinations — fully navigable, just not pretty.
//   - With a mapImage (later): render the image and lay each destination's
//     `hotspot` over it as an absolutely-positioned link. Wiring the art in is
//     then just data — set `mapImage` and add `hotspot` coords in shops.ts.

export default function ShopMap({ hub }: { hub: ShopHub }) {
  if (hub.mapImage) {
    return (
      <div className="shop-map">
        <img className="shop-map-image" src={hub.mapImage} alt={`map of ${hub.name}`} />
        {hub.destinations.map((dest) =>
          dest.hotspot ? (
            <Link
              key={dest.to}
              to={dest.to}
              className="shop-map-hotspot"
              style={{
                left: `${dest.hotspot.x}%`,
                top: `${dest.hotspot.y}%`,
                width: `${dest.hotspot.w}%`,
                height: `${dest.hotspot.h}%`,
              }}
              aria-label={dest.label}
              title={dest.label}
            />
          ) : null,
        )}
      </div>
    );
  }

  return (
    <>
      <div className="shop-map-placeholder" role="img" aria-label={`map of ${hub.name} (art coming soon)`}>
        <span className="shop-map-placeholder-caption">
          {hub.name} map — art coming soon
        </span>
      </div>

      <div className="shop-dest-grid">
        {hub.destinations.map((dest) => (
          <Link key={dest.to} to={dest.to} className="shop-dest">
            <span className="shop-dest-glyph" aria-hidden="true">
              {dest.glyph}
            </span>
            <span className="shop-dest-label">{dest.label}</span>
            <span className="shop-dest-blurb">{dest.blurb}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
