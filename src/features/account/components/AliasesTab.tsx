import { Marker, PowerSquare, ReloadSquare, TrashSquare } from '@Components/icons/Lattice';
import { Button } from '@Components/ui/button';
import { Panel } from '@Components/ui/panel';
import BackendService from '@Services/BackendService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

const StatusChip: React.FC<{ active: boolean }> = ({ active }) => (
    <span
        className={cn(
            'inline-flex w-fit items-center gap-2 border px-2.5 py-1',
            active ? 'border-emerald-400' : 'border-neutral-700',
        )}
    >
        <Marker size={5} className={active ? 'bg-emerald-400' : 'bg-neutral-500'} />
        <span
            className={cn(
                'font-mono text-[9px] font-semibold uppercase tracking-[0.14em]',
                active ? 'text-emerald-400' : 'text-neutral-400',
            )}
        >
            {active ? 'Active' : 'Disabled'}
        </span>
    </span>
);

const AliasesTab: React.FC = () => {
    const queryClient = useQueryClient();
    const [aliasToDelete, setAliasToDelete] = useState<AliasRecord | null>(null);

    const {
        data: aliases = [],
        isLoading,
        isFetching,
        error: queryError,
        refetch,
    } = useQuery<AliasRecord[]>({
        queryKey: ['aliases'],
        queryFn: () => BackendService.listAliases(),
    });

    const createMutation = useMutation({
        mutationFn: () => BackendService.createAlias(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aliases'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (r: AliasRecord) => BackendService.deleteAlias(r),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['aliases'] });
            setAliasToDelete(null);
        },
    });

    const toggleMutation = useMutation({
        mutationFn: (r: AliasRecord) => BackendService.toggleAliasStatus(r),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aliases'] }),
    });

    const handleReload = () => {
        void refetch();
    };

    const handleCreate = () => createMutation.mutate();

    const handleRemove = (r: AliasRecord) => {
        setAliasToDelete(r);
    };

    const handleToggle = (r: AliasRecord) => toggleMutation.mutate(r);

    const confirmDelete = () => {
        if (aliasToDelete) {
            deleteMutation.mutate(aliasToDelete);
        }
    };

    const cancelDelete = () => {
        setAliasToDelete(null);
    };

    const err = (createMutation.error || deleteMutation.error || toggleMutation.error || queryError) as unknown;
    const errorMsg = err ? (err instanceof Error ? err.message : 'Request failed') : '';

    const ordered = aliases.toReversed();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3.5">
                        <Marker size={10} />
                        <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-[0.03em] text-neutral-100">
                            Alias management
                        </h1>
                    </div>
                    <p className="pl-6 font-mono text-[11px] leading-relaxed text-neutral-500">
                        Aliases are generated server-side. Deletion revokes routing immediately.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleReload} disabled={isFetching || isLoading}>
                        <ReloadSquare className={cn('mr-1 h-3.5 w-3.5', isFetching && 'animate-spin')} /> Reload
                    </Button>
                    <Button onClick={handleCreate} disabled={createMutation.isPending}>
                        <Plus className="mr-1 h-3.5 w-3.5" /> {createMutation.isPending ? 'Creating…' : 'New alias'}
                    </Button>
                </div>
            </div>

            {errorMsg && (
                <p className="border-l-2 border-red-400 bg-red-500/5 px-4 py-3 font-mono text-xs text-red-400">
                    {errorMsg}
                </p>
            )}

            <Panel ticks className="flex flex-col">
                <div className="flex h-15 items-center justify-between gap-4 border-b border-neutral-800 px-6">
                    <div className="flex items-center gap-3">
                        <Marker size={8} />
                        <h2 className="font-display text-[17px] font-semibold uppercase tracking-[0.06em] text-neutral-100">
                            Aliases
                        </h2>
                        <span className="border border-neutral-800 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                            {String(aliases.length).padStart(2, '0')} total
                        </span>
                    </div>
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500 sm:inline">
                        Sorted by creation
                    </span>
                </div>

                {}
                <div className="hidden h-10 items-center gap-4 border-b border-neutral-800 bg-[#0d0d0d] px-6 md:grid md:grid-cols-[minmax(0,1fr)_130px_190px_104px]">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Alias
                    </span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Status
                    </span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Created
                    </span>
                    <span className="text-right font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Actions
                    </span>
                </div>

                <div className="flex max-h-[26rem] flex-col overflow-y-auto">
                    {ordered.length === 0 && !isLoading && (
                        <p className="px-6 py-8 font-mono text-xs text-neutral-500">No aliases yet.</p>
                    )}
                    {isLoading && <p className="px-6 py-8 font-mono text-xs text-neutral-500">Loading…</p>}
                    {ordered.map((a, i) => {
                        const active = a.status === 'active';
                        return (
                            <div
                                key={a.id || a.alias}
                                className={cn(
                                    'grid grid-cols-1 items-start gap-3 border-b border-neutral-800/70 px-6 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_130px_190px_104px] md:items-center',
                                    i % 2 === 0 ? 'bg-[#101010]' : 'bg-[#0d0d0d]',
                                )}
                            >
                                <span
                                    className={cn(
                                        'truncate font-mono text-[13px]',
                                        active ? 'text-orange-300' : 'text-neutral-500',
                                    )}
                                >
                                    {a.alias || a.address}
                                </span>
                                <StatusChip active={active} />
                                <span className="font-mono text-[11px] text-neutral-500">
                                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}
                                </span>
                                <div className="flex gap-2 md:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(a)}
                                        disabled={toggleMutation.isPending}
                                        title={active ? 'Disable alias' : 'Enable alias'}
                                        aria-label={active ? 'Disable alias' : 'Enable alias'}
                                        className={cn(
                                            'flex h-11 w-11 items-center justify-center border transition-colors disabled:opacity-40 md:h-8 md:w-8',
                                            active
                                                ? 'border-neutral-700 text-amber-400 hover:border-amber-400'
                                                : 'border-emerald-400/60 text-emerald-400 hover:border-emerald-400',
                                        )}
                                    >
                                        <PowerSquare className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(a)}
                                        title="Burn alias"
                                        aria-label="Burn alias"
                                        className="flex h-11 w-11 items-center justify-center border border-neutral-700 text-red-400 transition-colors hover:border-red-400 md:h-8 md:w-8"
                                    >
                                        <TrashSquare className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Panel>

            <div className="grid gap-5 md:grid-cols-3">
                {[
                    {
                        title: 'Alias pattern',
                        body: 'Random human-readable triplets — low collision, still memorizable.',
                    },
                    {
                        title: 'Forward routing',
                        body: 'Mail arrives at your forwarding inbox; upstream services never see your real address.',
                    },
                    {
                        title: 'Revocation',
                        body: 'Burn an alias any time to immediately stop future delivery attempts.',
                    },
                ].map((t) => (
                    <div key={t.title} className="border border-neutral-800 bg-[#0d0d0d] p-5">
                        <div className="mb-2.5 flex items-center gap-2.5">
                            <Marker />
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                                {t.title}
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed text-neutral-500">{t.body}</p>
                    </div>
                ))}
            </div>

            {aliasToDelete &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                        <Panel
                            tone="danger"
                            frameClassName="w-full max-w-md"
                            className="relative bg-neutral-950 p-6 sm:p-8"
                        >
                            <button
                                type="button"
                                onClick={cancelDelete}
                                aria-label="Close"
                                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-200"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="mb-6 flex flex-col gap-3">
                                <div className="flex h-12 w-12 items-center justify-center border border-red-400 text-red-400">
                                    <TrashSquare className="h-6 w-6" />
                                </div>
                                <h3 className="font-display text-2xl font-semibold uppercase tracking-[0.04em] text-neutral-100">
                                    Burn alias?
                                </h3>
                                <p className="font-mono text-[11px] text-neutral-500">
                                    This action is permanent and cannot be undone.
                                </p>
                            </div>

                            <div className="mb-5 border border-neutral-800 bg-[#0d0d0d] px-4 py-3">
                                <span className="font-mono text-sm break-all text-orange-300">
                                    {aliasToDelete.alias || aliasToDelete.address}
                                </span>
                            </div>

                            <div className="mb-6 flex flex-col gap-2.5">
                                <div className="flex items-start gap-3 border-l-2 border-amber-400 bg-amber-400/10 px-4 py-3">
                                    <Marker size={5} className="mt-1.5 bg-amber-400" />
                                    <p className="text-xs leading-relaxed text-amber-200/90">
                                        Once burned, this alias will be released and may be allocated to another user in
                                        the future. All mail routing to this alias will stop immediately.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3 border-l-2 border-emerald-400 bg-emerald-400/10 px-4 py-3">
                                    <Marker size={5} className="mt-1.5 bg-emerald-400" />
                                    <p className="text-xs leading-relaxed text-emerald-300/90">
                                        No link between your account and this email address will remain after deletion.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button variant="outline" className="w-full sm:flex-1" onClick={cancelDelete}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="w-full sm:flex-1"
                                    onClick={confirmDelete}
                                    disabled={deleteMutation.isPending}
                                >
                                    <TrashSquare className="mr-1 h-4 w-4" />
                                    {deleteMutation.isPending ? 'Burning…' : 'Burn alias'}
                                </Button>
                            </div>
                        </Panel>
                    </div>,
                    document.body,
                )}
        </div>
    );
};

export default AliasesTab;
