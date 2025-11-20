import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getAcademies, getAcademyFilters } from "../services/academiesService";
import useAuthStore from "../store/authStore";

function AllProgramsPage() {
  const [searchParams] = useSearchParams();
  const [academies, setAcademies] = useState([]);
  const [filters, setFilters] = useState({
    cities: [],
    countries: [],
    status: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    city: searchParams.get("city") || "",
    country: searchParams.get("country") || "",
    status: searchParams.get("status") || "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userRole = useAuthStore((state) => state.user?.role);
  const isAdmin = userRole === "ADMIN";

  // Fetch filter options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getAcademyFilters();
        setFilters({
          cities: data.cities || [],
          countries: data.countries || [],
          status: data.status || [],
        });
      } catch (err) {
        console.error("Failed to fetch filters:", err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch academies
  useEffect(() => {
    const fetchAcademies = async () => {
      try {
        setLoading(true);
        const params = {
          page: pagination.page,
          pageSize: pagination.pageSize,
          sortBy: "name",
          sortDir: "asc",
          ...(selectedFilters.city && { city: selectedFilters.city }),
          ...(selectedFilters.country && { country: selectedFilters.country }),
          ...(selectedFilters.status && { status: selectedFilters.status }),
        };

        const response = await getAcademies(params);
        setAcademies(response.data || []);
        setPagination((prev) => ({
          ...prev,
          total: response.total || 0,
        }));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch academies:", err);
        setError("Failed to load academies");
        setAcademies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademies();
  }, [pagination.page, selectedFilters]);

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value === "Any" || value === "All" ? "" : value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDelete = async (academyId) => {
    if (!window.confirm("Are you sure you want to delete this academy?")) {
      return;
    }
    // TODO: Call DELETE /academies/:id when endpoint is ready
    console.log("Delete academy:", academyId);
  };

  const handleUpdate = (academyId) => {
    // TODO: Navigate to edit page when ready
    console.log("Update academy:", academyId);
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className="app-root">
      <Navbar />
      <main className="home">
        <section className="section section--programs">
          <div className="container">
            <header className="section-header">
              <p className="section-header__eyebrow">All Academies</p>
              <h2 className="section-header__title">
                Discover all available academies.
              </h2>
              <p className="section-header__subtitle">
                Browse through our complete catalog of academy locations and facilities.
              </p>
            </header>

            {/* Filters */}
            <div className="program-filter" style={{ marginBottom: "3rem" }}>
              <div className="program-filter__fields">
                <div className="field">
                  <label htmlFor="filter-city">City</label>
                  <select
                    id="filter-city"
                    value={selectedFilters.city || "Any"}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                  >
                    <option value="Any">Any city</option>
                    {filters.cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="filter-country">Country</label>
                  <select
                    id="filter-country"
                    value={selectedFilters.country || "Any"}
                    onChange={(e) => handleFilterChange("country", e.target.value)}
                  >
                    <option value="Any">Any country</option>
                    {filters.countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="filter-status">Status</label>
                  <select
                    id="filter-status"
                    value={selectedFilters.status || "Any"}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                  >
                    <option value="Any">Any status</option>
                    {filters.status.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <p>Loading academies...</p>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <p>{error}</p>
              </div>
            )}

            {/* Academies grid */}
            {!loading && !error && (
              <>
                <div className="featured-programs__grid">
                  {academies.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "3rem" }}>
                      No academies found matching your filters.
                    </p>
                  ) : (
                    academies.map((academy) => {
                      return (
                        <article key={academy.id} className="program-card">
                          <div className="program-card__image">
                            <div className="program-card__badge">
                              {academy.isActive ? "Active" : "Inactive"}
                            </div>
                          </div>

                          <div className="program-card__body">
                            <p className="program-card__tag">
                              {academy.city}, {academy.countryCode}
                            </p>
                            <h3 className="program-card__title">{academy.name}</h3>
                            <p className="program-card__description">
                              {academy.addressLine1 || "Address not available"}
                            </p>
                            {academy.phone && (
                              <p className="program-card__start">
                                📞 {academy.phone}
                              </p>
                            )}

                            <div className="program-card__actions">
                              <button className="btn btn--primary btn--sm">
                                View details
                              </button>
                              {isAdmin && (
                                <>
                                  <button
                                    className="btn btn--ghost btn--sm"
                                    onClick={() => handleUpdate(academy.id)}
                                  >
                                    Update
                                  </button>
                                  <button
                                    className="btn btn--ghost btn--sm"
                                    onClick={() => handleDelete(academy.id)}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>

                {/* Pagination */}
                {pagination.total > 6 && totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "3rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="btn btn--ghost"
                      disabled={pagination.page === 1}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                      }
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1);
                      
                      if (!showPage) {
                        // Show ellipsis
                        if (pageNum === pagination.page - 2 || pageNum === pagination.page + 2) {
                          return (
                            <span key={pageNum} style={{ padding: "0 0.5rem" }}>
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          className={`btn ${pageNum === pagination.page ? "btn--primary" : "btn--ghost"}`}
                          onClick={() =>
                            setPagination((prev) => ({ ...prev, page: pageNum }))
                          }
                          style={{ minWidth: "2.5rem" }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      className="btn btn--ghost"
                      disabled={pagination.page >= totalPages}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                      }
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AllProgramsPage;
