---
layout: about
title: About
permalink: /
subtitle: Computational Motion, Manipulation, and Autonomy Lab

news: true # includes a list of news items
selected_papers: true # includes a list of papers marked as "selected={true}"
social: false # includes social icons at the bottom of the page

...

<p>
<div class="row">
{% assign projects = site.data.projects | uniq %}
{% for project in projects %}
    <div class="col-sm-4 col-md-4">
    <div class="card hoverable">
    <div class="card-body">
        <h5 class="card-title">{{ project.name }}</h5>
        {% capture project_video %}assets/video/{{ project.video }}{% endcapture %}
        {% include video.liquid path=project_video class="img-fluid z-depth-1" controls="true" autoplay="true" muted="true" loop="true" %}
    </div>
    </div>
    </div>
{% endfor %}
</div>
</p>
<br/>
