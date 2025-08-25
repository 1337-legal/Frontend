import { Key, RefreshCw } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import Backend from '@Services/BackendService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const EncryptionTab: React.FC = () => {
    const qc = useQueryClient();
    const { data: user } = useQuery({ queryKey: ['user'], queryFn: () => Backend.getUser() });

    const [pgpKey, setPgpKey] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => { setPgpKey(user?.pgpPublicKey || ''); }, [user?.pgpPublicKey]);

    const pgpFingerprint = useMemo(() => {
        if (!pgpKey) return '';
        // Simple pseudo-fingerprint: last 16 chars of a basic hash substitute
        try {
            const clean = pgpKey.replace(/\s+/g, '').slice(-32);
            return clean ? `…${clean}` : '';
        } catch { return ''; }
    }, [pgpKey]);

    const saveMutation = useMutation({
        mutationFn: (key: string) => Backend.updateUser({ pgpPublicKey: key }),
        onSuccess: () => { setStatus('Key saved'); qc.invalidateQueries({ queryKey: ['user'] }); },
        onError: (e: unknown) => setStatus(e instanceof Error ? e.message : 'Save failed'),
    });
    const removeMutation = useMutation({
        mutationFn: () => Backend.updateUser({ pgpPublicKey: null }),
        onSuccess: () => { setStatus('Key removed'); qc.invalidateQueries({ queryKey: ['user'] }); },
        onError: (e: unknown) => setStatus(e instanceof Error ? e.message : 'Remove failed'),
    });

    return (
        <div className="space-y-10">
            <section className="rounded-lg border border-neutral-800/70 bg-neutral-900/40 p-5">
                <div className="mb-3 flex items-center gap-2">
                    <Key className="h-4 w-4 text-orange-300" />
                    <h2 className="text-sm font-semibold tracking-wide text-neutral-200">PGP End‑to‑End Encryption</h2>
                </div>
                <p className="mb-4 text-[11px] text-neutral-500">Provide an ASCII‑armored public key. Supported operations encrypt outbound content with this key in addition to transport security.</p>
                <textarea
                    value={pgpKey}
                    onChange={e => setPgpKey(e.target.value)}
                    placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----"
                    className="mb-3 h-40 w-full resize-none rounded-md bg-neutral-950/60 px-3 py-2 text-[11px] font-mono leading-tight text-neutral-100 outline-none focus:bg-neutral-900/70 focus:ring-2 focus:ring-orange-500/30" />
                {pgpFingerprint && (
                    <p className="mb-2 text-[10px] font-medium text-neutral-400">Fingerprint: <span className="text-orange-300">{pgpFingerprint}</span></p>
                )}
                <div className="flex flex-wrap gap-2 text-[11px]">
                    <button onClick={() => saveMutation.mutate(pgpKey.trim())} disabled={!pgpKey.trim() || saveMutation.isPending} className="inline-flex items-center rounded-md bg-orange-500 px-3 py-1.5 font-semibold text-neutral-900 hover:bg-orange-400 disabled:opacity-40">
                        {saveMutation.isPending ? <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Key className="mr-1 h-3.5 w-3.5" />} {saveMutation.isPending ? 'Saving...' : 'Save Key'}
                    </button>
                    <button onClick={() => removeMutation.mutate()} disabled={!user?.pgpPublicKey || removeMutation.isPending} className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800/60 px-3 py-1.5 font-medium text-neutral-300 transition hover:border-orange-500/50 hover:text-orange-200 disabled:opacity-40">Remove</button>
                    <button onClick={() => setPgpKey('')} disabled={saveMutation.isPending || removeMutation.isPending || (!pgpKey && !user?.pgpPublicKey)} className="rounded-md px-3 py-1.5 font-medium text-neutral-500 hover:text-orange-300 disabled:opacity-30">Clear</button>
                </div>
                {status && <p className="mt-2 text-[10px] text-neutral-400">{status}</p>}
            </section>
        </div>
    );
};

export default EncryptionTab;