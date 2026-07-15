import { Link, useParams } from "react-router-dom";
import { useOwner, setActivePet } from "../data/store";
import PetAvatar from "../components/PetAvatar";
import PetStats from "../components/PetStats";

// A single lil guy's page: big picture, full stat readout, and description.
// (The public "lookup" layout comes when we capture it; this is the owner view.)

export default function PetPage() {
  const { petId } = useParams();
  const owner = useOwner();
  const pet = owner.pets.find((p) => p.id === petId);

  if (!pet) {
    return (
      <div className="page pet-page">
        <div className="banner">
          <h1 className="banner-title">no such lil guy</h1>
        </div>
        <p className="lead">
          we couldn't find that pet. <Link to="/quickref">back to quick ref</Link>.
        </p>
      </div>
    );
  }

  const isActive = pet.id === owner.activePetId;

  return (
    <div className="page pet-page">
      <div className="banner">
        <h1 className="banner-title">{pet.name}</h1>
      </div>

      <div className="pet-page-body">
        <div className="pet-page-portrait">
          <PetAvatar
            species={pet.species}
            colour={pet.colour}
            name={pet.name}
            size={140}
          />
          {isActive ? (
            <span className="quickref-active-tag">active pet</span>
          ) : (
            <button
              type="button"
              className="btn"
              onClick={() => setActivePet(pet.id)}
            >
              make active
            </button>
          )}
        </div>

        <div className="pet-page-info">
          {pet.description ? (
            <p className="lead">{pet.description}</p>
          ) : (
            <p className="lead pet-page-nodesc">no description yet.</p>
          )}
          <PetStats pet={pet} />
        </div>
      </div>

      <p className="lead">
        <Link to="/quickref">← back to quick ref</Link>
      </p>
    </div>
  );
}
