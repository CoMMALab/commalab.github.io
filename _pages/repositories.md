---
layout: page
permalink: /repositories/
title: Code
description: Software from the lab and our collaborators.
nav: true
nav_order: 4
---

<div class="row repositories">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo_card.liquid repository=repo %}
  {% endfor %}
</div>
