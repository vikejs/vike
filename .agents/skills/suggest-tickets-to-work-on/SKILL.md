---
name: suggest-tickets-to-work-on
description: Pick and rank the tickets worth working on next, each with the priority it should get on the agent queue. Changes nothing.
disable-model-invocation: true
metadata:
  version: 0.1.0
---

Suggest which tickets to work on next. Nobody will answer you: never ask, decide yourself. Read every open ticket, with its plan when it has one. Pick the tickets worth working on next and rank them, by a mix of sensible criteria: what the work is worth, its effort and its uncertainty, what it unblocks. Skip a ticket already on the agent queue, one held by someone, and one in review, the one with a pull request named on it. You change nothing: you queue nothing and write no ticket. Your last message is the written result: the picked tickets in rank order, each with its file, its title, the priority it should get on the agent queue (the ticket's own priority, 5 when it has none), one line saying why, and whether you are confident it should go next or only think so. A person reads it and queues the ones they approve. If nothing is worth picking, say so and stop. If this project has no ticketing system, show an error to the user and stop.
