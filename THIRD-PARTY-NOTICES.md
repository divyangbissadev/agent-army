# Third-party notices

## mattpocock/skills

The skills under `skills/mp-*` are vendored from
https://github.com/mattpocock/skills (commit 16a2a5cd, 2026-07-06), with
three modifications: skill names and cross-references are namespaced with
the `mp-` prefix to avoid collisions, an attribution comment is added after
each frontmatter block, and one compatibility fix (an upstream
`subagent_type=Explore` reference changed to `general-purpose`, which exists
in this environment). All other content is unmodified. The full upstream
collection, including his tracker-backed triage/to-prd/to-issues/implement
pipeline, is installable via `npx skills@latest add mattpocock/skills`.

License:

```
MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
