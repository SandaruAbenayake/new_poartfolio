import React from "react";

function A11yOverlay({ profile, projects }) {
  return (
    <div id="a11y-overlay" className="sr-only">
      <nav aria-label="Main navigation">
        <a href="#hero">Hero</a>
        <a href="#about">About</a>
        <a href="#work">Selected Work</a>
        <a href="#contact">Contact</a>
      </nav>

      <main>
        <section id="hero" aria-label="Hero">
          <h1>{profile.name}</h1>
          <p>{profile.tagline}</p>
        </section>

        <section id="about" aria-label="About">
          <h2>About</h2>
          <p>{profile.about}</p>
        </section>

        <section id="work" aria-label="Selected Work">
          <h2>Selected Work</h2>
          {projects.map((project) => (
            <article key={project.uid}>
              <h3>{project.title}</h3>
              <p>{project.subtitle}</p>
              <p>{project.description}</p>
              <p>{project.tags.join(", ")}</p>
              <a href={project.url}>{project.title} project link</a>
            </article>
          ))}
        </section>

        <section id="contact" aria-label="Contact">
          <h2>Contact</h2>
          <a href={`mailto:${profile.contact.email}`}>Email</a>
          <a href={profile.contact.whatsapp}>WhatsApp: {profile.contact.phone}</a>
          <a href={profile.contact.github}>GitHub</a>
          <a href={profile.contact.linkedin}>LinkedIn</a>
        </section>
      </main>
    </div>
  );
}

export default A11yOverlay;
