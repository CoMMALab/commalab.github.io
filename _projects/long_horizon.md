---
layout: project
key: long-horizon
title: Long-Horizon Planning
video: tamp.webm
front: true
caption: Methods that consider many actions into the future to achieve complex tasks.
rank: 2
---

Most tasks faced by a robot require more than a single "action"---for example, to cook a meal, there are many steps in a recipe; in order to navigate a building, a robot must explore many rooms, find feasible unblocked paths, open doors, and so on; construction tasks have many interlocking dependencies (e.g., peg A in hole B before screw C into socket D, etc.).

Critical to solving these kinds of tasks is some *abstraction* over the set of actions a robot can do, allowing methods to reason over what to do at a higher level (*i.e.*, rather than thinking about joint angles throughout the entire motion, thinking at the level of "pick up object A" and "place object B on object C"). Designing or automatically finding suitable abstractions for a problem (do you assume to know the set of actions the robot can perform, or is this something you must find out?), finding ways of providing *feedback* through abstraction (*e.g.*, what happens when you can't find a motion to pick up an object? Do you never pick up that object again? Is another object blocking it, or is it something else? How do you discover and inform search about this?), and efficiently searching over the infinite combinatorial explosion of options is essential to solving these problems effectively.
