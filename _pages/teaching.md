---
layout: page
permalink: /classes/
title: Teaching
description:
nav: true
nav_order: 5
---

{% assign classes = site.classes | sort: "rank" | uniq %}
{% for class in classes %}
<p>
    <div class="card hoverable">
        <div class="row no-gutters">
            <div class="col-sm-4 col-md-3">
            {% capture member_image %}assets/img/classes/{{ class.preview }}{% endcapture %}
            {%
                include figure.liquid
                loading="lazy"
                path=member_image
                sizes = "200px"
                class="preview z-depth-1 rounded"
                alt=entry.preview
             %}
            </div>
            <div class="team col-sm-8 col-md-9">
            <a href="{{ class.url }}">
                <div class="card-body">
                    <h5 class="card-title">{{ class.title }}</h5>
                    <h6 class = "text-muted">
                    {{ class.course_number }}
                    </h6>
                    <h6 class = "text-muted">
                    {{- class.semester }}
                    {{ class.year -}}
                    </h6>
                </div>
            </a>
            </div>
        </div>
    </div>
</p>
{% endfor %}
