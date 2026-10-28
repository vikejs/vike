---
name: ux
description: Review every UI flow of a part of the product, rate its user experience, and improve the badly rated flows.
disable-model-invocation: true
metadata:
  version: 0.1.0
---

Review the UI flows of a part of the project. Nobody will answer you: never ask, decide yourself. The part is what follows the command: a folder, a file, or a feature in words; when nothing follows it, it is the whole project. Before changing anything, list every UI flow of the part in your messages; skip none. Rate each flow's user experience from 0 (unusable) to 10 (perfect), with the reason for the rating. Then improve the flows with a bad rating, one commit per flow you improve. Mostly 10s means you were lazy: scrutinize every detail and take the time it takes; work until the result is exceptionally good, without anyone pushing you. Commit each change on your branch. Then publish the work as far as whoever started you said; when they said nothing, publish nothing. A pull request's body is your summary, and so is your last message: the list of flows again, each with its old rating, its new rating, and the commits that changed it. If no flow needs improving, say so with the ratings and stop, publishing nothing.
