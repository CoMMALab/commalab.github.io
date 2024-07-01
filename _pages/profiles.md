---
layout: default
permalink: /team
title: Team
description:
nav: true
nav_rank: 2
---

{% assign groups = site.data.members | sort: "group_rank" | map: "group" | uniq %}
{% for group in groups %}
# {{ group }}

    {% assign members = site.data.members | sort: "lastname" | where: "group", group %}
    {% for member in members %}
<p>
    <div class="card hoverable">
        <div class="row no-gutters">
            <div class="col-sm-4 col-md-3">
                <img src="{{ '/assets/img/people/' | append: member.image | relative_url }}" class="card-img img-fluid" alt="{{ member.name }}" />
            </div>
            <div class="team col-sm-8 col-md-9">
                <div class="card-body">
                    <a href="{{ member.website }}">
                    <h5 class="card-title">{{ member.name }}</h5>
                    {% if member.position %}<h6 class="card-subtitle mb-2 text-muted">{{ member.position }}</h6>{% endif %}
                    <p class="card-text">
                        {{ member.teaser }}
                    </p>
                    </a>
                    {% if member.email %}
                        <a href="mailto:{{ member.email }}" class="card-link"><i class="fas fa-envelope"></i></a>
                    {% endif %}
                    {% if member.phone %}
                        <a href="tel:{{ member.phone }}" class="card-link"><i class="fas fa-phone"></i></a>
                    {% endif %}
                    {% if member.scholar %}
                        <a href="https://scholar.google.com/citations?user={{ member.scholar }}" class="card-link" target="_blank"><i class="ai ai-google-scholar"></i></a>
                    {% endif %}
                    {% if member.linkedin %}
                        <a href="https://linkedin.com/in/{{ member.linkedin }}/" class="card-link" target="_blank"><i class="fab fa-linkedin"></i></a>
                    {% endif %}
                    {% if member.orcid %}
                        <a href="https://orcid.org/{{ member.orcid }}" class="card-link" target="_blank"><i class="fab fa-orcid"></i></a>
                    {% endif %}
                    {% if member.twitter %}
                        <a href="https://twitter.com/{{ member.twitter }}" class="card-link" target="_blank"><i class="fab fa-twitter"></i></a>
                    {% endif %}
                    {% if member.github %}
                        <a href="https://github.com/{{ member.github }}" class="card-link" target="_blank"><i class="fab fa-github"></i></a>
                    {% endif %}
                    {% if member.website %}
                        <a href="{{ member.website }}" class="card-link" target="_blank"><i class="fas fa-globe"></i></a>
                    {% endif %}
                    <!-- <p class="card-text"> -->
                    <!--     <small class="test-muted"><i class="fas fa-thumbtack"></i> {{ member.address | replace: '<br />', ', ' }}</small> -->
                    <!-- </p> -->
                </div>
            </div>
        </div>
    </div>
</p>
    {% endfor %}
{% endfor %}


