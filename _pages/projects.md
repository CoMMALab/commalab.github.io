---
layout: page
title: Projects
permalink: /projects/
description:
nav: true
nav_order: 3
horizontal: false
---

{% for project in site.projects %}
<p>
    <div class="card hoverable">
        <div class="row no-gutters">
            <div class="col-sm-4 col-md-3">
                {% capture project_video %}assets/video/{{ project.video }}{% endcapture %}
                {% include video.liquid path=project_video class="img-fluid z-depth-1" controls="true" autoplay="true" muted="true" loop="true" %}
            </div>
            <div class="team col-sm-8 col-md-9">
            <a href="{{ project.url }}">
                <div class="card-body">
                    <h5 class="card-title">{{ project.title }}</h5>
                </div>
            </a>
            </div>
        </div>
    </div>
</p>
{% endfor %}
