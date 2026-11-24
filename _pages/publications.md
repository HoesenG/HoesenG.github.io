---
permalink: /publications/
title: Publications
description: Publications by Houxuan Guo.
---

{% assign conference = site.data.publications | where: "type", "conference" %}
{% assign journal = site.data.publications | where: "type", "journal" %}

{% if conference.size > 0 %}
## Conference Papers

{% include publication-list.html type="conference" %}
{% endif %}

{% if journal.size > 0 %}
## Journal Articles

{% include publication-list.html type="journal" %}
{% endif %}
