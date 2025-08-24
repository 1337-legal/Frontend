import React, { useState } from 'react';
import { Link } from 'react-router';

import AccountNebulaScene from '@Features/account/components/AccountNebulaScene';
import AliasesTab from '@Features/account/components/AliasesTab';
import AliasPanel from '@Features/account/components/AliasPanel';
import AutofillTab from '@Features/account/components/AutofillTab';
import EncryptionTab from '@Features/account/components/EncryptionTab';
import RouteTab from '@Features/account/components/RouteTab';
import Backend from '@Services/BackendService';

const Account: React.FC = () => {
    const [forwarding, setForwarding] = useState('');
    const [fwdStatus, setFwdStatus] = useState<string>('');
    const [purgeStatus, setPurgeStatus] = useState<string>('');
    const [updating, setUpdating] = useState(false);
    const [purging, setPurging] = useState(false);
    const [quickCreating, setQuickCreating] = useState(false);
    const [lastCreated, setLastCreated] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'autofill' | 'route' | 'aliases' | 'encryption'>('autofill');
    // PGP state
    const [pgpKey, setPgpKey] = useState<string>('');
    const [pgpFingerprint, setPgpFingerprint] = useState<string>('');
    const [pgpStatus, setPgpStatus] = useState<string>('');
    const [pgpSaving, setPgpSaving] = useState(false);

    const updateForwarding = async () => {
        setUpdating(true); setFwdStatus('');
        try {
            // @ts-expect-error backend method may not exist yet
            await Backend.updateForwarding?.(forwarding);
            setFwdStatus('Updated');
        } catch (e: unknown) { setFwdStatus(e instanceof Error ? e.message : 'Failed'); }
        finally { setUpdating(false); }
    };

    const quickCreate = async () => {
        setQuickCreating(true);
        try {
            const r = await Backend.createAlias() as unknown as { alias?: string };
            setLastCreated(r?.alias || 'created');
        } catch {
            setLastCreated('failed');
        } finally { setQuickCreating(false); }
    };

    const purge = async () => {
        if (!confirm('Purge account? This permanently deletes aliases and routing.')) return;
        setPurging(true); setPurgeStatus('');
        try {
            // @ts-expect-error backend method may not exist yet
            await Backend.purgeAccount?.();
            setPurgeStatus('Purged');
        } catch (e: unknown) { setPurging(e instanceof Error ? false : false); setPurgeStatus(e instanceof Error ? e.message : 'Failed'); }
        finally { setPurging(false); }
    };

    const computeFingerprint = async (armored: string) => {
        try {
            const clean = armored.trim();
            const data = new TextEncoder().encode(clean);
            const hash = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hash)).slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        } catch {
            return '';
        }
    };

    const savePGP = async () => {
        if (!pgpKey.trim()) return;
        setPgpSaving(true); setPgpStatus('');
        try {
            const fp = await computeFingerprint(pgpKey);
            // @ts-expect-error optional backend method placeholder
            await Backend.setPGPPublicKey?.(pgpKey);
            setPgpFingerprint(fp);
            setPgpStatus('Saved');
        } catch (e: unknown) { setPgpStatus(e instanceof Error ? e.message : 'Failed'); }
        finally { setPgpSaving(false); }
    };

    const removePGP = async () => {
        if (!confirm('Remove PGP key?')) return;
        setPgpSaving(true); setPgpStatus('');
        try {
            // @ts-expect-error optional backend method placeholder
            await Backend.removePGPPublicKey?.();
            setPgpKey(''); setPgpFingerprint('');
            setPgpStatus('Removed');
        } catch (e: unknown) { setPgpStatus(e instanceof Error ? e.message : 'Failed'); }
        finally { setPgpSaving(false); }
    };

    return (
        <div className="relative min-h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 opacity-45">{/* removed mask to expose full scene */}
                    <AccountNebulaScene />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0)_0%,rgba(10,10,10,0.4)_55%,rgba(0,0,0,0.85)_100%)]" />
            </div>
            <div className="relative z-10 mx-auto max-w-3xl px-6 py-14">{/* slightly less vertical padding */}
                <div className="mb-8 flex items-center gap-3 text-xs">
                    <Link to="/auth" className="rounded-md px-2 py-1 font-medium text-neutral-400 transition hover:text-orange-300">Back</Link>
                    <span className="rounded border border-orange-400/40 bg-neutral-900/60 px-2 py-0.5 font-semibold tracking-wide text-orange-300">Account</span>
                </div>
                <div className="overflow-hidden rounded-xl border border-neutral-800/60 bg-neutral-900/25 shadow-xl backdrop-blur-md [--tw-backdrop-blur:blur(8px)] ring-1 ring-neutral-800/40">
                    <div className="border-b border-neutral-800/60 bg-gradient-to-b from-neutral-900/70 via-neutral-900/40 to-neutral-900/10 px-6 pt-5">
                        <h1 className="mb-4 text-xl font-semibold tracking-tight">Account</h1>
                        <div className="flex gap-6 text-[11px] font-medium tracking-wide">
                            {(['autofill', 'route', 'aliases', 'encryption'] as const).map(k => (
                                <button key={k} onClick={() => setActiveTab(k)} className={`relative pb-2 transition after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:rounded-full after:transition ${activeTab === k ? 'text-orange-300 after:bg-orange-400' : 'text-neutral-500 hover:text-orange-300 after:bg-orange-400 after:scale-x-0 hover:after:scale-x-100'}`}>{k.charAt(0).toUpperCase() + k.slice(1)}</button>
                            ))}
                        </div>
                    </div>
                    <div className="p-8 min-h-[420px] bg-gradient-to-b from-neutral-900/30 via-neutral-900/15 to-transparent">{/* added subtle fade */}
                        {activeTab === 'autofill' && (
                            <AutofillTab
                                lastCreated={lastCreated}
                                quickCreating={quickCreating}
                                onGenerate={quickCreate}
                            />
                        )}
                        {activeTab === 'route' && (
                            <RouteTab
                                forwarding={forwarding}
                                updating={updating}
                                fwdStatus={fwdStatus}
                                onChange={setForwarding}
                                onUpdate={updateForwarding}
                            />
                        )}
                        {activeTab === 'aliases' && (
                            <AliasesTab aliasPanel={<AliasPanel />} />
                        )}
                        {activeTab === 'encryption' && (
                            <EncryptionTab
                                pgpKey={pgpKey}
                                pgpFingerprint={pgpFingerprint}
                                pgpStatus={pgpStatus}
                                pgpSaving={pgpSaving}
                                onPGPChange={setPgpKey}
                                onSavePGP={savePGP}
                                onRemovePGP={removePGP}
                                onClearPGP={() => { setPgpKey(''); setPgpStatus(''); setPgpFingerprint(''); }}
                                purgeStatus={purgeStatus}
                                purging={purging}
                                onPurge={purge}
                            />
                        )}
                    </div>
                    <div className="border-t border-neutral-800/60 px-8 py-5 text-center bg-neutral-900/20 backdrop-blur-sm">
                        <p className="text-[10px] text-neutral-500">Forwarding, encryption & purge operations are client initiated; verify open source backend for exact behavior.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;