---
name: plan-tickets
description: Queue a plan for the open tickets that have none or whose plan is outdated, unattended; at most ten a run.
disable-model-invocation: true
schedule:
  every: 6h
  waits-for: when a ticket that is not waiting, claimed, in review or queued has no plan, or an outdated one
  when: |-
    npx @openagt/skill-tickets@0.1 list | jq --argjson q "$(npx @openagt/skill-queue@0.1)" '[.[] | select(((.planned | not) or .outdated) and .pr == null and (.waiting | not) and (.locked | not) and ((.file | rtrimstr(".md")) as $s | $q | any(contains($s)) | not)) | .file]'
metadata:
  version: 0.1.0
---

Queue plans for the tickets that need one. Nobody will answer you: never ask, decide yourself. You only queue work, you never do it: write no plan yourself, the only thing you change is the queue.

1. If this project has no ticketing system or no AI queue, show an error to the user saying which and stop.
2. Read every open ticket as listed, and the queue; the listing decides, open no ticket. If either read fails, show an error to the user saying which and why, and stop. Below, a ticket's `<name>` is its file without `.md`.
3. A ticket needs a plan when its listing shows none, or shows its plan outdated. Skip a ticket the listing shows locked, in review or waiting, and one already on the queue: any entry, in any wording, with its `<name>` anywhere in it.
4. Take at most ten: highest priority first, then oldest date first.
5. Queue them one by one in that order, each as the sentence `Create tickets/<name>.plan.md` at the ticket's priority. If a write fails, show an error to the user saying which ticket and why, and stop.
