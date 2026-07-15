import { Link, useParams } from "react-router-dom";
import { getHub } from "../data/shops";
import ShopMap from "../components/ShopMap";

// A shopping hub page: Neopia Central (the top hub, at /shops) or one of its
// districts (/shops/bazaar, /shops/plaza). Renders the hub's map — a
// placeholder-with-hotspots until we have the real map art — over which the
// shops and sub-hubs are reachable. Browsing only; nothing is bought here.

export default function ShopsHub() {
  const { hubId = "central" } = useParams();
  const hub = getHub(hubId);

  if (!hub) {
    return (
      <div className="page">
        <div className="banner">
          <h1 className="banner-title">no such district</h1>
        </div>
        <p className="lead">
          that shopping district doesn't exist. <Link to="/shops">back to neopia central →</Link>
        </p>
      </div>
    );
  }

  const isDistrict = hub.id !== "central";

  return (
    <div className="page shops-hub">
      {isDistrict && (
        <nav className="shop-crumbs" aria-label="breadcrumb">
          <Link to="/shops">neopia central</Link>
          <span aria-hidden="true"> / </span>
          <span>{hub.name}</span>
        </nav>
      )}

      <div className="banner">
        <h1 className="banner-title">{hub.name}</h1>
      </div>

      <p className="lead">{hub.blurb}</p>

      <ShopMap hub={hub} />
    </div>
  );
}
