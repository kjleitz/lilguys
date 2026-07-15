import { Link, useLocation } from "react-router-dom";
import { navItems } from "../data/nav";

// A walkable placeholder for every nav destination we haven't built yet, so
// the skeleton is fully navigable. Reads its title from the nav config by path.

export default function ComingSoon() {
  const { pathname } = useLocation();
  const item = navItems.find((n) => n.to === pathname);
  const label = item?.label ?? "this page";

  return (
    <div className="page coming-soon">
      <div className="banner">
        <h1 className="banner-title">{label}</h1>
      </div>
      <p className="lead">
        <strong>{label}</strong> is still hatching. {item?.blurb ?? ""} — coming soon.
      </p>
      <p>
        <Link to="/">← back to pet central</Link>
      </p>
    </div>
  );
}
