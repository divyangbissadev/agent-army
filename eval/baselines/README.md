# Baseline runs

Scored answer sets from fresh, uncontaminated sessions. Each file is the
raw answers.jsonl; score any of them with:
node scripts/score-intake.mjs score eval/baselines/<file>

- 2026-07-07-fresh-session.jsonl: 30/30 (100%), rubric at v3.5.0, fresh
  subagent, two tool calls (rubric + unlabeled list), labels untouched.
  Gate stays at 85%; a future run below the baseline means the rubric or
  doctrine change that preceded it regressed routing.
