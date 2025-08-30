# Project Overview

This is a React web application built with Vite, designed for managing information with user authentication and administrative features. It utilizes Firebase for backend services, including authentication and potentially other functionalities like data storage and cloud functions.

Key features include:
*   User authentication (login, password reset)
*   Dashboard for displaying key information
*   Documentation section with a table of contents
*   Admin panel for managing users and system reports (admin-only access)

The project is structured as a single-page application (SPA) and uses `react-router-dom` for navigation.

# Building and Running

This project uses `npm` for package management and `Vite` for development and building.

## Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js)
*   Firebase CLI (for deployment)

## Installation

1.  Navigate to the project root directory:
    ```bash
    cd /home/user/dev/DH23VT
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Development

To run the application in development mode:

```bash
npm run dev
```

This will start a development server, usually accessible at `http://localhost:5173`.

## Building

To create a production-ready build:

```bash
npm run build:prod
```

To create a test build:

```bash
npm run build:test
```

The build output will be located in the `dist/` directory.

## Previewing a Build

To preview the production build locally:

```bash
npm run preview
```

## Deployment

This project is configured for deployment to Firebase Hosting.

To deploy the production build to Firebase Hosting:

```bash
npm run deploy
```

To deploy the test build to a Firebase Hosting channel named 'test':

```bash
npm run code
```

**Note:** Ensure you have the Firebase CLI installed and configured (`firebase login`, `firebase use --add`).

# Development Conventions

## Linting

ESLint is configured to enforce code style and identify potential issues.

To run the linter:

```bash
npm run lint
```

The configuration is defined in `eslint.config.js` and includes rules for React hooks and refresh. It also has specific rules for Firebase Cloud Functions (if a `functions` directory exists).

## Project Structure

*   `src/`: Contains the main application source code.
    *   `src/assets/`: Static assets like images.
    *   `src/components/`: Reusable React components, often categorized into `shared/`.
    *   `src/hooks/`: Custom React hooks.
    *   `src/pages/`: Top-level page components for different routes (e.g., `AdminPage`, `DashboardPage`).
*   `public/`: Public assets served directly by Vite.
*   `dist/`: Build output directory (ignored by ESLint).
*   `.env.production`, `.env.test`: Environment variables for different build modes.
*   `firebase.json`, `.firebaserc`, `serviceAccountKey.json`: Firebase configuration files.
*   `vite.config.js`: Vite build configuration.
*   `eslint.config.js`: ESLint configuration.
*   `package.json`: Project metadata and scripts.
*   `README.md`: Project overview and usage instructions (in Vietnamese).
