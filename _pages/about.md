---
layout: about
title: About
permalink: /
subtitle: Computational Motion, Manipulation, and Autonomy Lab

news: true # includes a list of news items
selected_papers: true # includes a list of papers marked as "selected={true}"
social: false # includes social icons at the bottom of the page
...

Welcome to the <text class="highlight">Co</text>mputational <text class="highlight">M</text>otion, <text class="highlight">M</text>anipulation, and <text class="highlight">A</text>utonomy lab in <a href="https://www.purdue.edu/">Purdue University's</a> <a href="https://www.cs.purdue.edu/">Computer Science Department</a>!

## About Us

Our research broadly encompasses algorithms, methods, and software for complex robots or autonomous systems to make decisions and find feasible or optimal motions to achieve task objectives safely in the world.
We are interested in techniques that generalize and apply to any robotic system, constraint, or environment and are fast, efficient, and easy to use within a broader system---our approaches can be applied to robots that work in factories, the home, hospitals, and even in space.
We are also interested in the intersection between the theory and practice of robotics algorithms, finding where software engineering, hardware acceleration, and intelligent algorithm design can synergize to create a whole greater than the sum of its parts.

<hr/>
<h2>Research Areas</h2>
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
