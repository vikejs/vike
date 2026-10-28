---
name: update-tickets
description: Bring the project's tickets up to date with its issue tracker and its merged pull requests, unattended.
disable-model-invocation: true
schedule:
  every: 15m
  waits-for: when an issue changed or a pull request that closes a ticket merged since the last import, or nothing was imported yet
  when: |-
    { gh issue list --state all --limit 1 --json number --search "updated:>=$(npx @openagt/skill-tickets@0.1 meta | jq -r .lastImportedAt)"; gh pr list --state merged --limit 100 --json number,body --search "merged:>=$(npx @openagt/skill-tickets@0.1 meta | jq -r .lastImportedAt)" | jq '[.[] | select(.body | test("(?m)^Closes tickets/\\w")) | {number}]'; npx @openagt/skill-tickets@0.1 meta | jq --argjson t "$(npx @openagt/skill-tickets@0.1 list)" '[select(.lastImportedAt == null and ($t | length) == 0) | "first import"]'; } | jq -s add
metadata:
  version: 0.1.1
---

Bring the tickets up to date with the project's issue tracker and its merged pull requests. Nobody will answer you: never ask, decide yourself.

1. Note the current UTC time to the second, like `2026-09-26T12:25:28Z`, before you fetch anything: it is the import time you record at the end.
2. If this project has no ticketing system, or the tracker cannot be reached, or you are not logged in to it, show an error to the user saying which and stop. Read when the tickets last caught up with the tracker. If there is no such time and no tickets at all, this is a first import: bring every open issue across, one ticket each, its `Issue:` line linking the issue, then go to step 5. If there are tickets but no such time, show an error to the user saying so and stop.
3. Fetch every issue changed since that time, open and closed, past any page limit, their discussion included; pull requests are not issues. One ticket per issue: an issue with a ticket has it updated in place, keeping its file name, the lines above its title and its plan, the plan marked outdated when the change calls for it; an open issue with no ticket gets one, its `Issue:` line linking the issue, when it was opened or reopened since that time, and none otherwise; a comment goes in only where it changes what the work is, never pasted; an issue now closed has its ticket closed, and gets none if it has none.
4. Fetch every pull request merged since that time, past any page limit, with its body. Each line `Closes tickets/<file>` in a body has that ticket closed; a ticket already gone is nothing to do.
5. Record the time you noted as the new import time.

A ticket you close leaves the agent queue too, where the project has one: mark done every entry naming its file or its plan's file, `tickets/<name>.md` or `tickets/<name>.plan.md`, by that exact path. A ticket someone else holds is updated like any other but not closed: leave it open. If anything else fails once you started fetching, record no time: show an error to the user saying what failed, and stop.
