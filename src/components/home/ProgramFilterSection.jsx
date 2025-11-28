// src/components/home/ProgramFilterSection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProgramFilters } from "../../services/programsService";

function ProgramFilterSection() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    locations: [],
    ageGroups: [],
    types: [],
  });

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [loading, setLoading] = useState(true);

  // Load filter options from backend (so only real DB values appear)
  useEffect(() => {
    async function loadFilters() {
      try {
        const data = await getProgramFilters();
        setFilters({
          locations: data.locations || [],
          ageGroups: data.ageGroups || [],
          types: data.types || [],
        });
      } catch (err) {
        console.error("Failed to load filters:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFilters();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build query string with only selected filters
    const params = new URLSearchParams();
    if (selectedLocation) params.set("city", selectedLocation);
    if (selectedAgeGroup) params.set("ageGroup", selectedAgeGroup);
    if (selectedType) params.set("type", selectedType);

    // Go to /programs with the filters in the URL
    const query = params.toString();
    navigate(query ? `/programs?${query}` : "/programs");
  };

  const handleViewFullCatalog = () => {
    // No filters: just navigate to /programs
    navigate("/programs");
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
            {/* LOCATION */}
            <div className="field">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Any location</option>
                {!loading &&
                  filters.locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
              </select>
            </div>

            {/* AGE GROUP */}
            <div className="field">
              <label htmlFor="ageGroup">Age group</label>
              <select
                id="ageGroup"
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
              >
                <option value="">All ages</option>
                {!loading &&
                  filters.ageGroups.map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
              </select>
            </div>

            {/* TYPE */}
            <div className="field">
              <label htmlFor="type">Program type</label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Any type</option>
                {!loading &&
                  filters.types.map((t) => (
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
              onClick={handleViewFullCatalog}
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
