declare module '@/routes/*' {
    const routeModule: any;
    export default routeModule;

    export const index: any;
    export const create: any;
    export const store: any;
    export const show: any;
    export const edit: any;
    export const update: any;
    export const destroy: any;
    export const send: any;
    export const email: any;
    export const confirm: any;
    export const disable: any;
    export const enable: any;
    export const qrCode: any;
    export const recoveryCodes: any;
    export const regenerateRecoveryCodes: any;
    export const secretKey: any;
}
