type AliasRecord = {
    id?: string;
    alias?: string;
    address?: string;
    status?: 'active' | 'disabled';
    nickname?: string | null;
    createdAt?: string;
    [k: string]: unknown
};
