import { NavLink } from "react-router-dom";
import { navItems } from "../data/nav";
import { currentOwner, getActivePet, moodOf } from "../data/mock";
import Clock from "./Clock";

// The persistent left rail: wordmark, primary nav, and a status box (clock,
// user, active pet, NP, search, language). Present on every page.

export default function Sidebar() {
  const owner = currentOwner;
  const activePet = getActivePet(owner);

  return (
    <aside className="sidebar">
      <NavLink to="/" className="wordmark">
        <span className="wordmark-lil">lil</span>
        <span className="wordmark-guys">guys</span>
      </NavLink>

      <nav className="nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
          >
            <span className="nav-glyph" aria-hidden="true">
              {item.glyph}
            </span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="status-box">
        <Clock />

        <dl className="status-lines">
          <div className="status-line">
            <dt>user</dt>
            <dd className="status-user">{owner.username}</dd>
          </div>
          <div className="status-line">
            <dt>pet</dt>
            <dd>
              {activePet.name} <span className="status-mood">({moodOf(activePet)})</span>
            </dd>
          </div>
          <div className="status-line">
            <dt>NP</dt>
            <dd className="status-np">{owner.np.toLocaleString()}</dd>
          </div>
        </dl>

        <form className="status-search" onSubmit={(e) => e.preventDefault()}>
          <input type="search" aria-label="search lilguys" placeholder="search" />
          <button type="submit">go!</button>
        </form>

        <form className="status-lang" onSubmit={(e) => e.preventDefault()}>
          <select aria-label="select language" defaultValue="en">
            <option value="en">english</option>
          </select>
          <button type="submit">go!</button>
        </form>
      </div>
    </aside>
  );
}
