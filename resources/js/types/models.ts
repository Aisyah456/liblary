export type AnyModel = Record<string, unknown>;

export type EresourceAccess = {
    id: number;
    user_id: number;
    resource_name: string;
    username_given: string | null;
    password_given: string | null;
    expiry_date: string | null;
    user?: { name: string };
    created_at: string;
};
