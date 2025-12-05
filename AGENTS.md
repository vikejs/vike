@AI: MAKE SURE TO READ THIS ENTIRE FILE before starting an agentic session.

# Agent Instructions

1. Confirm you've read this file by saying "I've successfully read AGENTS.md" upon session begin.

2. Always send both a visual and sound notification when completing tasks (including when merely answering questions). For example on Ubuntu:
   ```bash
   # Visual notifcation
   notify-send "AI" "Task completed"
   # Sound notifcation
   paplay /usr/share/sounds/freedesktop/stereo/complete.oga
   ```

3. After completing a task and if you made changes, make a Git commit "[AI] Some summary" — make the summary succinct (ideally <70 characters).
