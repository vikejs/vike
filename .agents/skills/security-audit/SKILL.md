---
name: security-audit
description: Audit a part of the code for security issues, exhaustively, fixing each issue found.
disable-model-invocation: true
metadata:
  version: 0.1.0
---

Audit a part of the project for security. Nobody will answer you: never ask, decide yourself. The part is what follows the command: a folder, a file, or a feature in words; when nothing follows it, it is the whole project. Scrutinize all of its code for potential security issues, and make it exhaustive: every file of the part. List every aspect you considered, and give each a verdict, with an explanation when the verdict is not obvious. Fix each security issue you find in its own commit on your branch. Then publish the work as far as whoever started you said; when they said nothing, publish nothing. A pull request's body is the list of aspects with their verdicts. Your last message is the same list. If you find no issue, your last message is the list and you stop, publishing nothing.
