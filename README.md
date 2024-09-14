# RSS Feed Reader

## Description

This project is a modern RSS Feed Reader built with Next.js, React, and Prisma. It allows users to manage and read articles from multiple RSS feeds in a clean, user-friendly interface.

## Features

- Add, edit, and delete RSS feeds
- Fetch and display articles from multiple feeds
- Filter articles by All Articles, Unread, or Starred
- Responsive design with a sidebar for feed management and a main content area for articles
- Real-time updates using Server-Sent Events (SSE)
- Dark mode support
- Modern and Newspaper themes
- List and Grid view options for articles
- Full article view with content extraction
- Reading time estimation
- Automatic feed refresh
- Search functionality (coming soon)

## Tech Stack

- Next.js 13+ (App Router)
- React 18+
- TypeScript
- Prisma (ORM)
- SQLite (Database)
- Tailwind CSS (Styling)
- Shadcn UI (Component Library)

## Getting Started for Users

1. Clone the repository
2. Install dependencies:
   ```
   bun install
   ```
3. Set up the database:
   ```
   bunx prisma migrate dev
   ```
4. Run the development server:
   ```
   bun run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser
6. Start adding your favorite RSS feeds using the "Add Feed" button in the sidebar

## Developer Guide

### Project Structure

- `app/`: Next.js app directory
  - `api/`: API routes
  - `components/`: React components
  - `lib/`: Utility functions and Prisma client
  - `types/`: TypeScript type definitions
- `prisma/`: Prisma schema and migrations
- `public/`: Static assets

### Key Components

- `HomePage`: Main component that orchestrates the app's functionality
- `Sidebar`: Manages feed list and feed operations
- `ArticleList`: Displays articles from selected feeds
- `Header`: Contains filter buttons and current feed name
- `ArticleItem`: Individual article display
- `ArticleModal`: Modal for detailed article view

### Adding New Features

1. Create new components in the `app/components/` directory
2. Add new API routes in the `app/api/` directory if needed
3. Update the Prisma schema in `prisma/schema.prisma` for any database changes
4. Implement new functionality in the `HomePage` component or create new page components as needed
5. Update types in `app/types.ts` to reflect any new data structures

### Best Practices

- Follow the principles of Clean Code
- Use TypeScript for type safety
- Implement proper error handling and logging
- Write unit tests for new components and functions
- Use React hooks for state management and side effects
- Optimize performance using React's built-in features (e.g., useMemo, useCallback)
- Follow the Next.js App Router conventions for routing and API routes

### Extending Functionality

To add new features:

1. Plan the feature and how it fits into the existing architecture
2. Create new components or modify existing ones as needed
3. Update the database schema if required
4. Implement any necessary API routes
5. Add the feature to the main user interface (usually in the `HomePage` component)
6. Update this README with information about the new feature

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
