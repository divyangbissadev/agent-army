// range(start, end): all integers from start to end, INCLUSIVE of end.
function range(start, end) {
  const out = [];
  for (let i = start; i < end; i++) {
    out.push(i);
  }
  return out;
}

module.exports = { range };
