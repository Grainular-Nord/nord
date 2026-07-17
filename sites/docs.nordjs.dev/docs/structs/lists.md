---
title: Lists
description: Render reactive collections efficiently with $each.
layout: docs
---

# Lists

The `$each` struct maps iterable values to independently managed DOM fragments.

## Rendering an iterable

Use `$each` with a list and a render callback. Prefer `.$withKey` whenever items have a stable identifier.

```ts
import { grain } from '@grainular/grains';
import { $each, html } from '@grainular/nord';

const tasks = grain([
    { id: 'write', title: 'Write the guide' },
    { id: 'publish', title: 'Publish it' },
]);

const TaskList = () => html`
    <ul>
        ${$each(tasks)
            .$withKey((task) => task.id)
            .$as((task) => html`<li>${task.title}</li>`)}
    </ul>
`;
```

## Reactive collections

When the source is subscribable, `$each` reconciles it whenever it changes. Set a new array when updating a grain so subscribers receive the change.

```ts
tasks.update((current) => [...current, { id: 'review', title: 'Review the guide' }]);
```

Existing keyed items keep their DOM and lifecycle while Nørd inserts, removes, or moves only what changed.

## Item identity

Keys describe an item's identity, not its position. They must be unique among the current items and remain the same when an item moves.

`.$as` without `.$withKey` uses the item value itself as the key. That is fine for unique, stable object references, but a key function is safer for primitives, duplicate values, and objects recreated during updates.

The second render argument is a subscribable index. Use it directly when an item's displayed position should update after reordering.

```ts
$each(tasks)
    .$withKey((task) => task.id)
    .$as((task, index) => html`<li>${index}. ${task.title}</li>`);
```

## Adding and removing items

Adding an item renders one new fragment. Removing an item disconnects its nodes and runs cleanup registered by its directives and child components. Reordering keyed items moves the existing nodes instead of recreating them.

## Empty collections

`$each` renders nothing for an empty array. Pair it with a derived boolean and `$if` when the empty state needs its own markup.

```ts
import { derived } from '@grainular/grains';

const hasNoTasks = derived(tasks, (items) => items.length === 0);

const Tasks = () => html`
    ${$if(hasNoTasks)
        .$then(() => html`<p>No tasks yet.</p>`)
        .$else(() => TaskList())}
`;
```
