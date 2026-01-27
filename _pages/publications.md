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
  <button class="filter-btn" data-filter="article">Journals</button>
  <button class="filter-btn" data-filter="inproceedings">Conferences</button>
  <button class="filter-btn" data-filter="misc">Preprints</button>
</div>

{% bibliography --file papers %}

</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const publicationEntries = document.querySelectorAll('.bibliography li');

  publicationEntries.forEach(function(entry) {
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

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');

      publicationEntries.forEach(function(entry) {
        const entryType = entry.getAttribute('data-type');
        if (filter === 'all' || entryType === filter) {
          entry.style.display = '';
        } else {
          entry.style.display = 'none';
        }
      });

      updateYearSections();
    });
  });

  updateYearSections();
});
</script>
