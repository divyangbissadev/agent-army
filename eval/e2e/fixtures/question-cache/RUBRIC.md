# Rubric: LRU eviction explanation

Judge the answer against these criteria (1, 3, 5 anchors). Pass threshold:
12/15 with no criterion below 3. Every score must quote the answer.

## 1. Mechanism accuracy

- 1: wrong mechanism (e.g. claims timestamps or counters are used).
- 3: says least-recently-used entry is evicted but not how recency is
  tracked.
- 5: explains that Map insertion order tracks recency, that get() re-inserts
  the key to mark it most recent, and that the oldest key (first in
  iteration order) is deleted when size exceeds capacity.

## 2. Overflow walkthrough

- 1: does not address the at-capacity set of a new key.
- 3: says the oldest entry is dropped.
- 5: walks the exact order: new key inserted first, size check happens after
  insertion, then the least recent key is removed, so the cache briefly
  holds capacity + 1 entries.

## 3. Read-path effect

- 1: claims reads have no effect on eviction, or does not answer.
- 3: says reads refresh recency.
- 5: states that get() on a present key deletes and re-inserts it, making it
  the last to be evicted, and that get() on a missing key changes nothing.
