import {Bomb, Plus, Power, RefreshCw, Trash2, X} from 'lucide-react';
import React, {useState} from 'react';
import {createPortal} from 'react-dom';

import BackendService from '@Services/BackendService';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

/**
 * Alias management tab.
 * Lists existing aliases and provides create/delete actions with optimistic refresh.
 */
const AliasesTab: React.FC = () => {
    const queryClient = useQueryClient();
    const [aliasToDelete, setAliasToDelete] = useState<AliasRecord | null>(null);

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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['aliases'] });
            setAliasToDelete(null);
        },
    });

    /** Toggles alias status (active/disabled). */
    const toggleMutation = useMutation({
        mutationFn: (r: AliasRecord) => BackendService.toggleAliasStatus(r),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aliases'] }),
    });

    /** Refetches the aliases table. */
    const handleReload = () => { void refetch(); };

    /** Triggers alias creation. */
    const handleCreate = () => createMutation.mutate();

    /**
     * Opens the burn confirmation modal.
     * @param r Alias record to delete.
     */
    const handleRemove = (r: AliasRecord) => {
        setAliasToDelete(r);
    };

    /** Toggles alias status between active and disabled. */
    const handleToggle = (r: AliasRecord) => toggleMutation.mutate(r);

    /** Confirms alias deletion from the modal. */
    const confirmDelete = () => {
        if (aliasToDelete) {
            deleteMutation.mutate(aliasToDelete);
        }
    };

    /** Closes the burn confirmation modal. */
    const cancelDelete = () => {
        setAliasToDelete(null);
    };

    const err = (createMutation.error || deleteMutation.error || toggleMutation.error || queryError) as unknown;
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
                                    <th className="px-3 py-2 font-medium">Status</th>
                                    <th className="px-3 py-2 font-medium">Created</th>
                                    <th className="px-3 py-2" />
                                </tr>
                            </thead>
                            <tbody>
                                {aliases.length === 0 && !isLoading && (
                                    <tr><td colSpan={4} className="px-3 py-4 text-neutral-600">No aliases.</td></tr>
                                )}
                                {aliases.reverse().map(a => (
                                    <tr key={a.id || a.alias} className="border-t border-neutral-800/60 hover:bg-neutral-900/50">
                                        <td className="px-3 py-2 font-mono text-[10px] text-orange-200">{a.alias || a.address}</td>
                                        <td className="px-3 py-2">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-medium ${
                                                a.status === 'active' 
                                                    ? 'bg-green-900/30 text-green-400 ring-1 ring-green-500/30' 
                                                    : 'bg-neutral-800/50 text-neutral-500 ring-1 ring-neutral-700/50'
                                            }`}>
                                                {a.status === 'active' ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-neutral-500">{a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}</td>
                                        <td className="px-2 py-2 text-right flex gap-1 justify-end">
                                            <button
                                                onClick={() => handleToggle(a)}
                                                disabled={toggleMutation.isPending}
                                                className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-medium transition ${
                                                    a.status === 'active'
                                                        ? 'border-amber-800/40 bg-amber-900/10 text-amber-300 hover:bg-amber-900/20'
                                                        : 'border-green-800/40 bg-green-900/10 text-green-300 hover:bg-green-900/20'
                                                }`}
                                                title={a.status === 'active' ? 'Disable alias' : 'Enable alias'}
                                            >
                                                <Power className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => handleRemove(a)} className="inline-flex items-center rounded-md border border-red-800/40 bg-red-900/10 px-2 py-1 text-[10px] font-medium text-red-300 hover:bg-red-900/20">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {isLoading && <tr><td colSpan={4} className="px-3 py-4 text-neutral-600">Loading…</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-[10px] text-neutral-500">Aliases are generated server-side & returned; deletion revokes routing.</p>
                </div >
            </section >

            {aliasToDelete && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-md mx-4 rounded-xl border border-red-900/50 bg-neutral-950 p-6 shadow-2xl shadow-red-900/20">
                        <button
                            onClick={cancelDelete}
                            className="absolute right-3 top-3 rounded-md p-1 text-neutral-500 transition hover:bg-neutral-800 hover:text-neutral-300"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="mb-4 flex flex-col items-center text-center">
                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-red-600/20 to-orange-600/20 ring-1 ring-red-500/30">
                                <Bomb className="h-7 w-7 text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-100">Burn Alias?</h3>
                            <p className="mt-1 text-xs text-neutral-500">This action is permanent and cannot be undone.</p>
                        </div>

                        <div className="mb-4 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-center">
                            <span className="font-mono text-sm text-orange-300">{aliasToDelete.alias || aliasToDelete.address}</span>
                        </div>

                        <div className="mb-5 space-y-2">
                            <div className="flex items-start gap-3 rounded-lg border border-amber-800/40 bg-amber-900/10 px-4 py-3">
                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                    <span className="text-[10px] font-bold text-amber-400">!</span>
                                </div>
                                <p className="text-xs leading-relaxed text-amber-200/90">
                                    Once burned, this alias will be released and may be allocated to another user in the future. All mail routing to this alias will stop immediately.
                                </p>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg border border-green-800/40 bg-green-900/10 px-4 py-3">
                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                                    <span className="text-[10px] font-bold text-green-400">✓</span>
                                </div>
                                <p className="text-xs leading-relaxed text-green-300/90">
                                    No link between your account and this email address will remain after deletion.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800/60 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-neutral-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:from-red-500 hover:to-red-600 disabled:opacity-50"
                            >
                                <Bomb className="h-4 w-4" />
                                {deleteMutation.isPending ? 'Burning…' : 'Burn Alias'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div >
    )
};

export default AliasesTab;