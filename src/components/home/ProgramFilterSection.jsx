import React, { useState } from "react";

function ProgramFilterSection() {
  // TODO: later these options should come from backend
  const [filters] = useState({
    locations: ["Any location", "Beirut", "Jounieh", "Tripoli"],
    ageGroups: ["All ages", "U8-U10", "U11-U13", "U14-U16", "U17-U18"],
    types: ["Any type", "Academy", "Clinic", "Tournament"],
  });

  const [selectedLocation, setSelectedLocation] = useState("Any location");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All ages");
  const [selectedType, setSelectedType] = useState("Any type");

  // Later this will trigger a real search (API call or navigation)
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Search with:", {
      location: selectedLocation,
      ageGroup: selectedAgeGroup,
      type: selectedType,
    });

    // TODO (backend connection idea):
    // fetch(`${import.meta.env.VITE_API_URL}/programs/search?location=...`)
    //   .then(res => res.json())
    //   .then(data => setPrograms(data))
    // For now, just log to console.
  };

  return (
    <section id="programs" className="section section--programs">
      <div className="container">
        <header className="section-header">
          <p className="section-header__eyebrow">Find a program</p>
          <h2 className="section-header__title">
            Discover programs by location and age group.
          </h2>
          <p className="section-header__subtitle">
            Choose a location, age band, and program type to find the perfect
            fit for your young wizard.
          </p>
        </header>

        <form className="program-filter" onSubmit={handleSubmit}>
          <div className="program-filter__fields">
            <div className="field">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {filters.locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="ageGroup">Age group</label>
              <select
                id="ageGroup"
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
              >
                {filters.ageGroups.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="type">Program type</label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {filters.types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="program-filter__actions">
            <button type="submit" className="btn btn--primary">
              Search programs
            </button>
            <button
              type="button"
              className="link-button"
              onClick={() => {
                // later: navigate to /programs or similar
                console.log("Go to full catalog");
              }}
            >
              View full catalog →
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ProgramFilterSection;
