---
layout: page
title: Research
permalink: /projects/
description:
nav: true
nav_order: 3
horizontal: false
---

<div class="row">
{% assign projects = site.projects | sort: "rank" | uniq %}
{% for project in projects %}
    <div class="col-12 col-md-6 mb-3">
        <div class="card hoverable h-100">
            <a href="{{ project.url }}">
                <div class="card-body">
                    <h5 class="card-title">{{ project.title }}</h5>
                    <h6 class="text-muted">{{ project.caption }}</h6>
                </div>
            </a>
        </div>
    </div>
{% endfor %}
</div>
