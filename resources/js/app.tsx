import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

// Inisialisasi tema sebelum app dimulai untuk mencegah flicker
initializeTheme();

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    // Pastikan menggunakan glob pattern yang benar dan return hasil resolve-nya
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        // Kamu bisa ganti warna ini ke teal-600 agar senada dengan UI usulan buku
        color: '#0d9488',
        showSpinner: true,
    },
});