import { CubeLock, CubeMark, Marker } from '@Components/icons/Lattice';
import AliasesTab from '@Features/account/components/AliasesTab';
import AutofillTab from '@Features/account/components/AutofillTab';
import EncryptionTab from '@Features/account/components/EncryptionTab';
import RouteTab from '@Features/account/components/RouteTab';
import OnionStatus from '@Features/shared/components/OnionStatus';
import React, { useState } from 'react';
import { Link } from 'react-router';

import { cn } from '@/lib/utils';

type TabKey = 'aliases' | 'autofill' | 'route' | 'encryption';

const EnvelopeSquare: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M3 6 H21 V18 H3 Z" />
        <path d="M3 6 L12 13 L21 6" />
    </svg>
);

const RouteSquare: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M3 5 H9 V11 H3 Z" />
        <path d="M15 13 H21 V19 H15 Z" />
        <path d="M9 8 H15 V16" />
    </svg>
);

const AutofillSquare: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        aria-hidden="true"
    >
        <path d="M4 4 H20 V20 H4 Z" />
        <path d="M8 12 H16" />
        <path d="M13 8 L17 12 L13 16" />
    </svg>
);

const tabs: { key: TabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'aliases', label: 'Aliases', icon: EnvelopeSquare },
    { key: 'autofill', label: 'Autofill', icon: AutofillSquare },
    { key: 'route', label: 'Route', icon: RouteSquare },
    { key: 'encryption', label: 'Encryption', icon: CubeLock },
];

const Account: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('aliases');

    return (
        <div className="flex min-h-dvh flex-col bg-neutral-950 text-neutral-100">
            {}
            <div className="flex min-h-[71px] shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-5 pt-[env(safe-area-inset-top)] lg:px-10">
                <Link to="/" className="flex items-center gap-3">
                    <CubeMark className="h-[22px] w-[22px] text-orange-500" />
                    <span className="font-display text-[17px] font-bold tracking-[0.04em] text-neutral-100">
                        1337.legal
                    </span>
                    <span aria-hidden className="mx-1 hidden h-5.5 w-px bg-neutral-800 sm:block" />
                    <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-orange-300 sm:inline">
                        Account
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="hidden items-center gap-2.5 border border-neutral-800 bg-[#0d0d0d] px-3 py-2 sm:flex">
                        <Marker size={6} className="bg-emerald-400" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                            Session unlocked
                        </span>
                    </div>
                    <Link
                        to="/auth"
                        className="flex h-10 items-center border border-neutral-800 px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-400 transition-colors hover:border-orange-500/60 hover:text-orange-300"
                    >
                        Lock
                    </Link>
                </div>
            </div>

            <div className="flex flex-grow flex-col lg:flex-row">
                {}
                <nav className="shrink-0 border-b border-neutral-800 bg-[#0d0d0d] lg:w-61 lg:border-b-0 lg:border-r lg:py-8">
                    <span className="hidden px-6 pb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 lg:block">
                        Sections
                    </span>
                    <div className="flex overflow-x-auto lg:flex-col lg:overflow-visible">
                        {tabs.map((t) => {
                            const active = activeTab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setActiveTab(t.key)}
                                    aria-current={active ? 'page' : undefined}
                                    className={cn(
                                        'flex h-15 shrink-0 items-center gap-3.5 whitespace-nowrap px-5 transition-colors lg:pl-[21px] lg:pr-6',
                                        'border-b-2 lg:border-b-0 lg:border-l-[3px]',
                                        active
                                            ? 'border-orange-500 bg-[#151007] text-orange-300'
                                            : 'border-transparent text-neutral-400 hover:text-neutral-200',
                                    )}
                                >
                                    <t.icon
                                        className={cn(
                                            'h-[19px] w-[19px]',
                                            active ? 'text-orange-500' : 'text-neutral-500',
                                        )}
                                    />
                                    <span className="font-display text-[15px] font-semibold uppercase tracking-[0.06em]">
                                        {t.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="hidden lg:block">
                        <div aria-hidden className="mx-6 mt-7 h-px bg-neutral-800" />
                        <div className="mx-6 mt-6">
                            <OnionStatus />
                        </div>
                    </div>
                </nav>

                {}
                <main className="lattice flex-grow px-5 py-8 pb-[max(env(safe-area-inset-bottom),2rem)] lg:px-10 lg:py-10">
                    <div className="mx-auto max-w-5xl">
                        {activeTab === 'aliases' && <AliasesTab />}
                        {activeTab === 'autofill' && <AutofillTab />}
                        {activeTab === 'route' && <RouteTab />}
                        {activeTab === 'encryption' && <EncryptionTab />}

                        <p className="mt-10 border-t border-neutral-800 pt-6 font-mono text-[11px] leading-relaxed text-neutral-500">
                            Forwarding, encryption &amp; purge operations are client initiated; verify the open source
                            backend for exact behavior.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Account;
