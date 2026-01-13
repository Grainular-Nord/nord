---
description: Nørds core philosophies and tenets
---

# Tenets of Nørd

Nørd is a lightweight, reactive JavaScript framework for building single-page applications. Its design is determined by simplicity, performance, and developer-first ergonomics.

## Core Philosophy

- **Nørd is a JavaScript library for building reactive single-page applications.**
- **Nørd is dependency-free**, with zero third-party runtime dependencies.
- **Nørd embraces TypeScript**, but does not require it.
- **Nørd is a pure runtime framework**, and can run entirely without build tools.
- **Nørd embraces modern DX tools**, like Vite, even though they are optional.
- **Nørd is well tested**, with high coverage across its core primitives.

## Architecture & Reactivity

- **Nørd uses grains (signals) as reactive primitives**, but does not require them. Any subscribable that exposes a `subscribe` function can be used.
- **Nørd surgically updates DOM nodes** based on grain changes — no re-rendering, virtual DOM, or diffing involved.
- **Nørd utilizes** a component-based architecture**, enabling composition through reactive building blocks.
- **Nørd abstracts DOM logic**, but exposes it via directives for advanced control.
- **Nørd is SSR ready**, even though it's primary focus is runtime rendering.
- **Nørd aims to be performant** as possible, using a minimal api wrapper for modern browser technologies.

## Developer Experience

- **Nørd utilizes tagged template literals instead of JSX**, keeping it dependency-free and standards-aligned.
- **Nørd provides modern devtools**, including a browser inspector and IDE extensions for an elevated development experience.
