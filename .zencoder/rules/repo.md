---
description: Repository Information Overview
alwaysApply: true
---

# abalone Project Information

## Summary
A comprehensive Laravel 12.0 and React 19.2.0 application using **Inertia.js** for a modern full-stack development experience. The project is focused on managing library-related resources, including news, services, students, and academic materials like books, ebooks, and scientific works. It also features a CMS for administration and integration with Turnitin for plagiarism checking.

## Structure
- **app/**: Core application logic (Actions, Controllers, Models, Providers).
- **bootstrap/**: Laravel framework bootstrapping files.
- **config/**: Application-specific configuration (auth, database, session, etc.).
- **database/**: Database schema migrations, factories, and seeders (includes `database.sqlite`).
- **public/**: Public assets and entry point (`index.php`).
- **resources/**: Frontend source code (React components in `js/pages/`, CSS) and Blade views.
- **routes/**: Application route definitions (API, Web, CMS, Settings).
- **storage/**: Generated files, logs, and framework-level storage.
- **tests/**: Automated tests using **Pest PHP**.

## Language & Runtime
**Language**: PHP (8.2+), TypeScript, JavaScript  
**Framework**: Laravel 12.0, React 19.2.0  
**Build System**: Vite (with `laravel-vite-plugin`)  
**Package Manager**: Composer (PHP), npm (JS)

## Dependencies
**Main PHP Dependencies**:
- `laravel/framework`: ^12.0
- `inertiajs/inertia-laravel`: ^2.0
- `laravel/fortify`: ^1.30 (Authentication)
- `laravel/sanctum`: ^4.0 (API Token Auth)
- `tightenco/ziggy`: For using Laravel routes in JavaScript

**Main JS Dependencies**:
- `react`, `react-dom`: ^19.2.0
- `@inertiajs/react`: ^2.3.7
- `tailwindcss`: ^4.0.0
- `framer-motion`: ^12.34.3
- `lucide-react`: ^0.475.0
- `radix-ui`: UI primitive components
- `sonner`: Toast notifications

## Build & Installation
```bash
# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Build frontend assets
npm run build

# Setup environment and database
php artisan key:generate
php artisan migrate
```

## Main Files & Resources
- **Backend Entry**: `public/index.php`
- **Frontend Entry**: `resources/js/app.tsx`
- **Frontend Pages**: `resources/js/pages/**/*.tsx`
- **Routes**: `routes/web.php` (Web), `routes/api.php` (API), `routes/settings.php`
- **Vite Config**: `vite.config.ts`
- **Tailwind Config**: Uses Tailwind CSS 4.0 (integrated via Vite)

## Testing
**Framework**: Pest PHP  
**Test Location**: `tests/`  
**Naming Convention**: `*.php` in `tests/Feature` or `tests/Unit`  
**Configuration**: `phpunit.xml`, `tests/Pest.php`

**Run Command**:
```bash
php artisan test
# OR
./vendor/bin/pest
```
