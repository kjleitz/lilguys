import { Link } from "react-router-dom";
import { navItems } from "../data/nav";
import { getActivePet } from "../data/mock";
import { useOwner } from "../data/store";
import { healthFraction, moodLabel } from "../data/stats";
import PetAvatar from "../components/PetAvatar";

// The hub. Dense, friendly, link-forward — the first place you land, and the
// jumping-off point to everything else. Original lilguys copy and layout.

export default function PetCentral() {
  const owner = useOwner();
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
        <Link to={`/pet/${activePet.id}`} className="active-pet-avatar-link">
          <PetAvatar
            species={activePet.species}
            colour={activePet.colour}
            name={activePet.name}
            size={64}
          />
        </Link>
        <div className="active-pet-info">
          <h2>
            <Link to={`/pet/${activePet.id}`}>{activePet.name}</Link>
          </h2>
          <p className="active-pet-species">
            level {activePet.level} {activePet.colour} {activePet.species} ·{" "}
            {moodLabel(activePet)}
          </p>
          <div className="stat-bars">
            <StatBar label="health" value={healthFraction(activePet) * 100} />
            <StatBar label="hunger" value={activePet.hunger} />
            <StatBar label="happy" value={activePet.happiness} />
          </div>
        </div>
        <Link to="/quickref" className="active-pet-quickref">
          quick ref →
        </Link>
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
  const clamped = Math.round(Math.max(0, Math.min(100, value)));
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
