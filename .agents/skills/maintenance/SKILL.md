---
name: maintenance
description: Find the parts of the code that need refactoring and put their maintainability and security work on the agent queue. Queues only.
disable-model-invocation: true
metadata:
  version: 0.1.0
---

Find what needs refactoring, and queue the work. Nobody will answer you: never ask, decide yourself. The part is what follows the command: a folder, a file, or a feature in words; when nothing follows it, it is the whole project. Analyze it, and look for the subsets of the code that need refactoring: a folder, a module, a feature, each one that makes sense to work on alone. For each subset that needs it, put two entries on the agent queue, usually at a low priority, each naming the subset clearly so that an agent who reads only the entry knows what to work on: one asking to refactor that subset to make it as maintainable as possible, finding its maintainability red flags and fixing them; one asking for an exhaustive security audit of that subset, listing every aspect considered with a verdict, each security issue found fixed in its own commit. Skip a subset whose work is already on the queue. You only queue work, you never do it: the only thing you change is the queue. A write to the queue that is rejected because someone else wrote first is tried once more, after reading again. If nothing needs refactoring, say so and stop. If this project has no AI queue, show an error to the user and stop.
