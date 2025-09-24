import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

import AccountNebulaScene from '@Features/account/components/AccountNebulaScene';
import AliasesTab from '@Features/account/components/AliasesTab';
import AutofillTab from '@Features/account/components/AutofillTab';
import EncryptionTab from '@Features/account/components/EncryptionTab';
import RouteTab from '@Features/account/components/RouteTab';

const Account: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'autofill' | 'route' | 'aliases' | 'encryption'>('autofill');

    // Detect small screens for compact rendering (e.g., PWA on phones)
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mq = window.matchMedia('(max-width: 640px)');
        const onChange = () => setIsMobile(mq.matches);
        onChange();
        mq.addEventListener?.('change', onChange);
        return () => mq.removeEventListener?.('change', onChange);
    }, []);

    return (
        <div className="relative min-h-dvh bg-neutral-950 text-neutral-100 overflow-hidden">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 opacity-45">
                    <AccountNebulaScene compact={isMobile} />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0)_0%,rgba(10,10,10,0.4)_55%,rgba(0,0,0,0.85)_100%)]" />
            </div>
            <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
                <div className="mb-8 flex items-center gap-3 text-xs">
                    <Link to="/auth" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-neutral-400 transition hover:text-orange-300">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                    <span className="rounded border border-orange-400/40 bg-neutral-900/60 px-2 py-0.5 font-semibold tracking-wide text-orange-300">Account</span>
                </div>
                <div className="overflow-hidden rounded-xl border border-neutral-800/60 bg-neutral-900/25 shadow-xl backdrop-blur-md [--tw-backdrop-blur:blur(8px)] ring-1 ring-neutral-800/40">
                    <div className="border-b border-neutral-800/60 bg-gradient-to-b from-neutral-900/70 via-neutral-900/40 to-neutral-900/10 px-4 sm:px-6 pt-4 sm:pt-5">
                        <h1 className="mb-4 text-xl font-semibold tracking-tight">Account</h1>
                        <div className="flex gap-5 sm:gap-6 text-[11px] font-medium tracking-wide overflow-x-auto whitespace-nowrap -mx-4 sm:mx-0 px-4 sm:px-0">
                            {(['autofill', 'route', 'aliases', 'encryption'] as const).map(k => (
                                <button key={k} onClick={() => setActiveTab(k)} className={`relative pb-2 py-1 transition after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:rounded-full after:transition ${activeTab === k ? 'text-orange-300 after:bg-orange-400' : 'text-neutral-500 hover:text-orange-300 after:bg-orange-400 after:scale-x-0 hover:after:scale-x-100'}`}>{k.charAt(0).toUpperCase() + k.slice(1)}</button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 md:p-8 min-h-[360px] sm:min-h-[420px] bg-gradient-to-b from-neutral-900/30 via-neutral-900/15 to-transparent">{/* added subtle fade */}
                        {activeTab === 'autofill' && (
                            <AutofillTab />
                        )}
                        {activeTab === 'route' && (
                            <RouteTab />
                        )}
                        {activeTab === 'aliases' && (
                            <AliasesTab />
                        )}
                        {activeTab === 'encryption' && (
                            <EncryptionTab />
                        )}
                    </div>
                    <div className="border-t border-neutral-800/60 px-4 sm:px-8 py-4 sm:py-5 text-center bg-neutral-900/20 backdrop-blur-sm pb-[max(env(safe-area-inset-bottom),1rem)]">
                        <p className="text-[10px] text-neutral-500">Forwarding, encryption & purge operations are client initiated; verify open source backend for exact behavior.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;