---
layout: default
title: Home
---

<section class="hero">
  <div class="hero-top">
    <div class="hero-copy">
      <div class="hero-name">Andrew Johnson</div>
      <div class="hero-role">Senior Software Engineer – Frontend / Full-stack</div>
    </div>
    <div class="hero-actions">
      <a class="action-button primary" href="{{ "ajohnson_resume.pdf" | relative_url }}" download="ajohnson_resume.pdf">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM8 12h8v1.8H8V12zm0 4h8v1.8H8V16z"/></svg>
        View Resume
      </a>
      <a class="action-button" href="mailto:drew_johnson@me.com">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v.01l8 5 8-5V8H4zm0 2.3V16h16v-5.7l-7.4 4.6a1.2 1.2 0 0 1-1.2 0L4 10.3z"/></svg>
        Contact
      </a>
      <a class="action-button" href="https://github.com/astral-matrix" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.9c-2.9.6-3.5-1.3-3.5-1.3-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1 3 0 .1-.6.3-1 .6-1.3-2.3-.2-4.7-1.1-4.7-4.8 0-1 .4-1.9 1-2.6-.1-.2-.4-1.2.1-2.5 0 0 .8-.2 2.6 1a9 9 0 0 1 4.8 0c1.8-1.2 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.5.7.7 1 1.6 1 2.6 0 3.7-2.4 4.6-4.7 4.8.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2z"/></svg>
        GitHub
      </a>
    </div>

  </div>
  <div class="hero-description">
  I specialize in building performant web applications with React, TypeScript, and Node.js.<br>
  I'm passionate about developer tooling and AI integrations.
</div>
</section>

<section class="featured">
  <h2 class="section-title">Featured Projects</h2>
  <p class="section-subtitle">Selected software engineering work</p>

  <div class="carousel" data-carousel>
    <div class="carousel-controls">
      <button class="carousel-button" type="button" data-carousel-prev aria-label="Scroll projects left">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 5.5 9 12l6.5 6.5-1.4 1.4L6.2 12l7.9-7.9z"/></svg>
      </button>
      <button class="carousel-button" type="button" data-carousel-next aria-label="Scroll projects right">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.5 5.5 1.4-1.4L17.8 12l-7.9 7.9-1.4-1.4L15 12z"/></svg>
      </button>
    </div>

    <div class="carousel-track" data-carousel-track>
      {% assign projects_page = site.pages | where: "name", "projects.md" | first %}
      {% assign projects = projects_page.projects %}
      {% for project in projects %}
      <a href="{{ "/projects/" | append: project.id | relative_url }}?from=home" class="project-card">
        <h3 class="project-title">{{ project.title }}</h3>
        <img src="{{ project.card_image | relative_url }}" alt="{{ project.card_alt }}">
        <p class="project-summary">{{ project.card_summary }}</p>
        <div class="skill-pills">
          {% for tag in project.tags %}
          <span>{{ tag }}</span>
          {% endfor %}
        </div>
        <div class="project-meta">
          {% if project.meta_left %}<span>{{ project.meta_left }}</span>{% endif %}
          <span>{{ project.meta_right }} &rarr;</span>
        </div>
      </a>
      {% endfor %}
    </div>

  </div>
</section>
