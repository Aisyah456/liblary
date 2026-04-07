# Technical Specification - Fix Errors in Abalone Project

## Technical Context
- **Backend**: PHP 8.2+, Laravel 12
- **Frontend**: React 19, TypeScript 5.7+, Inertia.js
- **Styling**: Tailwind CSS 4
- **Tools**: ESLint, Prettier, Laravel Pint, PHPUnit/Pest

## Task Difficulty: Medium
The task involves fixing a large number of linting and type errors (139 problems) across the React codebase, as well as ensuring PHP code follows project standards.

## Implementation Approach

### 1. PHP Code Quality
- Continue using `Laravel Pint` to fix style issues.
- Manually inspect any complex PHP errors that Pint cannot fix.

### 2. Frontend (React/TypeScript) Errors
- **`setState` in `useEffect`**: This is a common pattern in the current codebase to sync props to local state. I will evaluate if this can be replaced with derived state or if it's truly necessary. If necessary, I'll ensure it doesn't cause infinite loops or unnecessary re-renders.
- **Unused Variables/Imports**: Remove all unused variables, imports, and assignments identified by ESLint.
- **Type Safety**: Replace `any` types with specific interfaces or types, especially in navigation and data-table components.
- **React Compiler Warnings**: Address `react-hooks/incompatible-library` warnings where possible, or document why they are skipped.
- **Component Specific Fixes**:
    - `Resources.tsx`: Fix unused `EditReferenceModal`.
    - `TurnitinProcess.tsx`, `LibraryFree.tsx`, `References.tsx`: Fix `setState` in `useEffect`.
    - `Index.tsx` (News): Remove unused `current_page`.
    - Navigation types: Fix `any` types.

### 3. General Cleanup
- Run `npm run lint -- --fix` to catch low-hanging fruit.
- Run `npm run types` (tsc) to identify deeper type issues not caught by ESLint.

## Source Code Structure Changes
No major structural changes are expected. The focus is on modifying existing files to comply with linting and typing rules.

## Data Model / API / Interface Changes
No changes to the data model or API interfaces are expected.

## Verification Approach
1. **Linting**: `npm run lint` must pass with zero errors.
2. **Type Checking**: `npm run types` must pass with zero errors.
3. **PHP Style**: `composer lint` (Pint) must report no issues.
4. **Testing**: `php artisan test` (if tests exist) to ensure no regressions in functionality.
5. **Manual Verification**: Check key pages (Admin dashboard, News, etc.) to ensure they still function as expected.
