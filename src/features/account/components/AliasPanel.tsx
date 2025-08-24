import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import Backend from '@Services/BackendService';

interface Props { className?: string }

const AliasPanel: React.FC<Props> = ({ className }) => {
    const [aliases, setAliases] = useState<AliasRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string>('');

    const load = async () => {
        setLoading(true); setError('');
        try { setAliases(await Backend.listAliases()); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Load failed'); }
        finally { setLoading(false); }
    };

    const create = async () => {
        setCreating(true); setError('');
        try { await Backend.createAlias(); await load(); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Create failed'); }
        finally { setCreating(false); }
    };

    const remove = async (r: AliasRecord) => {
        if (!confirm('Delete alias?')) return;
        try { await Backend.deleteAlias(r); await load(); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Delete failed'); }
    };

    useEffect(() => { load(); }, []);

    return (
        <div className={`rounded-lg border border-neutral-800/70 bg-neutral-900/40 p-5 ${className || ''}`}>
            <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold tracking-wide text-neutral-200">Aliases</h3>
                <div className="flex gap-2">
                    <button onClick={load} disabled={loading} className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800/60 px-2 py-1.5 text-[11px] font-medium text-neutral-300 transition hover:border-orange-500/50 hover:text-orange-200 disabled:opacity-40">
                        <RefreshCw className={`mr-1 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Reload
                    </button>
                    <button onClick={create} disabled={creating} className="inline-flex items-center rounded-md bg-orange-500 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-900 shadow hover:bg-orange-400 disabled:opacity-50">
                        <Plus className="mr-1 h-3.5 w-3.5" /> New
                    </button>
                </div>
            </div>
            {error && <p className="mb-3 text-xs text-red-400">{error}</p>}
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
                        {aliases.length === 0 && !loading && (
                            <tr><td colSpan={3} className="px-3 py-4 text-neutral-600">No aliases.</td></tr>
                        )}
                        {aliases.map(a => (
                            <tr key={a.id || a.alias} className="border-t border-neutral-800/60 hover:bg-neutral-900/50">
                                <td className="px-3 py-2 font-mono text-[10px] text-orange-200">{a.alias || a.address}</td>
                                <td className="px-3 py-2 text-neutral-500">{a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}</td>
                                <td className="px-2 py-2 text-right">
                                    <button onClick={() => remove(a)} className="inline-flex items-center rounded-md border border-red-800/40 bg-red-900/10 px-2 py-1 text-[10px] font-medium text-red-300 hover:bg-red-900/20">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {loading && <tr><td colSpan={3} className="px-3 py-4 text-neutral-600">Loading…</td></tr>}
                    </tbody>
                </table>
            </div>
            <p className="mt-3 text-[10px] text-neutral-500">Aliases are generated server-side & returned; deletion revokes routing.</p>
        </div>
    );
};

export default AliasPanel;