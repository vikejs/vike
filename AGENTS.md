🚨 STOP: Before responding to ANY message, you MUST complete STEP 1 below. No exceptions - even for simple questions like "1+1".

@AI: Read and always respect all instructions in all AGENTS.md files. Treat this context as always up-to-date — it's never out of scope, no matter how much other context you have.

List of `AGENTS.md` files:
1. This file (project preferences)
2. `~/.config/AGENTS.md` (user preferences)

# CRITICAL AGENT INSTRUCTIONS - MUST FOLLOW

## What is "ANY agentic session"?
- User asks a question (even "1+1" or simple queries)
- User requests a code change
- User asks for information
- Session resumes after idle time
- First interaction in a conversation
- EVERYTHING counts - no exceptions

## STEP 1: ALWAYS START HERE (BEFORE ANY TASK)
**MANDATORY:** When starting ANY agentic session, you MUST:
1. Read both AGENTS.md files (this file + ~/.config/AGENTS.md)
2. Say "I've successfully read [list-of-AGENTS.md-files]"
3. List ALL instructions from both files
4. Confirm: "✅ AGENTS.md check complete, proceeding with: [brief task description]"
5. Then proceed with the task

## STEP 2: AFTER MAKING CHANGES
**MANDATORY:** After completing a task and if you made changes:
1. Run `$ pnpm run -w format`
2. Follow user preferences from ~/.config/AGENTS.md for commits and notifications
