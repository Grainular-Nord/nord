---
'@grainular/nord': minor
---

Remove attributes whose complete bound value is `null` or `undefined` and restore them when the value becomes defined. Nullish values in mixed attributes render as empty segments. The `attr` directive now applies the same attribute rules in SSR, including boolean attributes and escaping. Direct attribute interpolation in SSR retains its existing text-based behavior.
