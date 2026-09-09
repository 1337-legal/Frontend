import { cn } from '@/lib/utils';
import { CubeLock, CubeMark, Marker } from '@Components/icons/Lattice';
import AliasesTab from '@Features/account/components/AliasesTab';
import AutofillTab from '@Features/account/components/AutofillTab';
import EncryptionTab from '@Features/account/components/EncryptionTab';
import RouteTab from '@Features/account/components/RouteTab';
import OnionStatus from '@Features/shared/components/OnionStatus';
import React, { useState } from 'react';
import { Link } from 'react-router';

type TabKey = 'autofill' | 'aliases' | 'route' | 'encryption';

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
    { key: 'autofill', label: 'Autofill', icon: AutofillSquare },
    { key: 'aliases', label: 'Aliases', icon: EnvelopeSquare },
    { key: 'route', label: 'Route', icon: RouteSquare },
    { key: 'encryption', label: 'Encryption', icon: CubeLock },
];

const panels: Record<TabKey, React.FC> = {
    autofill: AutofillTab,
    aliases: AliasesTab,
    route: RouteTab,
    encryption: EncryptionTab,
};

const Account: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('autofill');
    const current = tabs.find((t) => t.key === activeTab) ?? tabs[0];
    const ActivePanel = panels[activeTab];

    return (
        <div className="flex min-h-dvh flex-col bg-neutral-950 text-neutral-100">
            <header className="sticky top-0 z-30 flex min-h-[calc(56px+env(safe-area-inset-top))] shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 pt-[env(safe-area-inset-top)] lg:static lg:min-h-[71px] lg:px-10">
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        aria-label="Home"
                        className="-ml-2 flex h-11 w-11 items-center justify-center lg:ml-0 lg:h-auto lg:w-auto"
                    >
                        <CubeMark className="h-[22px] w-[22px] text-orange-500" />
                    </Link>
                    <span className="font-display text-[17px] font-bold uppercase tracking-[0.06em] text-neutral-100 lg:hidden">
                        {current.label}
                    </span>
                    <span className="hidden items-center gap-3 lg:flex">
                        <span className="font-display text-[17px] font-bold tracking-[0.04em] text-neutral-100">
                            1337.legal
                        </span>
                        <span aria-hidden className="h-5.5 w-px bg-neutral-800" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-300">
                            Account
                        </span>
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2.5 border border-neutral-800 bg-[#0d0d0d] px-3 py-2 lg:flex">
                        <Marker size={6} className="bg-emerald-400" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                            Session unlocked
                        </span>
                    </div>
                    <Link
                        to="/auth"
                        aria-label="Lock session"
                        className="flex h-11 min-w-11 items-center justify-center border border-neutral-800 px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-400 transition-colors hover:border-orange-500/60 hover:text-orange-300 lg:h-10"
                    >
                        <CubeLock className="h-4 w-4 lg:hidden" />
                        <span className="hidden lg:inline">Lock</span>
                    </Link>
                </div>
            </header>

            <div className="flex flex-grow flex-col lg:flex-row">
                <nav
                    aria-label="Sections"
                    className="hidden shrink-0 border-r border-neutral-800 bg-[#0d0d0d] py-8 lg:block lg:w-61"
                >
                    <span className="block px-6 pb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                        Sections
                    </span>
                    <div className="flex flex-col">
                        {tabs.map((t) => {
                            const active = activeTab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setActiveTab(t.key)}
                                    aria-current={active ? 'page' : undefined}
                                    className={cn(
                                        'flex h-15 items-center gap-3.5 border-l-[3px] pr-6 pl-[21px] transition-colors',
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
                    <div aria-hidden className="mx-6 mt-7 h-px bg-neutral-800" />
                    <div className="mx-6 mt-6">
                        <OnionStatus />
                    </div>
                </nav>

                <main className="lattice flex-grow px-4 pt-6 pb-[calc(88px+env(safe-area-inset-bottom))] lg:px-10 lg:py-10">
                    <div key={activeTab} className="tab-enter mx-auto max-w-5xl">
                        <ActivePanel />
                        <p className="mt-10 border-t border-neutral-800 pt-6 font-mono text-[11px] leading-relaxed text-neutral-500">
                            Forwarding, encryption &amp; purge operations are client initiated; verify the open source
                            backend for exact behavior.
                        </p>
                    </div>
                </main>
            </div>

            <nav
                aria-label="Sections"
                className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-neutral-800 bg-neutral-950 pb-[env(safe-area-inset-bottom)] select-none lg:hidden"
            >
                {tabs.map((t) => {
                    const active = activeTab === t.key;
                    return (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setActiveTab(t.key)}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'flex h-16 flex-col items-center justify-center gap-1.5 border-t-2 transition-colors',
                                active
                                    ? 'border-orange-500 bg-[#151007] text-orange-300'
                                    : 'border-transparent text-neutral-500 active:bg-neutral-900',
                            )}
                        >
                            <t.icon className={cn('h-5 w-5', active ? 'text-orange-500' : 'text-neutral-500')} />
                            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]">
                                {t.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Account;
