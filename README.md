# Store

A fine-grained reactive state management library for React with automatic dependency tracking, normalized data storage, and time-travel debugging.

## Motivation

Modern React applications often struggle with state management complexity:

- **Over-rendering**: Traditional state libraries trigger re-renders for any state change, even when a component only uses a small portion of the data
- **Data duplication**: When the same entity appears in multiple lists, updates must be manually synchronized across all locations
- **Boilerplate**: Normalizing data, managing relationships, and handling loading/error states requires significant setup
- **Debugging difficulty**: Understanding how state changes propagate through the application is challenging

This library addresses these issues by:

1. **Property-level reactivity**: Using ES6 Proxy to track which properties each component accesses, enabling surgical re-renders only when accessed properties change
2. **Automatic normalization**: Items are stored once and referenced by key; lists hold references, not copies. Update an item anywhere and all lists automatically reflect the change
3. **Declarative data fetching**: Define resolvers once and the library handles loading states, caching, and error handling
4. **Built-in time-travel**: Every state change is tracked with transaction IDs, enabling full history replay in the DevTools

## Installation

```bash
npm install store
```

## Setup

Create a client and wrap your application with the Provider:

```tsx
import { createClient } from 'store/react/client';

const { client, Provider } = createClient();

function App() {
  return (
    <Provider>
      <YourApplication />
    </Provider>
  );
}
```

### With DevTools

Wrap the Provider with DevToolsProvider for time-travel debugging:

```tsx
import { createClient } from 'store/react/client';
import { DevToolsProvider } from 'store/devTools/DevToolsProvider';

const { client, Provider } = createClient();

function App() {
  return (
    <Provider>
      <DevToolsProvider>
        <YourApplication />
      </DevToolsProvider>
    </Provider>
  );
}
```

## Overview

### Defining Hooks

Create typed hooks for fetching individual items:

```tsx
import { createItemHook } from 'store/hooks/createItemHook';

type Post = { id: number; title: string; body: string };

const usePost = createItemHook<Post, number, { id: number }>({
  key: 'Post',
  getId: (args) => args.id,
  resolver: async (args) => {
    const response = await fetch(`/api/posts/${args.id}`);
    return response.json();
  },
});
```

Create hooks for fetching lists:

```tsx
import { createListHook } from 'store/hooks/createListHook';

const usePosts = createListHook<Post, number, { page: number }>({
  key: 'Post',
  getId: (post) => post.id,
  resolver: async (args) => {
    const response = await fetch(`/api/posts?page=${args.page}`);
    return response.json();
  },
});
```

### Using Hooks in Components

```tsx
function PostDetail({ id }: { id: number }) {
  const { data: post, isLoading, error } = usePost({ id });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}

function PostList() {
  const { data: posts, isLoading } = usePosts({ page: 1 });

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {posts?.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Mutations

Create, update, and delete operations with automatic cache updates:

```tsx
import { createMutationHook } from 'store/hooks/createMutationHook';

const useCreatePost = createMutationHook<Post, number, { title: string; body: string }>({
  key: 'Post',
  operation: 'create',
  getId: (post) => post.id,
  resolver: async (args) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(args),
    });
    return response.json();
  },
});

const useUpdatePost = createMutationHook<Post, number, { id: number; title: string }>({
  key: 'Post',
  operation: 'update',
  getId: (args) => args.id,
  resolver: async (args) => {
    const response = await fetch(`/api/posts/${args.id}`, {
      method: 'PATCH',
      body: JSON.stringify(args),
    });
    return response.json();
  },
});

const useDeletePost = createMutationHook<Post, number, { id: number }>({
  key: 'Post',
  operation: 'delete',
  getId: (args) => args.id,
  resolver: async (args) => {
    await fetch(`/api/posts/${args.id}`, { method: 'DELETE' });
    return { id: args.id };
  },
});
```

Using mutations in components:

```tsx
function CreatePostForm() {
  const { mutation: createPost, isLoading } = useCreatePost();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createPost({ title: 'New Post', body: 'Content here' });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isLoading}>Create Post</button>
    </form>
  );
}
```

### Tracking Newly Created Items

Track items created during the current session:

```tsx
import { createNewItemsHook } from 'store/hooks/createNewItemsHook';

const useNewPosts = createNewItemsHook<Post>({ key: 'Post' });

function NewPostsBanner() {
  const { data: newPosts } = useNewPosts();

  if (!newPosts?.length) return null;

  return <div>{newPosts.length} new posts created this session</div>;
}
```

## Architecture

### Store Structure

Each entry in the store contains:

```
StoreEntry = {
  externals: {           // Observable state (triggers re-renders)
    data: T | null,
    error: unknown,
    isLoading: boolean,
    isFetched: boolean,
  },
  internals: {           // Internal metadata (does not trigger re-renders)
    forceChange: fn,     // Triggers cascading updates
    referencedBy: Set,   // Lists that reference this item
    lastTransactionId: number,
  }
}
```

### Key System

Items and lists are stored with namespaced keys:

- Items: `"Post:item:1"`, `"Post:item:2"`
- Lists: `"Post:list:{\"page\":1}"`
- New items: `"Post:new-items"`

### Reference System

Lists store references instead of data copies:

```
List entry data: [
  { referenceKey: "Post:item:1" },
  { referenceKey: "Post:item:2" },
]
```

When an item is updated, all lists in its `referencedBy` set are automatically notified, triggering re-renders only in components that access the changed data.

### Property Tracking

The library uses ES6 Proxy to intercept property access. If a component only reads `data.title`, it won't re-render when `data.body` changes:

```tsx
function PostTitle({ id }) {
  const { data } = usePost({ id });

  // Only re-renders when `title` changes, not when `body` changes
  return <h1>{data?.title}</h1>;
}
```

### Three-Tier API

1. **Core functions** (`src/core/`): Framework-agnostic primitives returning `{ subscribe, getSnapshot, setState }`
2. **Hook factories** (`src/hooks/`): React integration using `useSyncExternalStore`
3. **React layer** (`src/react/`): Context-based store injection

This separation allows the core logic to be used outside React if needed.
