import {
    ArrowLeft, Check, Clipboard, Download, ExternalLink, KeyRound, Mail, Terminal
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import AuthNebulaScene from '@Features/auth/components/AuthNebulaScene';
import MnemonicForm from '@Features/auth/components/MnemonicForm';
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import BackendService from '@Services/BackendService';
import { decryptMnemonic, encryptMnemonic } from '@Services/CryptoService';
import SessionService from '@Services/SessionService';

import type { SubmitHandler } from 'react-hook-form';
// Helper to safely extract an error message from unknown data
const getMessage = (d: unknown, fallback: string) => {
    if (d && typeof d === 'object' && 'message' in d) {
        const m = (d as Record<string, unknown>).message;
        if (typeof m === 'string') return m;
    }
    return fallback;
};

const Auth: React.FC = () => {
    const navigate = useNavigate();
    // onboarding flow now includes unlock
    const [mode, setMode] = React.useState<'choose' | 'have' | 'new' | 'verify' | 'show' | 'unlock'>(
        () => (SessionService.getEncryptedMnemonic() ? 'unlock' : 'choose')
    );
    // move email & pgp into react-hook-form
    const [generatedMnemonic, setGeneratedMnemonic] = React.useState<string | null>(null);
    const [genLoading, setGenLoading] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const [showPGP, setShowPGP] = React.useState(false);

    // passcode for encrypting mnemonic
    const [passcode, setPasscode] = React.useState('');
    const [passcode2, setPasscode2] = React.useState('');
    const [passErr, setPassErr] = React.useState('');
    const [savingEnc, setSavingEnc] = React.useState(false);

    // verification state
    const [pendingEmail, setPendingEmail] = React.useState<string>('');
    const [startError, setStartError] = React.useState<string>('');
    const [verifyError, setVerifyError] = React.useState<string>('');
    const [verifyLoading, setVerifyLoading] = React.useState<boolean>(false);
    const [code, setCode] = React.useState<string>('');

    // unlock state (when encrypted mnemonic exists)
    const [unlockPass, setUnlockPass] = React.useState('');
    const [unlockErr, setUnlockErr] = React.useState('');
    const [unlockLoading, setUnlockLoading] = React.useState(false);

    type NewForm = { email: string; pgp?: string };
    const { register, handleSubmit, formState: { errors }, watch, resetField } = useForm<NewForm>({
        defaultValues: { email: '', pgp: '' }
    });

    // When user provides a mnemonic (have flow), proceed to passcode creation to encrypt & persist
    const onValidated = async (m: string, address?: string) => {
        try {
            // Do not authenticate yet; first collect a passcode and encrypt the mnemonic
            setGeneratedMnemonic(m);
            setPasscode('');
            setPasscode2('');
            setPassErr('');
            // Preserve pendingEmail if provided via address (optional path)
            if (address) setPendingEmail(address);
            setMode('show');
        } catch { /* noop */ }
    };

    const handleRegister: SubmitHandler<NewForm> = async ({ email, pgp }) => {
        if (!email) return;
        try {
            setStartError('');
            setGenLoading(true);
            const trimmed = (pgp || '').trim();
            if (trimmed) {
                try { localStorage.setItem('pgpPublicKey', trimmed); } catch { /* ignore storage errors */ }
            }
            // start email verification via BackendService
            const { status, data } = await BackendService.sendRequest('POST', '/api/v1/auth/send-code', {
                email,
                pgp: trimmed || undefined
            });
            if (status >= 400) {
                const msg = getMessage(data, 'Failed to start verification');
                throw new Error(msg);
            }
            setPendingEmail(email);
            setMode('verify');
        } catch (e) {
            setStartError(e instanceof Error ? e.message : 'Failed to start verification');
        } finally {
            setGenLoading(false);
        }
    };

    const submitVerification = async () => {
        if (!pendingEmail) return;
        try {
            setVerifyError('');
            setVerifyLoading(true);
            const normalized = code.trim();
            const { status, data } = await BackendService.sendRequest('POST', '/api/v1/auth/verify-code', {
                email: pendingEmail,
                code: normalized
            });
            if (status >= 400) {
                const msg = getMessage(data, 'Invalid code');
                throw new Error(msg);
            }

            const m = generateMnemonic(wordlist, 256);
            setGeneratedMnemonic(m);
            setMode('show');
        } catch (e) {
            setVerifyError(e instanceof Error ? e.message : 'Verification failed');
        } finally {
            setVerifyLoading(false);
        }
    };

    const pgpValue = watch('pgp') || '';
    const isPgpArmored = /BEGIN PGP PUBLIC KEY BLOCK/.test(pgpValue) && /END PGP PUBLIC KEY BLOCK/.test(pgpValue);

    const stepTitle = mode === 'choose' ? 'Choose how to continue' : mode === 'have' ? 'Enter your mnemonic' : mode === 'new' ? 'Start with your email' : mode === 'verify' ? 'Check your inbox' : mode === 'unlock' ? 'Enter your passcode' : 'Save your mnemonic';
    const stepNum = mode === 'choose' ? 1 : mode === 'show' ? 4 : mode === 'verify' ? 3 : mode === 'unlock' ? 1 : 2;

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            if (mode === 'show') setMode('new');
            else if (mode === 'verify') setMode('new');
            else if (mode === 'have' || mode === 'new') setMode('choose');
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [mode]);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-neutral-950 text-neutral-100">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]">
                    <AuthNebulaScene />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0)_0%,rgba(10,10,10,0.45)_55%,rgba(0,0,0,0.88)_100%)]" />
            </div>

            <main className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-44 md:pt-32">
                <div className="mb-8 flex items-center gap-3">
                    <Link to="/" className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-neutral-400 transition hover:text-orange-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-500/40">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Home
                    </Link>
                    <span className="rounded border border-orange-400/40 bg-neutral-900/60 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-orange-300">Onboarding</span>
                </div>
                <div className="relative pb-14">
                    <div className="mb-4 flex items-center justify-between text-xs">
                        <span className="rounded-full border border-neutral-800 bg-neutral-900/60 px-2 py-1 text-neutral-400">{mode === 'unlock' ? 'Unlock' : `Step ${stepNum} of 4`}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-neutral-400">{stepTitle}</span>
                            {mode !== 'choose' && mode !== 'unlock' && (
                                <button onClick={() => setMode('choose')} className="text-[11px] text-neutral-500 underline decoration-dotted underline-offset-2 hover:text-orange-300">Change</button>
                            )}
                        </div>
                    </div>

                    {mode === 'unlock' && (
                        <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-6">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-neutral-200">Unlock your account</h3>
                                <button className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-orange-300" onClick={() => setMode('choose')}>
                                    <ArrowLeft className="h-3 w-3" /> Use a different mnemonic
                                </button>
                            </div>
                            <label className="mb-2 block text-xs font-medium text-neutral-400">Enter your passcode</label>
                            <input
                                type="password"
                                placeholder="Passcode"
                                value={unlockPass}
                                onChange={(e) => setUnlockPass(e.target.value)}
                                className="w-full rounded-md bg-neutral-900/60 border border-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
                            />
                            {unlockErr && <p className="mt-2 text-[11px] text-red-400">{unlockErr}</p>}
                            <div className="mt-3">
                                <button
                                    type="button"
                                    disabled={unlockLoading || unlockPass.length < 1}
                                    onClick={async () => {
                                        setUnlockErr('');
                                        try {
                                            setUnlockLoading(true);
                                            const blob = SessionService.getEncryptedMnemonic();
                                            if (!blob) { setUnlockErr('No encrypted data found.'); setMode('choose'); return; }
                                            const m = await decryptMnemonic(unlockPass, blob);
                                            await BackendService.auth(m);
                                            navigate('/account');
                                        } catch {
                                            setUnlockErr('Incorrect passcode or corrupted data.');
                                        } finally {
                                            setUnlockLoading(false);
                                        }
                                    }}
                                    className="rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-neutral-900 shadow hover:bg-orange-400 disabled:opacity-60"
                                >
                                    {unlockLoading ? 'Unlocking…' : 'Unlock'}
                                </button>
                            </div>
                            <p className="mt-2 text-[11px] text-neutral-500">Your mnemonic stays encrypted locally. We never see your passcode.</p>
                        </div>
                    )}

                    {mode === 'choose' && (
                        <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-6">
                            <h3 className="mb-1 text-sm font-semibold text-neutral-200">Do you already have an account?</h3>
                            <p className="mb-4 text-xs text-neutral-400">Pick one to proceed.</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <button onClick={() => setMode('have')} className="group rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 text-left transition hover:border-orange-500/50 hover:bg-neutral-900">
                                    <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10 text-orange-300"><KeyRound className="h-4 w-4" /></div>
                                    <div className="text-sm font-medium text-neutral-200">I have a mnemonic</div>
                                    <div className="text-xs text-neutral-500">Sign in using your existing key phrase.</div>
                                </button>
                                <button onClick={() => setMode('new')} className="group rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 text-left transition hover:border-orange-500/50 hover:bg-neutral-900">
                                    <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10 text-orange-300"><Mail className="h-4 w-4" /></div>
                                    <div className="text-sm font-medium text-neutral-200">I’m new here</div>
                                    <div className="text-xs text-neutral-500">Start with your email, then get your mnemonic.</div>
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === 'have' && (
                        <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-6">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-neutral-200">Enter your mnemonic</h3>
                                <button className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-orange-300" onClick={() => setMode('choose')}>
                                    <ArrowLeft className="h-3 w-3" /> Back
                                </button>
                            </div>
                            <MnemonicForm onValidated={onValidated} />
                        </div>
                    )}

                    {mode === 'new' && (
                        <form onSubmit={handleSubmit(handleRegister)} className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-6">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-neutral-200">Start with your email</h3>
                                <button type="button" className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-orange-300" onClick={() => setMode('choose')}>
                                    <ArrowLeft className="h-3 w-3" /> Back
                                </button>
                            </div>
                            <label className="block text-xs font-medium text-neutral-400 mb-2" htmlFor="email">We’ll generate a mnemonic next</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-neutral-600"><Mail className="h-4 w-4" /></span>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full rounded-md bg-neutral-900/60 border border-neutral-800 pl-8 pr-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
                                        aria-invalid={!!errors.email || undefined}
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                                        })}
                                    />
                                </div>
                            </div>
                            {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email.message}</p>}
                            <div className="mt-3 space-y-2">
                                {!showPGP ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowPGP(true)}
                                        className="w-full rounded-md border border-orange-500/50 bg-orange-500/10 px-3 py-2 text-[12px] font-medium text-orange-200 hover:bg-orange-500/15 hover:border-orange-400/60"
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <KeyRound className="h-4 w-4" />
                                            <span>Add PGP public key</span>
                                            <span className="ml-2 rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-orange-300">Recommended</span>
                                        </span>
                                        <div className="mt-1 text-[11px] text-orange-300/80">Use it to encrypt this verification email — you will not regret it.</div>
                                    </button>
                                ) : (
                                    <div className="rounded-md border border-orange-500/40 bg-neutral-900/50 p-3 ring-1 ring-orange-500/20">
                                        <label htmlFor="pgp" className="mb-2 block text-xs font-medium text-neutral-300">PGP public key (will be used to encrypt this verification email)</label>
                                        <textarea
                                            id="pgp"
                                            placeholder={`-----BEGIN PGP PUBLIC KEY BLOCK-----\n...\n-----END PGP PUBLIC KEY BLOCK-----`}
                                            className="h-32 w-full resize-y rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
                                            aria-invalid={!!errors.pgp || undefined}
                                            {...register('pgp', {
                                                validate: (v) => !v || (/BEGIN PGP PUBLIC KEY BLOCK/.test(v) && /END PGP PUBLIC KEY BLOCK/.test(v)) || 'Invalid PGP public key'
                                            })}
                                        />
                                        {errors.pgp && <p className="mt-1 text-[11px] text-red-400">{errors.pgp.message as string}</p>}
                                        <div className="mt-2 flex items-center justify-between text-[11px]">
                                            <span className={isPgpArmored ? 'text-emerald-400' : 'text-neutral-500'}>
                                                {isPgpArmored ? 'Great! We’ll encrypt this verification email with your key.' : 'Paste your public key to encrypt this verification email — you will not regret it.'}
                                            </span>
                                            <button type="button" onClick={() => { setShowPGP(false); resetField('pgp'); }} className="text-neutral-500 hover:text-orange-300">I’ll add it later</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="mt-2 text-[11px] text-neutral-500">We never sell your email — not even for a lifetime supply of pizza. Only opt‑in notifications.</p>
                            <div className="mt-2">
                                <button type="submit" disabled={genLoading} className="rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-neutral-900 shadow hover:bg-orange-400 disabled:opacity-60 disabled:hover:bg-orange-500">{genLoading ? 'Please wait…' : 'Continue'}</button>
                                {isPgpArmored && (
                                    <p className="mt-2 inline-flex items-center gap-2 text-[11px] text-emerald-400">
                                        <Check className="h-3.5 w-3.5" /> End‑to‑end encryption enabled for this verification
                                    </p>
                                )}
                            </div>
                            {startError && <p className="mt-2 text-[11px] text-red-400">{startError}</p>}
                        </form>
                    )}

                    {mode === 'verify' && (
                        <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-6">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-neutral-200">Check your inbox</h3>
                                <button className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-orange-300" onClick={() => setMode('new')}>
                                    <ArrowLeft className="h-3 w-3" /> Back
                                </button>
                            </div>
                            <p className="mb-3 text-xs text-neutral-400">We sent a 3‑word code to {pendingEmail}. Enter it below.</p>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        aria-label="verification code"
                                        value={code}
                                        onChange={e => setCode(e.target.value)}
                                        placeholder="hate cloud flare"
                                        className="w-full rounded-md bg-neutral-900/60 border border-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
                                    />
                                </div>
                                <button type="button" disabled={verifyLoading || code.trim().split(/\s+/).length < 3} onClick={submitVerification} className="rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-neutral-900 shadow hover:bg-orange-400 disabled:opacity-60">
                                    {verifyLoading ? 'Verifying…' : 'Verify'}
                                </button>
                            </div>
                            {verifyError && <p className="mt-2 text-[11px] text-red-400">{verifyError}</p>}
                            <p className="mt-2 text-[11px] text-neutral-500">Tip: The code uses words from the BIP39 list. Keep the order.</p>
                        </div>
                    )}

                    {mode === 'show' && generatedMnemonic && (
                        <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-6">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-orange-300" onClick={() => setMode('new')}>
                                        <ArrowLeft className="h-3 w-3" /> Back
                                    </button>
                                    <h3 className="text-sm font-semibold text-neutral-200">Save your mnemonic</h3>
                                </div>
                                <button className="text-[11px] text-neutral-500 hover:text-orange-300" onClick={() => setMode('choose')}>Start over</button>
                            </div>
                            <p className="text-[12px] text-neutral-400 mb-3">Write this down and store it securely. It grants full access to your account.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {generatedMnemonic.split(' ').map((w, i) => (
                                    <div key={i} className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-[12px] text-neutral-200">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-neutral-800 text-[10px] text-neutral-400">{i + 1}</span>
                                        <span className="truncate">{w}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Passcode creation */}
                            <div className="mt-4 rounded-md border border-neutral-800 bg-neutral-900 p-3">
                                <label className="block text-xs font-medium text-neutral-300 mb-2">Create a passcode</label>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Passcode (min 8 chars)"
                                        value={passcode}
                                        onChange={(e) => setPasscode(e.target.value)}
                                        className="w-full rounded-md bg-neutral-900/60 border border-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
                                    />
                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Confirm passcode"
                                        value={passcode2}
                                        onChange={(e) => setPasscode2(e.target.value)}
                                        className="w-full rounded-md bg-neutral-900/60 border border-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
                                    />
                                </div>
                                {passErr && <p className="mt-2 text-[11px] text-red-400">{passErr}</p>}
                                <p className="mt-2 text-[11px] text-neutral-500">We will encrypt your mnemonic with this passcode and store only the encrypted blob locally.</p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button type="button" onClick={async () => { try { await navigator.clipboard?.writeText(generatedMnemonic); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch { /* noop */ } }} className="inline-flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-800/60 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:border-orange-500/50 hover:text-orange-200 transition">
                                    {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
                                    {copied ? 'Copied' : 'Copy all'}
                                </button>
                                <button
                                    type="button"
                                    disabled={savingEnc || passcode.length < 8 || passcode !== passcode2}
                                    onClick={async () => {
                                        setPassErr('');
                                        if (passcode.length < 8) { setPassErr('Passcode must be at least 8 characters'); return; }
                                        if (passcode !== passcode2) { setPassErr('Passcodes do not match'); return; }
                                        try {
                                            setSavingEnc(true);
                                            const blob = await encryptMnemonic(passcode, generatedMnemonic);
                                            SessionService.setEncryptedMnemonic(blob);
                                            await BackendService.auth(generatedMnemonic, pendingEmail);
                                            navigate('/account');
                                        } catch {
                                            setPassErr('Failed to continue. Please try again.');
                                        } finally {
                                            setSavingEnc(false);
                                        }
                                    }}
                                    className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 disabled:opacity-60"
                                >
                                    {savingEnc ? 'Please wait…' : 'Encrypt & continue'}
                                </button>
                            </div>
                            <p className="mt-3 text-[11px] text-neutral-500">Never share this phrase. Anyone with it can access your aliases.</p>
                        </div>
                    )}
                </div>
                <section className="mt-10">
                    <h2 className="font-semibold tracking-tight text-lg mb-3">Alternatives & Power Tools</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-neutral-800/70 bg-neutral-900/40 p-3">
                            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-neutral-200">
                                <Download className="h-3 w-3 text-orange-300" /> Browser Extension
                            </div>
                            <p className="mb-2 text-[10px] text-neutral-500">In‑context alias generation and autofill.</p>
                            <div className="flex flex-wrap gap-1.5">
                                <a href="https://chromewebstore.google.com/detail/placeholder" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-orange-500 px-2.5 py-1 text-[10px] font-semibold text-neutral-900 hover:bg-orange-400">
                                    Chrome <ExternalLink className="h-3 w-3" />
                                </a>
                                <a href="https://addons.mozilla.org/en-US/firefox/addon/placeholder" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-neutral-700 bg-neutral-800/60 px-2.5 py-1 text-[10px] font-semibold text-neutral-200 hover:border-orange-500/50 hover:text-orange-200">
                                    Firefox <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>

                        <div className="rounded-lg border border-neutral-800/70 bg-neutral-900/40 p-3">
                            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-neutral-200">
                                <Terminal className="h-3 w-3 text-orange-300" /> Command‑line Interface
                            </div>
                            <p className="mb-2 text-[10px] text-neutral-500">Scriptable auth and alias operations.</p>
                            <div className="flex flex-wrap gap-1.5">
                                <Link to="/swagger" className="inline-flex items-center gap-1 rounded-md bg-orange-500 px-2.5 py-1 text-[10px] font-semibold text-neutral-900 hover:bg-orange-400">
                                    OpenAPI
                                </Link>
                                <a href="https://github.com/1337-legal/cli" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-neutral-700 bg-neutral-800/60 px-2.5 py-1 text-[10px] font-semibold text-neutral-200 hover:border-orange-500/50 hover:text-orange-200">
                                    CLI Repo <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <div className="pointer-events-none fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
    );
};

export default Auth;