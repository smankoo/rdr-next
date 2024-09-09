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

## Tech Stack

- Next.js 13+ (App Router)
- React 18+
- TypeScript
- Prisma (ORM)
- SQLite (Database)
- Tailwind CSS (Styling)

## Project Structure

- `app/`: Next.js app directory
  - `api/`: API routes
  - `components/`: React components
  - `lib/`: Utility functions and Prisma client
  - `types/`: TypeScript type definitions
- `prisma/`: Prisma schema and migrations
- `public/`: Static assets

## Key Components

- `HomePage`: Main component that orchestrates the app's functionality
- `Sidebar`: Manages feed list and feed operations
- `ArticleList`: Displays articles from selected feeds
- `Header`: Contains filter buttons and current feed name
- `ArticleItem`: Individual article display
- `ArticleModal`: Modal for detailed article view

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up the database:
   ```
   npx prisma migrate dev
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## API Routes

- `/api/feeds`: CRUD operations for feeds
- `/api/articles`: Fetch articles
- `/api/sse`: Server-Sent Events for real-time updates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
