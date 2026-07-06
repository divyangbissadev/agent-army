#!/bin/sh
# Stop hook: block the agent from finishing while the repo's verify script
# fails. Opt-in per repo: create an executable .claude/army/verify.sh (run
# tests, lint, type checks; exit non-zero on failure). No script, no gate.
#
# Guard against infinite loops: Claude Code sets stop_hook_active in the
# hook input when a previous Stop hook already forced a continuation this
# turn. In that case we still verify, but only once more; if the flag is set
# we exit 0 to hand control back rather than trapping the agent forever.

INPUT="$(cat)"

VERIFY=".claude/army/verify.sh"
[ -x "$VERIFY" ] || exit 0

case "$INPUT" in
  *'"stop_hook_active":true'*|*'"stop_hook_active": true'*)
    exit 0
    ;;
esac

OUTPUT="$("$VERIFY" 2>&1)"
STATUS=$?

if [ $STATUS -ne 0 ]; then
  # Telemetry: verify-blocks are the harness catching a false "done".
  mkdir -p .claude/army
  printf '{"ts":"%s","event":"verify-block","exit":%d}\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$STATUS" >> .claude/army/telemetry.jsonl
  # Exit 2 blocks the stop; stderr goes back to the agent as instructions.
  {
    echo "Verification failed (.claude/army/verify.sh exit $STATUS). Do not declare done."
    echo "Fix the failures below, re-run the verify script, then finish."
    echo "$OUTPUT" | tail -40
  } >&2
  exit 2
fi

exit 0
