import { Marker, ReloadSquare } from '@Components/icons/Lattice';
import { Button } from '@Components/ui/button';
import { Panel } from '@Components/ui/panel';
import BackendService from '@Services/BackendService';
import { Plus } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { cn } from '@/lib/utils';

declare global {
    interface Window {
        __1337Ext?: unknown;
    }
}

const AutofillTab: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [quickCreating, setQuickCreating] = useState(false);
    const [lastCreated, setLastCreated] = useState<string>('');

    const aliasValue = lastCreated || '';

    const copyText = useCallback(async (value: string) => {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    }, []);

    const quickCreate = async (): Promise<string> => {
        setQuickCreating(true);
        try {
            const r = (await BackendService.createAlias()) as unknown as { address?: string };
            const address = r?.address || 'created';
            setLastCreated(address);
            return address;
        } catch {
            setLastCreated('failed');
            return '';
        } finally {
            setQuickCreating(false);
        }
    };

    const handleGenerate = () => {
        void (async () => {
            const address = await quickCreate();
            await copyText(address);
        })();
    };

    const extensionDetected = typeof window.__1337Ext !== 'undefined';

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3.5">
                        <Marker size={10} />
                        <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-[0.03em] text-neutral-100">
                            Quick alias
                        </h1>
                    </div>
                    <p className="max-w-lg pl-6 font-mono text-[11px] leading-relaxed text-neutral-500">
                        Generate a random disposable alias for forms. It routes through your forwarding address while
                        keeping your real inbox private.
                    </p>
                </div>
                <div
                    className={cn(
                        'flex items-center gap-2.5 border px-3 py-2',
                        extensionDetected ? 'border-emerald-400' : 'border-amber-400',
                    )}
                >
                    <Marker size={5} className={extensionDetected ? 'bg-emerald-400' : 'bg-amber-400'} />
                    <span
                        className={cn(
                            'font-mono text-[10px] font-semibold uppercase tracking-[0.14em]',
                            extensionDetected ? 'text-emerald-400' : 'text-amber-300',
                        )}
                    >
                        Autofill {extensionDetected ? 'enabled' : 'unavailable'}
                    </span>
                </div>
            </div>

            <Panel ticks className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                        Current alias
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                        {aliasValue ? 'Select the field to copy' : 'None yet'}
                    </span>
                </div>

                <div
                    className={cn(
                        'flex flex-col items-stretch border sm:flex-row',
                        aliasValue ? 'border-orange-500' : 'border-neutral-800',
                    )}
                >
                    <input
                        value={aliasValue}
                        readOnly
                        placeholder="(none yet)"
                        onClick={() => {
                            void copyText(aliasValue);
                        }}
                        onFocus={(e) => e.currentTarget.select()}
                        title={aliasValue ? 'Copy to clipboard' : ''}
                        aria-label="Current alias"
                        className={cn(
                            'h-13 flex-grow bg-neutral-950 px-4 font-mono text-sm outline-none placeholder:text-neutral-600',
                            aliasValue ? 'cursor-pointer text-orange-300' : 'text-neutral-500',
                        )}
                    />
                    {copied && (
                        <span className="flex items-center border-neutral-800 px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-400 sm:border-l">
                            Copied
                        </span>
                    )}
                    <Button onClick={handleGenerate} disabled={quickCreating} className="h-13 chamfer-none shrink-0">
                        {quickCreating ? (
                            <ReloadSquare className="mr-1 h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Plus className="mr-1 h-3.5 w-3.5" />
                        )}
                        {quickCreating ? 'Generating…' : 'Generate'}
                    </Button>
                </div>

                {!extensionDetected && (
                    <div className="flex flex-col gap-3 border border-neutral-800 bg-[#0d0d0d] p-4">
                        <div className="flex items-center gap-2.5">
                            <Marker size={5} className="bg-amber-400" />
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">
                                Extension in development
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed text-neutral-400">
                            The browser extension is not available to install yet. Once it ships it will fill aliases
                            straight into forms, from the context menu or by auto-replace.
                        </p>
                    </div>
                )}
            </Panel>

            <div className="grid gap-5 md:grid-cols-3">
                {[
                    {
                        title: 'Alias pattern',
                        body: 'Aliases are random human-readable words ensuring low collision while staying memorizable.',
                    },
                    {
                        title: 'Forward routing',
                        body: 'Mail arrives at your forwarding inbox; upstream services never see your real address.',
                    },
                    {
                        title: 'Revocation',
                        body: 'Delete an alias any time to immediately stop future delivery attempts.',
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
        </div>
    );
};

export default AutofillTab;
