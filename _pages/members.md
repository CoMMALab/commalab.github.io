---
layout: default
permalink: /members
title: Team
description:
nav: true
nav_rank: 2

carousels:
  - images:
    - image: /assets/img/group_photos/2025_03_09_katana_sushi.jpg
      label: Group Dinner at Katana Sushi, March 2025

---

{% assign groups = site.members | sort: "group_rank" | map: "group" | uniq %}
{% for group in groups %}
## {{ group }}

    {% assign members = site.members | sort: "lastname" | where: "group", group %}
    {% for member in members %}
<p style="margin-bottom:10px">
    <div class="card hoverable">
        <div class="row no-gutters">
            <div class="col-5 col-xs-3 col-sm-3">
            {% capture member_image %}assets/img/people/{{ member.image }}{% endcapture %}
            {%
                include figure.liquid
                loading="lazy"
                path=member_image
                sizes = "200px"
                class="preview z-depth-1 rounded"
                alt=entry.preview
             %}
            </div>
            <div class="team col-7 col-xs-9 col-sm-9">
                <div class="card-body">
                    <a href="{{ member.url }}">
                    <h5 class="card-title">{{ member.first_name }} {{ member.last_name }}</h5>
                    {% if member.position %}<h6 class="card-subtitle mb-2 text-muted">{{ member.position }}</h6>{% endif %}
                    {% if member.pronouns %}<h6 class="card-subtitle mb-2 text-muted">({{ member.pronouns }})</h6>{% endif %}
                    <p class="card-text">
                        {{ member.teaser }}
                    </p>
                    </a>
                    <div>
                    {% if member.email %}
                        <a href="mailto:{{ member.email | encode_email }}"><i class="fas fa-envelope"></i></a>
                    {% endif %}
                    {% if member.google_scholar %}
                        <a href="https://scholar.google.com/citations?user={{ member.google_scholar }}" target="_blank"><i class="ai ai-google-scholar"></i></a>
                    {% endif %}
                    {% if member.dblp %}
                        <a href="https://dblp.org/pid/{{ member.dblp }}.html" target="_blank"><i class="ai ai-dblp"></i></a>
                    {% endif %}
                    {% if member.linkedin %}
                        <a href="https://linkedin.com/in/{{ member.linkedin }}/" target="_blank"><i class="fab fa-linkedin"></i></a>
                    {% endif %}
                    {% if member.orcid %}
                        <a href="https://orcid.org/{{ member.orcid }}" target="_blank"><i class="fab fa-orcid"></i></a>
                    {% endif %}
                    {% if member.twitter %}
                        <a href="https://twitter.com/{{ member.twitter }}" target="_blank"><i class="fab fa-twitter"></i></a>
                    {% endif %}
                    {% if member.github %}
                        <a href="https://github.com/{{ member.github }}" target="_blank"><i class="fab fa-github"></i></a>
                    {% endif %}
                    {% if member.cv %}
                    {% capture cv_path %}assets/pdf/cv/{{ member.cv }}{% endcapture %}
                        <a href="{{ cv_path | relative_url }}" target="_blank"><i class="ai ai-cv"></i></a>
                    {% endif %}
                    {% if member.website %}
                        <a href="{{ member.website }}" target="_blank"><i class="fas fa-globe"></i></a>
                    {% endif %}
                    </div>
                </div>
            </div>
        </div>
    </div>
    </p>
    {% endfor %}
<br>
{% endfor %}

<h2>Group Photos</h2>
{% include carousel.html height="50" unit="%" duration="7" number="1" %}
