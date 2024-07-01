---
layout: about
title: About
permalink: /
subtitle: Computational Motion, Manipulation, and Autonomy Lab

news: true # includes a list of news items
selected_papers: true # includes a list of papers marked as "selected={true}"
social: false # includes social icons at the bottom of the page
...

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

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
