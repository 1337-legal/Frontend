import { AlertCircle, Clipboard, Plus, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

declare global { interface Window { __1337Ext?: unknown } }

interface Props {
    lastCreated: string;
    quickCreating: boolean;
    onGenerate: () => void;
}

const AutofillTab: React.FC<Props> = ({ lastCreated, quickCreating, onGenerate }) => {
    const [copied, setCopied] = useState(false);
    const [justGenerated, setJustGenerated] = useState(false);
    const aliasValue = lastCreated || '';

    const copy = async () => {
        if (!aliasValue) return;
        try { await navigator.clipboard.writeText(aliasValue); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {/* noop */ }
    };

    // Auto-copy when a new alias appears
    useEffect(() => {
        if (aliasValue && justGenerated) {
            copy();
            setJustGenerated(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aliasValue]);

    const handleGenerate = () => {
        setJustGenerated(true); // flag to copy after parent updates lastCreated
        onGenerate();
    };

    const extensionDetected = typeof window.__1337Ext !== 'undefined';

    return (
        <div className="space-y-6">
            <section>
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="mb-1 text-sm font-semibold tracking-wide text-neutral-200">Quick Alias</h2>
                        <p className="text-[11px] leading-relaxed text-neutral-500 max-w-md">Generate a random disposable alias for forms. It routes through your forwarding address (if configured) while keeping your real inbox private.</p>
                    </div>
                    <div className="rounded-md border border-neutral-800/60 bg-neutral-900/40 px-3 py-2 text-[10px] text-neutral-400">
                        <span className={extensionDetected ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold flex items-center gap-1'}>
                            {!extensionDetected && <AlertCircle className="h-3.5 w-3.5" />}Autofill {extensionDetected ? 'Enabled' : 'Disabled'}
                        </span>
                        {!extensionDetected && <span className="mt-1 block font-normal text-neutral-500">Browser extension not detected.</span>}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end">
                        <div className="flex-1 min-w-[240px]">
                            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-neutral-500">Current Alias</label>
                            <div className="flex items-stretch rounded-md border border-neutral-800/60 bg-neutral-950/50 focus-within:border-orange-500/50">
                                <input
                                    value={aliasValue}
                                    readOnly
                                    placeholder="(none yet)"
                                    className="flex-1 bg-transparent px-2 py-2 text-[11px] font-mono text-orange-200 placeholder-neutral-600 outline-none"
                                />
                                <button onClick={copy} disabled={!aliasValue} className="px-2 text-[10px] font-medium text-neutral-400 hover:text-orange-300 disabled:opacity-40" aria-live="polite">{copied ? 'Copied' : <Clipboard className="h-3.5 w-3.5" />}</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button onClick={handleGenerate} disabled={quickCreating} className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-[11px] font-semibold text-neutral-900 shadow hover:bg-orange-400 disabled:opacity-50">
                                    {quickCreating ? <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Plus className="mr-1 h-3.5 w-3.5" />} {quickCreating ? 'Generating...' : 'Generate'}
                                </button>
                                {copied && (
                                    <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full rounded-md border border-neutral-800/60 bg-neutral-900/90 px-2 py-1 text-[10px] font-medium text-orange-300 shadow">
                                        Copied
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {!extensionDetected && (
                        <div className="mt-1 rounded-md border border-neutral-800/60 bg-neutral-900/40 px-3 py-2 text-[10px] text-neutral-400">
                            <p className="mb-1"><strong className="text-orange-300">Tip:</strong> Install the extension to autofill aliases directly into forms (context menu + auto‑replace).</p>
                            <div className="flex flex-wrap gap-2">
                                <a href="https://chromewebstore.google.com" target="_blank" rel="noreferrer" className="rounded bg-orange-500/90 px-2 py-1 font-semibold text-neutral-900 hover:bg-orange-400">Chrome</a>
                                <a href="https://addons.mozilla.org" target="_blank" rel="noreferrer" className="rounded border border-neutral-700 bg-neutral-800/60 px-2 py-1 font-medium text-neutral-300 hover:border-orange-500/40 hover:text-orange-200">Firefox</a>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-neutral-800/60 bg-neutral-900/40 p-4">
                    <h3 className="mb-1 text-[11px] font-semibold tracking-wide text-neutral-300">Alias Pattern</h3>
                    <p className="text-[10px] text-neutral-500">Aliases are random human‑readable words ensuring low collision while staying memorizable.</p>
                </div>
                <div className="rounded-lg border border-neutral-800/60 bg-neutral-900/40 p-4">
                    <h3 className="mb-1 text-[11px] font-semibold tracking-wide text-neutral-300">Forward Routing</h3>
                    <p className="text-[10px] text-neutral-500">Mail arrives at your forwarding inbox; upstream services never see your real address.</p>
                </div>
                <div className="rounded-lg border border-neutral-800/60 bg-neutral-900/40 p-4">
                    <h3 className="mb-1 text-[11px] font-semibold tracking-wide text-neutral-300">Revocation</h3>
                    <p className="text-[10px] text-neutral-500">Delete an alias any time to immediately stop future delivery attempts.</p>
                </div>
            </section>
        </div>
    );
};

export default AutofillTab;