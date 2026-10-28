---
name: research
description: Rate how obviously well a part of the code solves each problem it solves, and name the problems worth researching alternatives for. Changes nothing.
disable-model-invocation: true
metadata:
  version: 0.1.0
---

Measure the problem variability of a part of the project. Nobody will answer you: never ask, decide yourself. The part is what follows the command: a folder, a file, or a feature in words; when nothing follows it, it is the whole project. List every high-level flow the part implements, that is every problem it solves. Rate each problem from 0 to 10 by one criterion: 10 when the code solves it in an obviously optimal way, 0 when it is highly unclear whether it could be solved in a better way. Give the reason for each rating. You change nothing: no file, no commit, no ticket, no queue entry. Your last message is the written result: every problem with its rating and its reason, lowest rating first; then the problems worth a deep-dive into alternative solutions, the low-rated ones, each with what that deep-dive should look at. A person reads it and decides what comes next.
