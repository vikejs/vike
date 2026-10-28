---
name: work-queue
description: Work one queued task off the project's agent queue, unattended.
disable-model-invocation: true
schedule:
  waits-for: when the queue holds a task nobody has claimed
  when: |-
    npx @openagt/skill-queue@0.1 | jq --argjson t "$(npx @openagt/skill-tickets@0.1 list)" '[.[] | . as $e | select($t | any(.[]; .locked and ((.file | rtrimstr(".md")) as $s | $e | contains($s))) | not)]'
metadata:
  version: 0.1.0
---

Work one task off the project's agent queue. Nobody will answer you: never ask, decide yourself.

Take the first open entry of the queue, and one task only. An entry `Create tickets/<name>.plan.md` names the ticket `tickets/<name>.md`. When the entry names a ticket, claim the ticket before you work it; when someone else holds the claim, leave that entry and take the next one; when every entry is claimed, say so and stop. When the entry's ticket no longer exists, mark the entry done and stop.

If the ticket is waiting or in review, do nothing on it, not even a plan: mark the queue entry done, release your claim and stop. If you find the ticket has nothing you can do until something outside the work happens, write what it waits on as its `Waiting:` line above the title, mark the entry done and release your claim. Never close a waiting ticket.

Commit your work on your branch. Once it is committed, publish it as far as whoever started you said; when they said nothing, publish nothing. If the push or the pull request fails, leave the entry queued, release your claim, and end saying what failed.

A task that opens no pull request ends when what it writes is saved where it belongs, then its queue entry is marked done. A plan is written as the ticket's plan: release your claim, the ticket stays open. A task whose whole work is changing other tickets finishes its own ticket: close it.

If this project has no AI queue, or the task needs a ticketing system or a way to open a pull request that the project lacks, end with an error saying so and stop.
