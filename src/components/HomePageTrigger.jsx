import React from "react";

const sections = ["Hero", "About", "Work", "Contact"];

function HomePageTrigger() {
  return (
    <div className="scroll-spacer" aria-hidden="true">
      {sections.map((section) => (
        <div className="scroll-section-marker" key={section} />
      ))}
    </div>
  );
}

export default HomePageTrigger;
