---
name: scheduler
description: "Start and stop the project's scheduler, switch the commands it starts on a schedule on or off, set their pace, or start one now, when the person asks you to."
package: "@openagt/skill-scheduler@0.1"
metadata:
  version: 0.1.14
---

# Scheduler

The scheduler starts agents on a schedule: the project's skills say which commands can run on one, and each machine switches them on for itself. It runs in its own process and needs no dashboard.

Run the `scheduler` command at the project's root, always by its full name: `npx @openagt/skill-scheduler@0.1`. It prints one JSON document; a refusal exits 1 with why on stderr; a wrong command line exits 2 with the usage.

Change it only when the person asks: every run it starts spends their quota.

```
npx @openagt/skill-scheduler@0.1 status                  on, running, the switches, and schedule: every command
                                                          that can run on a schedule, with its pace (every), its check (when)
npx @openagt/skill-scheduler@0.1 start                   the scheduler on, ticking every minute in its own process
npx @openagt/skill-scheduler@0.1 stop                    the scheduler off; runs in flight go to their end
npx @openagt/skill-scheduler@0.1 switch <command> on|off whether a command runs on this machine; every one starts off
npx @openagt/skill-scheduler@0.1 pace <command> <N<m|h|d|w|mo>|work|skill> [HH:MM]
                                                          how often at most it starts; work: whenever its check finds work;
                                                          skill: its skill's own pace again
npx @openagt/skill-scheduler@0.1 now <command>           one run of it now, whatever its switch and pace
```

A command is named as `status` names it, quoted when it has a word after it. A switched-on command starts nothing while the scheduler is off: switch it on, then `start`.

The rest, such as a command's agent, model, publish level, or the person's own automations, is in its usage: `npx @openagt/skill-scheduler@0.1` with no command prints it.
