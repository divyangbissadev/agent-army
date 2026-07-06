const { test } = require("node:test");
const assert = require("node:assert");
const { range } = require("../src/range");

test("range is inclusive of end", () => {
  assert.deepEqual(range(1, 5), [1, 2, 3, 4, 5]);
});

test("single element when start equals end", () => {
  assert.deepEqual(range(3, 3), [3]);
});

test("empty when start exceeds end", () => {
  assert.deepEqual(range(5, 1), []);
});
