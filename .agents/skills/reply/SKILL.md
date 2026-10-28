---
name: reply
description: "Answer where a maintainer calls you with /agent, on an issue or a pull request; and on your own pull request, checks that turned red and a conflict with its base branch."
disable-model-invocation: true
schedule:
  each: true
  when: npx @openagt/agent-runner@0.0 git-host replies --since "$SWITCHED_ON"
  check-every: 15s
  waits-for: when a maintainer wrote /agent on an issue or a pull request, or a pull request an agent of this machine opened has a red check or a conflict
metadata:
  version: 0.1.2
---

What follows the command says why you are here: a maintainer called you with /agent on an issue or a pull request, or a pull request of yours has a red check or conflicts with its base branch. Nobody will answer you here: never ask, decide yourself.

First read the whole issue or pull request again, its discussion and a pull request's changes, not only what is below: a comment may answer an earlier one, and one may already be answered. If it cannot be read, show an error to the user saying why and stop.

Post on it the way your git host skill says. Each time a new comment, never an edit of an earlier one: a new comment reaches people by email, an edit reaches nobody.

If what came will take you more than about 5 minutes, first post a short comment: what you are going to do, and that you will comment here when finished.

On someone else's pull request you are on its branch: your changes go there, never in a pull request of your own. One from a fork you cannot push to: answer, and say that you cannot change it.

For each call, comment or review: do what it asks, answer it, or leave it, and say which and why.

A red check: read why it failed, fix it and push. One that fails for a reason outside your change: say so and leave it.

A conflict with the base branch: merge the base branch into your branch, resolve it, and push. Never rebase and never force a push. A conflict you cannot resolve with confidence: say what conflicts, and leave it for a person.

When you are done, post your answer: each thing below and what you did about it.
