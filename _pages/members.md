---
layout: default
permalink: /members
title: Team
description:
nav: true
nav_rank: 2

carousels:
  - images:
    - image: /assets/img/group_photos/2025_09_06_icra_party.jpg
      label: Pushing for ICRA 2026, Sep. 2025
    - image: /assets/img/group_photos/2025_05_19_icra.jpg
      label: CoMMA Lab at ICRA 2025
    - image: /assets/img/group_photos/2025_04_29_climbing.jpg
      label: Rock Climbing, Apr. 2025
    - image: /assets/img/group_photos/2025_04_25_robosoft.jpg
      label: Yitian and Lucas at Robosoft 2025
    - image: /assets/img/group_photos/2025_03_09_katana_sushi.jpg
      label: Dinner at Katana Sushi, Mar. 2025

---

<style>
.student-grid-tile {
    max-width: 160px;
    text-align: center;
}

.student-grid-tile .student-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 5%;
    margin-bottom: 5px;
}

.student-grid-tile .student-name {
    font-size: 0.85rem;
    font-weight: 600;
}

.student-grid-tile .student-subtitle {
    font-size: 0.65rem;
    color: grey;
}

.student-grid-tile .student-links {
    font-size: 0.75rem;
}

.student-grid-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}
</style>

{% assign active_members = "" | split: "" %}
{% for item in site.members %}
  {% unless item.alumni %}
    {% assign active_members = active_members | push: item %}
  {% endunless %}
{% endfor %}

{% assign groups = active_members | sort: "group_rank" | map: "group" | uniq %}
{% for group in groups %}

## {{ group }}

{% assign members = active_members | sort: "group_rank" | where: "group", group %}

{% if group == "Undergraduate Students" %}
<!-- Grid layout for undergraduate students -->
<div class="student-grid-container">
    {% for member in members %}
    <div class="student-grid-tile">
        <a href="{{ member.url }}">
            {% capture member_image %}assets/img/people/{{ member.image }}{% endcapture %}
            {% include figure.liquid loading="lazy" path=member_image class="student-image" alt=member.first_name %}
            <div class="student-name">{{ member.first_name }} {{ member.last_name }}</div>
            {% if member.pronouns %}<div class="student-subtitle">({{ member.pronouns }})</div>{% endif %}
        </a>
        <div>
            {% if member.email %}
                <a href="mailto:{{ member.email | encode_email }}" title="Email"><i class="fas fa-envelope"></i></a>
            {% endif %}
            {% if member.google_scholar %}
                <a href="https://scholar.google.com/citations?user={{ member.google_scholar }}" target="_blank"><i class="ai ai-google-scholar"></i></a>
            {% endif %}
            {% if member.twitter %}
                <a href="https://twitter.com/{{ member.twitter }}" target="_blank"><i class="fab fa-twitter"></i></a>
            {% endif %}
            {% if member.github %}
                <a href="https://github.com/{{ member.github }}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>
            {% endif %}
            {% if member.linkedin %}
                <a href="https://linkedin.com/in/{{ member.linkedin }}/" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
            {% endif %}
            {% if member.website %}
                <a href="{{ member.website }}" target="_blank" title="Website"><i class="fas fa-globe"></i></a>
            {% endif %}
        </div>
    </div>
    {% endfor %}
</div>

{% else %}
<!-- Standard layout for other groups -->
    {% for member in members %}
<p style="margin-bottom:10px">
    <div class="card hoverable">
        <div class="row no-gutters">
            <div class="col-5 col-xs-3 col-sm-3 col-md-2">
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
            <div class="team col-7 col-xs-9 col-sm-9 col-md-10">
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
{% endif %}
<br>
{% endfor %}

<h2>Group Photos</h2>
{% include carousel.html height="50" unit="%" duration="7" number="1" %}

<br>
<h2>Past Members</h2>

<ul>
{% assign members = site.members | sort: "lastname" | where: "alumni", true %}
{% for member in members %}
<li>
<a href="{{member.url}}">{{ member.first_name }} {{ member.last_name }}</a>
{% if member.now_at %}
&nbsp;({{ member.now_at }})
{% endif %}
</li>
{% endfor %}
<ul>
