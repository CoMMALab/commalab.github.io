---
layout: page
permalink: /publications/
title: Publications
description:
nav: true
nav_order: 2
---

<style>
.filter-buttons {
  margin-bottom: 2rem;
  text-align: center;
}

.filter-btn {
  margin: 0.25rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--global-theme-color);
  background-color: transparent;
  color: var(--global-theme-color);
  cursor: pointer;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background-color: var(--global-theme-color);
  color: var(--global-bg-color);
}

.filter-btn.active {
  background-color: var(--global-theme-color);
  color: var(--global-bg-color);
}
</style>

<div class="publications">
* indicates equal contribution.

<div class="filter-buttons">
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="article">Journal Articles</button>
  <button class="filter-btn" data-filter="inproceedings">Conference Papers</button>
  <button class="filter-btn" data-filter="misc">Preprints</button>
</div>

{% bibliography --file papers %}

</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const publicationEntries = document.querySelectorAll('.bibliography li');

  // Extract entry type from BibTeX code block
  publicationEntries.forEach(function(entry) {
    const bibtexDiv = entry.querySelector('.bibtex code');
    if (bibtexDiv) {
      const bibtexText = bibtexDiv.textContent;
      // Extract the entry type (e.g., @article, @inproceedings, @misc)
      const typeMatch = bibtexText.match(/@(\w+)\s*\{/);
      if (typeMatch) {
        const entryType = typeMatch[1].toLowerCase();
        // Map entry types to filter categories
        if (entryType === 'article') {
          entry.setAttribute('data-type', 'article');
        } else if (entryType === 'inproceedings' || entryType === 'incollection' || entryType === 'inbook') {
          entry.setAttribute('data-type', 'inproceedings');
        } else if (entryType === 'misc') {
          entry.setAttribute('data-type', 'misc');
        } else {
          entry.setAttribute('data-type', 'other');
        }
      }
    }
  });

  // Handle filter button clicks
  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');

      // Filter entries
      publicationEntries.forEach(function(entry) {
        const entryType = entry.getAttribute('data-type');
        if (filter === 'all' || entryType === filter) {
          entry.style.display = '';
        } else {
          entry.style.display = 'none';
        }
      });
    });
  });
});
</script>
