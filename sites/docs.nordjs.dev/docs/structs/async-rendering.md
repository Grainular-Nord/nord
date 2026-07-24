---
title: Async rendering
description: Represent pending, resolved, and failed asynchronous work.
layout: docs
---

# Async rendering

Nørd structs can connect promises and suspended work to a local DOM region.

## `$await`

Pass `$await` a promise and define the fragment for its fulfilled value. The promise affects only this region of the page.

```ts
import { $await, html } from '@grainular/nord';

const user = fetch('/api/user').then((response) => response.json() as Promise<{ name: string }>);

const Profile = () => html` ${$await(user).$then((value) => html`<h1>${value.name}</h1>`)} `;
```

## Pending content

Use `.$pending` to render while the promise is unresolved. During server rendering, Aurora and Nørd render this pending branch because the server does not wait for browser work.

```ts
$await(user)
    .$then((value) => html`<h1>${value.name}</h1>`)
    .$pending(() => html`<p aria-busy="true">Loading profile…</p>`);
```

## Resolved content

`.$then` receives the resolved value. It returns an ordinary fragment, so resolved content can contain components, directives, and further control flow.

## Error content

Add `.$catch` to display a local failure state. The callback receives the rejection value as `unknown`.

```ts
$await(user)
    .$then((value) => html`<h1>${value.name}</h1>`)
    .$pending(() => html`<p>Loading profile…</p>`)
    .$catch(() => html`<p>Could not load the profile.</p>`);
```

## `$suspend`

`$suspend` is a compact form for components that may return a fragment or a promise of one. It is especially useful for lazy imports.

```ts
import { $suspend, html } from '@grainular/nord';

const Settings = () =>
    html`${$suspend(() => import('./settings').then(({ SettingsPanel }) => SettingsPanel()), {
        pending: () => html`<p>Loading settings…</p>`,
        error: () => html`<p>Settings are unavailable.</p>`,
    })}`;
```

## `$try`

`$try` is a synchronous error boundary for rendering code that might throw. It catches errors raised while its initial fragment is created; it does not catch event-handler errors or later promise rejections.

```ts
import { $try, html } from '@grainular/nord';

const SafePreview = () => html` ${$try(() => renderPreview()).$catch(() => html`<p>Preview unavailable.</p>`)} `;
```
