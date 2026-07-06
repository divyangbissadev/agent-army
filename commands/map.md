---
description: Build or refresh the repo map (.claude/army/REPO-MAP.md) via repo-analyst
---

Dispatch the repo-analyst agent to create or refresh `.claude/army/REPO-MAP.md`
per the army-repo-map skill. If a map exists, tell the agent its commit sha so
it refreshes incrementally instead of regenerating. When the agent returns,
relay its 5-line summary and confirm the map path. Do not paste the map.
