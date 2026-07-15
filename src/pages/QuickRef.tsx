import { Link } from "react-router-dom";
import { useOwner, setActivePet } from "../data/store";
import PetAvatar from "../components/PetAvatar";
import PetStats from "../components/PetStats";

// Quick Ref — see all your lil guys at a glance. The active pet's name is bold;
// click a pet's picture to make it active; inactive pets render faded. Mirrors
// the classic quick-reference page, with our own layout and copy.

export default function QuickRef() {
  const owner = useOwner();

  return (
    <div className="page quick-ref">
      <div className="banner">
        <h1 className="banner-title">quick.ref</h1>
      </div>

      <p className="lead">
        every lil guy you own is here. the one whose name is <strong>bold</strong> is
        your <strong>active</strong> pet — the one you browse and play as. click a
        pet's <em>picture</em> to make it active.
      </p>

      <div className="quickref-pets">
        {owner.pets.map((pet) => {
          const isActive = pet.id === owner.activePetId;
          return (
            <section
              key={pet.id}
              className={isActive ? "quickref-pet is-active" : "quickref-pet"}
            >
              <div className="quickref-pet-head">
                <button
                  type="button"
                  className="quickref-pet-picture"
                  onClick={() => setActivePet(pet.id)}
                  aria-pressed={isActive}
                  title={isActive ? `${pet.name} is active` : `make ${pet.name} active`}
                >
                  <PetAvatar
                    species={pet.species}
                    colour={pet.colour}
                    name={pet.name}
                    size={88}
                    faded={!isActive}
                  />
                </button>

                <div className="quickref-pet-title">
                  <Link
                    to={`/pet/${pet.id}`}
                    className={isActive ? "quickref-pet-name is-active" : "quickref-pet-name"}
                  >
                    {pet.name}
                  </Link>
                  {isActive && <span className="quickref-active-tag">active</span>}
                  {pet.description && (
                    <p className="quickref-pet-desc">{pet.description}</p>
                  )}
                </div>
              </div>

              <PetStats pet={pet} />

              <p className="quickref-pet-links">
                <Link to={`/pet/${pet.id}`}>view page</Link>
                {" · "}
                <Link to="/neomail">belongings</Link>
              </p>
            </section>
          );
        })}
      </div>

      <p className="lead">
        want another? <Link to="/addpet">create a new lil guy</Link>.
      </p>
    </div>
  );
}
