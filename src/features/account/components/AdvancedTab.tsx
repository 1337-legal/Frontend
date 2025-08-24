import { Key, RefreshCw } from 'lucide-react';
import React from 'react';

interface Props {
    aliasPanel: React.ReactNode;
    pgpKey: string;
    pgpFingerprint: string;
    pgpStatus: string;
    pgpSaving: boolean;
    onPGPChange: (v: string) => void;
    onSavePGP: () => void;
    onRemovePGP: () => void;
    onClearPGP: () => void;
    purgeStatus: string;
    purging: boolean;
    onPurge: () => void;
}

const AdvancedTab: React.FC<Props> = ({ aliasPanel, pgpKey, pgpFingerprint, pgpStatus, pgpSaving, onPGPChange, onSavePGP, onRemovePGP, onClearPGP, purgeStatus, purging, onPurge }) => (
    <div className="space-y-10">
        <section>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-neutral-200">Alias Management</h2>
            {aliasPanel}
        </section>
        <section className="rounded-lg border border-neutral-800/70 bg-neutral-900/40 p-5">
            <div className="mb-3 flex items-center gap-2">
                <Key className="h-4 w-4 text-orange-300" />
                <h2 className="text-sm font-semibold tracking-wide text-neutral-200">PGP End‑to‑End Encryption</h2>
            </div>
            <p className="mb-4 text-[11px] text-neutral-500">Provide an ASCII‑armored public key. Supported operations will encrypt outbound content with this key (in addition to transport security).</p>
            <textarea
                value={pgpKey}
                onChange={e => onPGPChange(e.target.value)}
                placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----"
                className="mb-3 h-40 w-full resize-none rounded-md bg-neutral-950/60 px-3 py-2 text-[11px] font-mono leading-tight text-neutral-100 outline-none focus:bg-neutral-900/70 focus:ring-2 focus:ring-orange-500/30" />
            {pgpFingerprint && (
                <p className="mb-2 text-[10px] font-medium text-neutral-400">Fingerprint: <span className="text-orange-300">{pgpFingerprint}</span></p>
            )}
            <div className="flex flex-wrap gap-2 text-[11px]">
                <button onClick={onSavePGP} disabled={!pgpKey.trim() || pgpSaving} className="inline-flex items-center rounded-md bg-orange-500 px-3 py-1.5 font-semibold text-neutral-900 hover:bg-orange-400 disabled:opacity-40">
                    {pgpSaving ? <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Key className="mr-1 h-3.5 w-3.5" />} {pgpSaving ? 'Saving...' : 'Save Key'}
                </button>
                <button onClick={onRemovePGP} disabled={!pgpFingerprint || pgpSaving} className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800/60 px-3 py-1.5 font-medium text-neutral-300 transition hover:border-orange-500/50 hover:text-orange-200 disabled:opacity-40">Remove</button>
                <button onClick={onClearPGP} disabled={pgpSaving || (!pgpKey && !pgpFingerprint)} className="rounded-md px-3 py-1.5 font-medium text-neutral-500 hover:text-orange-300 disabled:opacity-30">Clear</button>
            </div>
            {pgpStatus && <p className="mt-2 text-[10px] text-neutral-400">{pgpStatus}</p>}
        </section>
        <section className="rounded-lg border border-red-800/40 bg-red-950/10 p-5">
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-red-300">Danger Zone</h2>
            <p className="mb-3 text-[11px] text-red-300/70">Permanently delete all aliases & routing metadata. This cannot be undone.</p>
            <button onClick={onPurge} disabled={purging} className="rounded-md border border-red-800/60 bg-red-900/40 px-4 py-2 text-[11px] font-semibold text-red-200 hover:bg-red-900/60 disabled:opacity-40">{purging ? 'Purging...' : 'Purge Account'}</button>
            {purgeStatus && <p className="mt-2 text-[10px] text-red-300/80">{purgeStatus}</p>}
        </section>
    </div>
);

export default AdvancedTab;