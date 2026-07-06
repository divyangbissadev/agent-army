#!/bin/sh
# PreToolUse guard for Bash: high-blast-radius commands get downgraded to an
# explicit permission ask. Doctrine human-gate philosophy applied
# mechanically: the human decides on irreversible actions.
#
# Analysis runs in node when available: the command is split on shell
# separators and rules anchor to the command position, so flag reordering
# (rm -fr, rm -r -f, --recursive --force) and casing cannot slip past, while
# a grep or echo that merely mentions a dangerous phrase passes. Without
# node, a conservative substring fallback runs (may over-ask, never
# under-asks on canonical forms).

INPUT="$(cat)"

ask() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"agent-army blast-radius guard: %s"}}\n' "$1"
  exit 0
}

if command -v node >/dev/null 2>&1; then
  REASON=$(printf '%s' "$INPUT" | node -e '
let d = "";
process.stdin.on("data", (c) => (d += c));
process.stdin.on("end", () => {
  let cmd = "";
  try {
    const j = JSON.parse(d);
    cmd = String((j.tool_input && j.tool_input.command) || "");
  } catch { cmd = d; }
  const out = (r) => { process.stdout.write(r); process.exit(0); };
  const lower = cmd.toLowerCase();
  if (/\bdrop\s+(table|database)\b|\btruncate\s+table\b/.test(lower))
    out("destructive SQL");
  const segments = cmd.split(/&&|\|\||;|\||\n|\$\(|`/);
  for (const seg of segments) {
    const s = seg.trim().toLowerCase();
    const tokens = s.split(/\s+/);
    if (/^rm\s/.test(s)) {
      const rec = tokens.some((t) => /^-[a-z]*r/i.test(t) || t === "--recursive" || t === "-r");
      const force = tokens.some((t) => /^-[a-z]*f/.test(t) || t === "--force");
      const target = tokens.some(
        (t) => t === "/" || t === "~" || t === "$home" || t === "\"$home\"" || t === "~/"
      );
      if (rec && force && target) out("recursive force delete targeting root or home");
    }
    if (/^git\s+push\b/.test(s) && !s.includes("--force-with-lease")) {
      if (tokens.includes("--force") || tokens.includes("-f"))
        out("force push rewrites shared history");
    }
    if (/^git\s+reset\s+--hard\b/.test(s)) out("hard reset discards local work");
    if (/^git\s+clean\b/.test(s) && tokens.some((t) => /^-[a-z]*f/.test(t)))
      out("git clean deletes untracked files");
    if (/^kubectl\b/.test(s) && /\bdelete\b/.test(s))
      out("kubectl delete removes live resources");
    if (/^terraform\s+destroy\b/.test(s)) out("terraform destroy tears down infrastructure");
    if (/^(npm|cargo)\s+publish\b/.test(s)) out("publishing is outward-facing and hard to retract");
  }
  process.stdout.write("");
});' 2>/dev/null)
  [ -n "$REASON" ] && ask "$REASON"
  exit 0
fi

# Fallback without node: conservative substring matching on the raw payload.
LOWER=$(printf '%s' "$INPUT" | tr '\n\t' '  ' | tr -s ' ' | tr '[:upper:]' '[:lower:]')
case "$LOWER" in
  *"rm -rf /"*|*"rm -fr /"*|*"rm -rf ~"*|*"rm -fr ~"*) ask "recursive delete outside the project" ;;
  *"git push"*"--force-with-lease"*) : ;;
  *"git push"*"--force"*|*"git push -f"*) ask "force push rewrites shared history" ;;
esac
case "$LOWER" in
  *"git reset --hard"*)              ask "hard reset discards local work" ;;
  *"drop table"*|*"drop database"*|*"truncate table"*) ask "destructive SQL" ;;
  *"kubectl delete"*)                ask "kubectl delete removes live resources" ;;
  *"terraform destroy"*)             ask "terraform destroy tears down infrastructure" ;;
  *"npm publish"*|*"cargo publish"*) ask "publishing is outward-facing and hard to retract" ;;
esac

exit 0
