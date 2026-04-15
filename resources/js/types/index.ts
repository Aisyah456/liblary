export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';


export const routes = {
    logout: () => ({ url: '/logout', method: 'post' }),

};

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
    // Index signature agar properti dinamis seperti 'faculties' bisa dibaca
    [key: string]: unknown; 
};