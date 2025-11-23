import React, { useState, useEffect } from "react";
import { getProgramFilters, getPrograms } from "../../services/programsService"; // Corrected import path

function ProgramFilterSection({ onSearchResults = null, showResults = false }) {
  const [filters, setFilters] = useState({
    locations: ["Any location"],
    ageGroups: ["All ages"], 
    types: ["Any type"],
  });
  const [selectedLocation, setSelectedLocation] = useState("Any location");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All ages");
  const [selectedType, setSelectedType] = useState("Any type");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  // Fetch filter options from backend using the service
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const filterData = await getProgramFilters();
        
        setFilters({
          locations: ["Any location", ...filterData.locations],
          ageGroups: ["All ages", ...filterData.ageGroups],
          types: ["Any type", ...filterData.types],
        });
      } catch (err) {
        setError(err.message);
        console.error("Failed to load filters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Handle form submission using the getPrograms service
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare API parameters (skip "Any" values)
      const params = {};
      
      if (selectedLocation !== "Any location") {
        params.city = selectedLocation;
      }
      
      if (selectedAgeGroup !== "All ages") {
        params.ageGroup = selectedAgeGroup;
      }
      
      if (selectedType !== "Any type") {
        params.type = selectedType;
      }

      console.log("Searching with params:", params);
      
      // Use the service function to fetch programs
      const results = await getPrograms(params);
      setSearchResults(results);
      
      // Pass results to parent component if callback provided
      if (onSearchResults) {
        onSearchResults(results);
      }
      
      console.log("Search results:", results);
    } catch (err) {
      setError(err.message);
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedLocation("Any location");
    setSelectedAgeGroup("All ages");
    setSelectedType("Any type");
    setSearchResults(null);
    setError(null);
    
    // Notify parent of reset
    if (onSearchResults) {
      onSearchResults(null);
    }
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

        {error && (
          <div className="alert alert--error" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <form className="program-filter" onSubmit={handleSubmit}>
          <div className="program-filter__fields">
            <div className="field">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
            <button 
              type="submit" 
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search programs"}
            </button>
            
            <button
              type="button"
              className="link-button"
              onClick={() => {
                // Navigate to full programs page
                window.location.href = '/programs';
              }}
            >
              View full catalog →
            </button>
            
            {(selectedLocation !== "Any location" || 
              selectedAgeGroup !== "All ages" || 
              selectedType !== "Any type") && (
              <button
                type="button"
                className="link-button"
                onClick={resetFilters}
                style={{ marginLeft: '1rem' }}
              >
                Reset filters
              </button>
            )}
          </div>
        </form>

        {/* Display search results if enabled */}
        {showResults && searchResults && (
          <div className="search-results" style={{ marginTop: '3rem' }}>
            <h3>Search Results ({searchResults.total} programs found)</h3>
            
            {searchResults.data.length === 0 ? (
              <p>No programs found matching your criteria.</p>
            ) : (
              <div className="programs-grid">
                {searchResults.data.slice(0, 6).map((program) => (
                  <div key={program.id} className="program-card">
                    <h4>{program.title}</h4>
                    <p><strong>Location:</strong> {program.location}</p>
                    <p><strong>Type:</strong> {program.type}</p>
                    <p><strong>Age Group:</strong> {program.ageGroup}</p>
                    <p><strong>Start Date:</strong> {program.startDate}</p>
                    <p><strong>Price:</strong> {program.price} {program.currency}</p>
                  </div>
                ))}
                
                {searchResults.data.length > 6 && (
                  <div className="view-more">
                    <button 
                      className="btn btn--secondary"
                      onClick={() => window.location.href = '/programs'}
                    >
                      View all {searchResults.total} programs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProgramFilterSection;