type AliasRecord = {
    id?: string;
    alias?: string;
    address?: string;
    status?: 'active' | 'disabled';
    createdAt?: string;
    [k: string]: unknown
};
