---
title: Conditional rendering
description: Render branches with $if and $switch.
layout: docs
---

# Conditional rendering

Conditional structs update only the active branch when their condition changes.

## `$if`

Pass `$if` a boolean subscribable and provide the fragment to render when it is true. Only the branch is replaced when the value changes.

```ts
import { grain } from '@grainular/grains';
import { $if, html } from '@grainular/nord';

const signedIn = grain(false);

const Account = () => html` ${$if(signedIn).$then(() => html`<button>Open account</button>`)} `;
```

## Else branches

Chain `.$else` when both states need content. The callbacks are evaluated only for the branch that becomes active.

```ts
const Status = () => html`
    ${$if(signedIn)
        .$then(() => html`<p>Welcome back.</p>`)
        .$else(() => html`<a href="/sign-in">Sign in</a>`)}
`;
```

## `$switch`

`$switch` selects one branch from a subscribable or getter. It is useful when several mutually exclusive states would make nested `$if` calls harder to read.

```ts
import { grain } from '@grainular/grains';
import { $switch, html } from '@grainular/nord';

const state = grain<'idle' | 'loading' | 'ready'>('idle');

const Panel = () => html`
    ${$switch(state)
        .$case('idle', () => html`<button>Load</button>`)
        .$case('loading', () => html`<p>Loading…</p>`)
        .$default(() => html`<p>Ready.</p>`)}
`;
```

## Matching cases

Cases use strict equality. Keep the values simple and stable, and always provide `.$default` for a state that is not represented by a case.

## Preserving surrounding DOM

The surrounding template is not part of the conditional region. Inputs retain their value and neighbouring components retain their state while a branch changes.

```ts
const Page = () => html`
    <input placeholder="This stays mounted" />
    ${$if(signedIn).$then(() => html`<p>Private content</p>`)}
`;
```
