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
{% assign projects = site.projects | where: "front","true" %}
{% for project in projects %}
    <div class="col-sm-4 col-md-4">
    <div class="card hoverable">
    <div class="card-body">
        <a href="{{ project.url }}">
        <h5 class="card-title">{{ project.title }}</h5>
        {% capture project_video %}assets/video/{{ project.video }}{% endcapture %}
        {% include video.liquid path=project_video class="img-fluid z-depth-1" controls="true" autoplay="true" muted="true" loop="true" %}
        </a>
    </div>
    </div>
    </div>
{% endfor %}
{% assign projects = site.projects | where: "front",empty %}
{% for project in projects %}
    <div class="col-sm-4 col-md-4">
    <div class="card hoverable">
    <div class="card-body">
        <a href="{{ project.url }}">
        <h5 class="card-title">{{ project.title }}</h5>
        </a>
    </div>
    </div>
    </div>
{% endfor %}
</div>
</p>
<br/>
