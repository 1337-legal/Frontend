import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import React from 'react';

import BackendService from '@Services/BackendService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Alias management tab.
 * Lists existing aliases and provides create/delete actions with optimistic refresh.
 */
const AliasesTab: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: aliases = [], isLoading, isFetching, error: queryError, refetch } = useQuery<AliasRecord[]>({
        queryKey: ['aliases'],
        queryFn: () => BackendService.listAliases()
    });

    /** Creates a new alias and invalidates the alias list cache. */
    const createMutation = useMutation({
        mutationFn: () => BackendService.createAlias(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aliases'] }),
    });

    /** Deletes the provided alias and invalidates the alias list cache. */
    const deleteMutation = useMutation({
        mutationFn: (r: AliasRecord) => BackendService.deleteAlias(r),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aliases'] }),
    });

    /** Refetches the aliases table. */
    const handleReload = () => { void refetch(); };

    /** Triggers alias creation. */
    const handleCreate = () => createMutation.mutate();

    /**
     * Confirms and removes an alias.
     * @param r Alias record to delete.
     */
    const handleRemove = (r: AliasRecord) => {
        if (!confirm('Delete alias?')) return;
        deleteMutation.mutate(r);
    };

    const err = (createMutation.error || deleteMutation.error || queryError) as unknown;
    const errorMsg = err ? (err instanceof Error ? err.message : 'Request failed') : '';


    return (
        <div className="space-y-6">
            <section>
                <h2 className="mb-3 text-sm font-semibold tracking-wide text-neutral-200">Alias Management</h2>
                <div className="rounded-lg border border-neutral-800/70 bg-neutral-900/40 p-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <h3 className="text-sm font-semibold tracking-wide text-neutral-200">Aliases</h3>
                        <div className="flex gap-2">
                            <button onClick={handleReload} disabled={isFetching || isLoading} className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800/60 px-2 py-1.5 text-[11px] font-medium text-neutral-300 transition hover:border-orange-500/50 hover:text-orange-200 disabled:opacity-40">
                                <RefreshCw className={`mr-1 h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} /> Reload
                            </button>
                            <button onClick={handleCreate} disabled={createMutation.isPending} className="inline-flex items-center rounded-md bg-orange-500 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-900 shadow hover:bg-orange-400 disabled:opacity-50">
                                <Plus className="mr-1 h-3.5 w-3.5" /> New
                            </button>
                        </div>
                    </div>
                    {errorMsg && <p className="mb-3 text-xs text-red-400">{errorMsg}</p>}
                    <div className="max-h-64 overflow-auto rounded-md border border-neutral-800/60 bg-neutral-950/40">
                        <table className="w-full text-left text-[11px]">
                            <thead className="bg-neutral-900/70 text-neutral-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-3 py-2 font-medium">Alias</th>
                                    <th className="px-3 py-2 font-medium">Created</th>
                                    <th className="px-3 py-2" />
                                </tr>
                            </thead>
                            <tbody>
                                {aliases.length === 0 && !isLoading && (
                                    <tr><td colSpan={3} className="px-3 py-4 text-neutral-600">No aliases.</td></tr>
                                )}
                                {aliases.map(a => (
                                    <tr key={a.id || a.alias} className="border-t border-neutral-800/60 hover:bg-neutral-900/50">
                                        <td className="px-3 py-2 font-mono text-[10px] text-orange-200">{a.alias || a.address}</td>
                                        <td className="px-3 py-2 text-neutral-500">{a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}</td>
                                        <td className="px-2 py-2 text-right">
                                            <button onClick={() => handleRemove(a)} className="inline-flex items-center rounded-md border border-red-800/40 bg-red-900/10 px-2 py-1 text-[10px] font-medium text-red-300 hover:bg-red-900/20">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {isLoading && <tr><td colSpan={3} className="px-3 py-4 text-neutral-600">Loading…</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-[10px] text-neutral-500">Aliases are generated server-side & returned; deletion revokes routing.</p>
                </div >
            </section >
        </div >
    )
};

export default AliasesTab;