This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

# RIA Growth Catalyst - Market Screener (Case Study)

## Approach & Architecture

This application was built using a **highly scalable, feature-driven architecture** to ensure long-term maintainability and modularity, strictly adhering to modern React and Next.js best practices:

1. **Feature-Driven Design (`src/features/`)**: Instead of grouping by file type, code is grouped by business domain (e.g., `advisors`, `firm-profile`, `market-insights`). This isolates concerns and makes it easier for multiple developers to collaborate without conflicts.
2. **Clean Component Hierarchy (`src/components/`)**: Shared components are categorically separated (`charts`, `filters`, `table`, `ui`, `layout`). This avoids a bloated components directory and creates a clear boundary between domain-specific components (in `features/`) and reusable UI building blocks.
3. **App Router & Server Components (`src/app/`)**: Leverages Next.js App Router conventions for efficient rendering, clean routing, and improved performance.
4. **Structured Logic (`src/lib/`, `src/types/`, `src/store/`)**: Business logic (hooks, data fetching utilities), global types, and state management are safely extracted from UI components to maintain a clean separation of concerns.

## Tradeoffs Made

- **Static/Mocked Data**: As per the instructions, backend integration was omitted. We relied on static/mocked data for the initial prototype. This means state updates simulate data flows but do not persist.
- **Client-Side Filtering/Sorting**: Since no actual backend API was available, sorting and filtering are processed client-side. In a real-world scenario with thousands of RIA firms, this would be delegated to server-side search queries to optimize the browser's memory and initial load times.
- **State Management**: For a prototype, standard React state and context (or lightweight libraries) were favored over heavy enterprise solutions to maintain velocity and component simplicity without over-engineering.

## What I Would Do With More Time

1. **Virtualization & Infinite Scroll**: If dealing with extremely large datasets of RIA firms, I would implement table/list virtualization (e.g., `@tanstack/react-virtual`) to ensure seamless scrolling and 60 FPS performance by only rendering elements visible on the screen.
2. **Server-Side Pagination & Filtering**: Offload the heavy logic of sorting and filtering to a real API endpoint using Next.js Server Actions or API routes, fetching only the required segment of data.
3. **Comprehensive Testing**: Implement robust unit testing (Jest/React Testing Library) for complex filter logic, and rigorous E2E testing (Cypress/Playwright) for crucial user journeys to ensure stability during updates.
4. **Advanced Data Visualizations**: Integrate a more powerful charting library (like Recharts, Nivo, or D3) to provide deeply interactive financial analytics.
5. **Caching & Optimizations**: Utilize tools like React Query or Next.js data cache to provide instant navigation when users switch between previously viewed reports or filters.
