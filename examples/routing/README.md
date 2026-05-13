# Routing Example

This example demonstrates the `@grainular/router` functionality with the updated Nord framework.

## Running the Example

```bash
bun run start
```

Then open <http://localhost:5174/> in your browser.

## Features Demonstrated

### 1. Static Route Configuration

Routes are defined as a static array in `src/router.ts`:

- Home page (`/home`)
- About page (`/about`)
- User profile with params (`/user/:id`)
- Products page (`/products`)
- 404 page (`/404`)
- Root redirect (`/` → `/home`)

### 2. Route Parameters

The user page demonstrates dynamic route parameters:

- Visit `/user/123` to see user ID in the URL
- Parameters are reactive and accessible via `router.activatedRoute.params`

### 3. Query Parameters

User page also shows query string handling:

- Click links with query params to see them in action
- Accessible via `router.activatedRoute.searchParams`

### 4. Link Directives

Navigation links in the nav bar use `router.link` directive:

- Automatic active class styling (`link-active` attribute)
- Client-side navigation (no page reload)

### 5. Link Data

The User 123 link demonstrates `linkData()` for passing query params:

- Creates a grain that can be attached to links
- Passes data through the `ref` query parameter

### 6. Programmatic Navigation

Buttons throughout the app use `router.navigate()`:

- Navigate with path: `router.navigate(['/about'])`
- Navigate with query params: `router.navigate(['/user/456'], { search: { ref: 'button' } })`

### 7. Route Outlet

The main content area uses `router.outlet`:

- Automatically renders the matched route's component
- Cleans up previous component on route change

### 8. Not Found Handling

Accessing an undefined route redirects to `/404`:

- Try visiting `/nonexistent` to see it in action

## Files Structure

```
src/
  ├── main.ts              # App entry point
  ├── app.ts               # Main app component with navigation
  ├── router.ts            # Router configuration
  └── pages/
      ├── home.ts          # Home page
      ├── about.ts         # About page
      ├── user.ts          # User profile page (with params)
      ├── products.ts      # Products listing
      └── not-found.ts     # 404 page
```

## Testing Checklist

- [ ] Navigate between pages using nav links
- [ ] Click "Go to About (programmatic)" button
- [ ] Visit user profiles with different IDs
- [ ] Check active link highlighting
- [ ] View query parameters in user page
- [ ] Click products to navigate to user profiles
- [ ] Access a non-existent route to see 404
- [ ] Use browser back/forward buttons
- [ ] Check that route state persists on navigation
