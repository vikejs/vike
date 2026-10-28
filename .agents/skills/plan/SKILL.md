---
name: plan
description: Write a ticket for the task typed after the command and, under it, a plan naming the ways to do it and the one to take. Changes nothing else.
disable-model-invocation: true
metadata:
  version: 0.1.0
---

Plan the task that follows the command, and stop there. Nobody will answer you: never ask, decide yourself; a question you would have asked is an option in the plan. When nothing follows the command, say so and stop. Read the open tickets first: when one already covers the task, plan under it instead of writing a second. Otherwise write one ticket for the task. Under the ticket write its plan: the ways you see to do the work and the one you recommend, with why. You only write the ticket and its plan: you queue nothing, and you change no code. Your last message names the ticket and the way you recommend: a person reads it, and queues the ticket once the plan is right. If this project has no ticketing system, show an error to the user and stop.
