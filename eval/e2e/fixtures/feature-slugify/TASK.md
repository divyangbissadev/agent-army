# Task

Add a `slugify(text)` function exported from src/index.js.

Requirements (each SHALL become a test):

1. The result SHALL be lowercase.
2. Runs of whitespace SHALL become a single hyphen.
3. Characters other than a-z, 0-9, and hyphen SHALL be removed.
4. Runs of hyphens SHALL collapse to one, with no leading or trailing hyphen.

Example: `slugify("  Rock & Roll!  ")` returns `"rock-roll"`.

Work test-first: the tests exist and fail before the implementation does.
