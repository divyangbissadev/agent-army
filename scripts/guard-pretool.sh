#!/bin/sh
# PreToolUse guard for Bash: high-blast-radius commands get downgraded to an
# explicit permission ask, even in permissive modes. Doctrine human-gate
# philosophy applied mechanically: the human decides on irreversible actions.

INPUT="$(cat)"

# Extract the command string crudely but safely (no jq dependency).
CMD=$(printf '%s' "$INPUT" | tr '\n' ' ')

ask() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"agent-army blast-radius guard: %s"}}\n' "$1"
  exit 0
}

case "$CMD" in
  *"rm -rf /"*|*"rm -rf ~"*|*'rm -rf "$HOME'*) ask "recursive delete outside the project" ;;
  *"git push"*"--force"*|*"git push -f"*)      ask "force push rewrites shared history" ;;
  *"git reset --hard"*)                         ask "hard reset discards local work" ;;
  *"git clean -fd"*|*"git clean -xdf"*)         ask "git clean deletes untracked files" ;;
  *"DROP TABLE"*|*"DROP DATABASE"*|*"drop table"*|*"drop database"*) ask "destructive SQL" ;;
  *"kubectl delete"*)                           ask "kubectl delete removes live resources" ;;
  *"terraform destroy"*)                        ask "terraform destroy tears down infrastructure" ;;
  *"npm publish"*|*"cargo publish"*)            ask "publishing is outward-facing and hard to retract" ;;
esac

exit 0
