import React from "react";

function HighlightsStrip() {
  const highlights = [
    "Professional coaching staff and structured training cycles.",
    "Age-specific programs from U8 up to U18.",
    "Safe, supportive environment focused on player growth.",
    "Clear communication for parents: schedules, updates, and news.",
  ];

  return (
    <section className="highlights">
      <div className="container highlights__inner">
        {highlights.map((item, index) => (
          <div key={index} className="highlights__item">
            <div className="highlights__badge">
              <span>★</span>
            </div>
            <p className="highlights__text">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HighlightsStrip;
