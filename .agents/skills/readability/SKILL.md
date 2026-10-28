---
name: readability
description: Refactor a part of the code to make it as easy as possible for humans to read, rating every file and function before and after.
disable-model-invocation: true
metadata:
  version: 0.1.0
---

Refactor a part of the project to make it as easy as possible for humans to read. Nobody will answer you: never ask, decide yourself. The part is what follows the command: a folder, a file, or a feature in words; when nothing follows it, it is the whole project. Below, a function means any unit of logic: a function, a class, a procedure.

What to judge:
- The architectural split. Does each file and each function represent a sensible and natural abstraction? Rate the seams, not just the boxes: for each call site, ask whether the responsibility sits on the right side of the boundary, whether a caller's wrapper should move down into the callee, or the other way round. A function can be clean, free of repetition and well tested on its own, and still be in the wrong place: well-factored is not well-located.
- Linearity. Read as a human who reads everything top to bottom. Callers go above callees, so the reader meets the high-level logic before the details. Read each entry point and each orchestrating function top to bottom as prose, and flag every line that drops the reader into lower-level mechanism (a flag, a thunk, a log verb, error plumbing) in the middle of what should be a high-level narrative; for each, ask whether that mechanism can move down into the callee, so the caller reads at one altitude. The functions a reader meets first come first.

How to work:
- Before changing anything, list every file and every function of the part in your messages, rate each from 0 (convoluted abstraction, hard to read, in the wrong place) to 10 (perfect), with the reason for the rating. Skip none: write a second list of every file and every function with a tick on each, to check that you rated them all.
- Mostly 10s means you were lazy. Scrutinize everything and take the time it takes: work until the result is exceptionally good, without anyone pushing you.
- One commit per refactor.

Commit each change on your branch. Then publish the work as far as whoever started you said; when they said nothing, publish nothing. A pull request's body is your summary, and so is your last message: the list again, each entry with its old rating, its new rating, and the commit that changed it. If nothing needs changing, say so with the ratings and stop, publishing nothing.
