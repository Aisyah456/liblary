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