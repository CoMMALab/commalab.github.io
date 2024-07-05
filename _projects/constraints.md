---
layout: project
key: constraints
title: Planning with Constraints
video: constraints.webm
front: true
caption: Methods to generate robot motion that adhere to complex task constraints.
rank: 1
---

Interacting with the world imposes constraints on your motion: you open doors about their hinge, pull drawers along their rails, keep glasses of liquid upright so they do not spill, and more.
Respecting these constraints while still generating feasible or optimal motion is complex and requires careful consideration in the design of planning algorithms and how the constraints are specified and satisfied.
There are also many exciting considerations when there are many constraints that need to be satisfied simultaneously (*e.g.*, a humanoid robot that must open a door, keep a glass upright, and maintain balance, or as shown in the video, a parallel mechanism with many interacting arms) or in sequence (*e.g.*, as shown in the video, Robonaut 2 traversing multiple handrails, opening the hatch, and so on).
