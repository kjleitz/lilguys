import { Link } from "react-router-dom";
import { navItems } from "../data/nav";
import { currentOwner, getActivePet, moodOf } from "../data/mock";

// The hub. Dense, friendly, link-forward — the first place you land, and the
// jumping-off point to everything else. Original lilguys copy and layout.

export default function PetCentral() {
  const owner = currentOwner;
  const activePet = getActivePet(owner);

  // Everything except Pet Central itself becomes a hub tile.
  const tiles = navItems.filter((item) => item.to !== "/");

  return (
    <div className="page pet-central">
      <div className="banner">
        <h1 className="banner-title">pet.central</h1>
      </div>

      <p className="lead">
        <strong>welcome back, {owner.username}!</strong> this is your home base — you
        can do just about anything lilguy-related from here.
      </p>

      <section className="active-pet-card">
        <div className="active-pet-avatar" aria-hidden="true">
          {activePet.name.charAt(0)}
        </div>
        <div className="active-pet-info">
          <h2>{activePet.name}</h2>
          <p className="active-pet-species">
            level {activePet.level} {activePet.species} · {moodOf(activePet)}
          </p>
          <div className="stat-bars">
            <StatBar label="hunger" value={activePet.hunger} />
            <StatBar label="health" value={activePet.health} />
            <StatBar label="happy" value={activePet.happiness} />
          </div>
        </div>
      </section>

      <h3 className="section-heading">where to?</h3>
      <div className="tile-grid">
        {tiles.map((tile) => (
          <Link key={tile.to} to={tile.to} className="tile">
            <span className="tile-glyph" aria-hidden="true">
              {tile.glyph}
            </span>
            <span className="tile-label">{tile.label}</span>
            <span className="tile-blurb">{tile.blurb}</span>
          </Link>
        ))}
      </div>

      <hr className="rule" />

      <dl className="totals">
        <div>
          <dt>total owners</dt>
          <dd>1</dd>
        </div>
        <div>
          <dt>total lil guys</dt>
          <dd>{owner.pets.length}</dd>
        </div>
      </dl>
    </div>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="stat-bar">
      <span className="stat-bar-label">{label}</span>
      <span className="stat-bar-track">
        <span className="stat-bar-fill" style={{ width: `${clamped}%` }} />
      </span>
      <span className="stat-bar-value">{clamped}</span>
    </div>
  );
}
