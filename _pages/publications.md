---
layout: page
permalink: /publications/
title: Publications
description:
nav: true
nav_order: 2
---

<style>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.filter-btn {
  margin: 0;
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

#publication-search {
  padding: 0.5rem 1rem;
  border: 2px solid var(--global-theme-color);
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--global-bg-color);
  color: var(--global-text-color);
  min-width: 200px;
}

#publication-search:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--global-theme-color);
}

#publication-search::placeholder {
  color: var(--global-text-color);
  opacity: 0.5;
}
</style>

<div class="publications">

<div class="filter-bar">
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="article">Journals</button>
  <button class="filter-btn" data-filter="inproceedings">Conferences</button>
  <button class="filter-btn" data-filter="misc">Preprints</button>
  <input type="text" id="publication-search" placeholder="Search...">
</div>

{% bibliography --file papers %}

</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const publicationEntries = document.querySelectorAll('.bibliography li');
  const searchInput = document.getElementById('publication-search');
  let currentFilter = 'all';
  let currentSearch = '';

  // Store searchable text for each entry
  publicationEntries.forEach(function(entry) {
    // Get searchable text (title, authors, venue, abstract)
    const textContent = entry.textContent.toLowerCase();
    entry.setAttribute('data-searchtext', textContent);

    const bibtexDiv = entry.querySelector('.bibtex code');
    if (bibtexDiv) {
      const bibtexText = bibtexDiv.textContent;
      const typeMatch = bibtexText.match(/@(\w+)\s*\{/);
      if (typeMatch) {
        const entryType = typeMatch[1].toLowerCase();
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

  function updateYearSections() {
    const yearHeaders = document.querySelectorAll('.publications h2.bibliography');
    yearHeaders.forEach(function(yearHeader) {
      let nextElement = yearHeader.nextElementSibling;
      let hasVisiblePublications = false;

      if (nextElement && nextElement.tagName === 'OL' && nextElement.classList.contains('bibliography')) {
        const items = nextElement.querySelectorAll('li');
        items.forEach(function(item) {
          if (item.style.display !== 'none') {
            hasVisiblePublications = true;
          }
        });
      }

      if (hasVisiblePublications) {
        yearHeader.style.display = '';
      } else {
        yearHeader.style.display = 'none';
      }
    });
  }

  function applyFilters() {
    publicationEntries.forEach(function(entry) {
      const entryType = entry.getAttribute('data-type');
      const searchText = entry.getAttribute('data-searchtext');

      const matchesType = currentFilter === 'all' || entryType === currentFilter;
      const matchesSearch = currentSearch === '' || searchText.includes(currentSearch);

      if (matchesType && matchesSearch) {
        entry.style.display = '';
      } else {
        entry.style.display = 'none';
      }
    });

    updateYearSections();
  }

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      currentFilter = this.getAttribute('data-filter');

      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');

      applyFilters();
    });
  });

  searchInput.addEventListener('input', function() {
    currentSearch = this.value.toLowerCase().trim();
    applyFilters();
  });

  updateYearSections();
});
</script>
