import { CubeMark, LockSquare, Marker } from '@Components/icons/Lattice';
import { Badge } from '@Components/ui/badge';
import { Button } from '@Components/ui/button';
import { Panel } from '@Components/ui/panel';
import MnemonicForm from '@Features/auth/components/MnemonicForm';
import SiteFooter from '@Features/shared/components/SiteFooter';
import SiteNav from '@Features/shared/components/SiteNav';
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import BackendService from '@Services/BackendService';
import { decryptMnemonic, encryptMnemonic } from '@Services/CryptoService';
import SessionService from '@Services/SessionService';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Clipboard,
    Download,
    Eye,
    EyeOff,
    GitFork,
    KeyRound,
    Mail,
    Shield,
    Zap,
} from 'lucide-react';
import React, { useEffect } from 'react';
import type { SubmitHandler, UseFormRegisterReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { cn } from '@/lib/utils';

const getMessage = (d: unknown, fallback: string) => {
    if (d && typeof d === 'object' && 'message' in d) {
        const m = (d as Record<string, unknown>).message;
        if (typeof m === 'string') return m;
    }
    return fallback;
};

const Input: React.FC<{
    icon?: React.ReactNode;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showToggle?: boolean;
    isPassword?: boolean;
    onToggle?: () => void;
    className?: string;
    id?: string;
    autoComplete?: string;
    register?: UseFormRegisterReturn;
}> = ({
    icon,
    type = 'text',
    placeholder,
    value,
    onChange,
    showToggle,
    isPassword,
    onToggle,
    className = '',
    id,
    autoComplete,
    register: registerProps,
}) => (
    <div className="relative flex items-center">
        {icon && <span className="pointer-events-none absolute left-3.5 text-neutral-600">{icon}</span>}
        <input
            id={id}
            type={isPassword ? (showToggle ? 'text' : 'password') : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            className={cn(
                'h-12 w-full border border-neutral-800 bg-neutral-950 font-mono text-sm text-neutral-100 outline-none transition-colors placeholder:text-neutral-600 focus:border-orange-500',
                icon ? 'pl-11' : 'pl-4',
                onToggle ? 'pr-12' : 'pr-4',
                className,
            )}
            {...registerProps}
        />
        {onToggle && (
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-2 flex h-8 w-8 items-center justify-center text-neutral-600 transition-colors hover:text-orange-400"
                aria-label={showToggle ? 'Hide' : 'Show'}
            >
                {showToggle ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        )}
    </div>
);

const PanelHeading: React.FC<{ title: string; description?: string; icon?: React.ReactNode }> = ({
    title,
    description,
    icon,
}) => (
    <div className="flex flex-col gap-2">
        {icon && (
            <div className="mb-2 flex h-12 w-12 items-center justify-center border border-orange-500 text-orange-500">
                {icon}
            </div>
        )}
        <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.04em] text-neutral-100">{title}</h2>
        {description && <p className="text-sm leading-relaxed text-neutral-400">{description}</p>}
    </div>
);

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = React.useState<'choose' | 'have' | 'new' | 'verify' | 'show' | 'unlock'>(() =>
        SessionService.getEncryptedMnemonic() ? 'unlock' : 'choose',
    );

    const [generatedMnemonic, setGeneratedMnemonic] = React.useState<string | null>(null);
    const [genLoading, setGenLoading] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const [showPGP, setShowPGP] = React.useState(false);

    const [passcode, setPasscode] = React.useState('');
    const [passcode2, setPasscode2] = React.useState('');
    const [passErr, setPassErr] = React.useState('');
    const [savingEnc, setSavingEnc] = React.useState(false);

    const [pendingEmail, setPendingEmail] = React.useState<string>('');
    const [startError, setStartError] = React.useState<string>('');
    const [verifyError, setVerifyError] = React.useState<string>('');
    const [verifyLoading, setVerifyLoading] = React.useState<boolean>(false);
    const [code, setCode] = React.useState<string>('');

    const [unlockPass, setUnlockPass] = React.useState('');
    const [unlockErr, setUnlockErr] = React.useState('');
    const [unlockLoading, setUnlockLoading] = React.useState(false);

    const [showPass, setShowPass] = React.useState(false);
    const [showPass2, setShowPass2] = React.useState(false);
    const [showUnlockPass, setShowUnlockPass] = React.useState(false);

    type NewForm = { email: string; pgp?: string };
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        resetField,
    } = useForm<NewForm>({
        defaultValues: { email: '', pgp: '' },
    });

    const onValidated = async (m: string, address?: string) => {
        try {
            setGeneratedMnemonic(m);
            setPasscode('');
            setPasscode2('');
            setPassErr('');

            if (address) setPendingEmail(address);
            setMode('show');
        } catch {}
    };

    const handleRegister: SubmitHandler<NewForm> = async ({ email, pgp }) => {
        if (!email) return;
        try {
            setStartError('');
            setGenLoading(true);
            const trimmed = (pgp || '').trim();
            if (trimmed) {
                try {
                    localStorage.setItem('pgpPublicKey', trimmed);
                } catch {}
            }

            const { status, data } = await BackendService.sendRequest('POST', '/api/v1/auth/send-code', {
                email,
                pgp: trimmed || undefined,
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
                code: normalized,
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

    const mnemonicWords = React.useMemo(
        () =>
            (generatedMnemonic ?? '')
                .split(' ')
                .filter(Boolean)
                .map((word, index) => ({ id: `${index}-${word}`, word, position: index + 1 })),
        [generatedMnemonic],
    );

    const pgpValue = watch('pgp') || '';
    const isPgpArmored = /BEGIN PGP PUBLIC KEY BLOCK/.test(pgpValue) && /END PGP PUBLIC KEY BLOCK/.test(pgpValue);

    const stepTitle =
        mode === 'choose'
            ? 'Choose how to continue'
            : mode === 'have'
              ? 'Enter your mnemonic'
              : mode === 'new'
                ? 'Start with your email'
                : mode === 'verify'
                  ? 'Check your inbox'
                  : mode === 'unlock'
                    ? 'Welcome back'
                    : 'Save your mnemonic';
    const stepNum = mode === 'choose' ? 1 : mode === 'show' ? 4 : mode === 'verify' ? 3 : mode === 'unlock' ? 1 : 2;
    const maxSteps = 4;

    const passStrength = React.useMemo(() => {
        let score = 0;
        if (passcode.length >= 8) score++;
        if (/[A-Z]/.test(passcode)) score++;
        if (/[0-9]/.test(passcode)) score++;
        if (/[^A-Za-z0-9]/.test(passcode)) score++;
        return score;
    }, [passcode]);
    const passStrengthLabel = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'][passStrength];
    const passStrengthColors = ['bg-red-500', 'bg-orange-500', 'bg-amber-400', 'bg-emerald-500', 'bg-emerald-400'];

    const canEncrypt = !savingEnc && passcode.length >= 8 && passcode === passcode2;

    const handleEncryptContinue = async () => {
        if (!canEncrypt || !generatedMnemonic) return;
        setPassErr('');
        if (passcode.length < 8) {
            setPassErr('Passcode must be at least 8 characters');
            return;
        }
        if (passcode !== passcode2) {
            setPassErr('Passcodes do not match');
            return;
        }
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
    };

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
        <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
            <SiteNav>
                <div className="flex items-center gap-3">
                    <Marker size={6} className="bg-emerald-400" />
                    <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-400 sm:inline">
                        Local key derivation
                    </span>
                </div>
            </SiteNav>

            <header className="lattice border-b border-neutral-800">
                <div className="mx-auto flex max-w-7xl flex-col items-start px-6 py-16 lg:px-12">
                    <Button variant="ghost" size="sm" className="mb-8 px-0" asChild>
                        <Link to="/">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
                        </Link>
                    </Button>

                    <div className="mb-8 flex flex-wrap items-center gap-2.5">
                        <Badge variant="outline" className="gap-2 border-orange-500 text-orange-300">
                            <Marker /> Authentication
                        </Badge>
                        <Badge>
                            Step {stepNum}/{maxSteps}
                        </Badge>
                    </div>

                    <h1 className="font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight text-neutral-100 text-balance md:text-5xl">
                        {stepTitle}
                    </h1>
                    <p className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.03em] text-orange-500 md:text-2xl">
                        {mode === 'unlock'
                            ? 'Secure access'
                            : mode === 'show'
                              ? 'Your recovery phrase'
                              : 'Zero-knowledge auth'}
                    </p>

                    <div className="mt-8 flex items-center">
                        <Marker size={8} />
                        <span aria-hidden className="block h-px w-26 bg-neutral-700" />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="flex flex-col gap-6">
                        {mode === 'unlock' && (
                            <Panel ticks className="flex flex-col gap-6 p-6 sm:p-8">
                                <PanelHeading
                                    icon={<LockSquare className="h-6 w-6" />}
                                    title="Welcome back"
                                    description="Enter your passcode to unlock your encrypted mnemonic."
                                />
                                <div className="flex max-w-sm flex-col gap-4">
                                    <Input
                                        icon={<KeyRound className="h-4 w-4" />}
                                        isPassword
                                        showToggle={showUnlockPass}
                                        onToggle={() => setShowUnlockPass((v) => !v)}
                                        placeholder="Enter your passcode"
                                        value={unlockPass}
                                        onChange={(e) => setUnlockPass(e.target.value)}
                                    />
                                    {unlockErr && <p className="text-sm text-red-400">{unlockErr}</p>}
                                    <Button
                                        size="lg"
                                        className="w-full"
                                        disabled={unlockLoading || unlockPass.length < 1}
                                        onClick={async () => {
                                            setUnlockErr('');
                                            try {
                                                setUnlockLoading(true);
                                                const blob = SessionService.getEncryptedMnemonic();
                                                if (!blob) {
                                                    setUnlockErr('No encrypted data found.');
                                                    setMode('choose');
                                                    return;
                                                }
                                                const m = await decryptMnemonic(unlockPass, blob);
                                                await BackendService.auth(m);
                                                navigate('/account');
                                            } catch {
                                                setUnlockErr('Incorrect passcode or corrupted data.');
                                            } finally {
                                                setUnlockLoading(false);
                                            }
                                        }}
                                    >
                                        {unlockLoading ? 'Unlocking…' : 'Unlock'}{' '}
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                    <span aria-hidden className="h-px bg-neutral-800" />
                                    <Button variant="ghost" className="w-full" onClick={() => setMode('choose')}>
                                        Use a different mnemonic
                                    </Button>
                                </div>
                            </Panel>
                        )}

                        {mode === 'choose' && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => setMode('have')}
                                    aria-label="Sign in with an existing mnemonic"
                                    className="group h-full text-left"
                                >
                                    <Panel
                                        tone="accent"
                                        frameClassName="h-full"
                                        className="flex h-full flex-col gap-4 bg-[#151007] p-7 transition-colors group-hover:bg-[#1a1209]"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center border border-orange-500 text-orange-500">
                                            <KeyRound className="h-6 w-6" />
                                        </div>
                                        <h2 className="font-display text-lg font-semibold uppercase tracking-[0.04em] text-neutral-100">
                                            I have a mnemonic
                                        </h2>
                                        <p className="text-sm leading-relaxed text-neutral-400">
                                            Sign in using your existing 24-word recovery phrase.
                                        </p>
                                        <span className="mt-auto flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-400">
                                            Continue <ArrowRight className="h-3.5 w-3.5" />
                                        </span>
                                    </Panel>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('new')}
                                    aria-label="Create a new account"
                                    className="group h-full text-left"
                                >
                                    <Panel
                                        frameClassName="h-full"
                                        className="flex h-full flex-col gap-4 bg-[#0d0d0d] p-7 transition-colors group-hover:bg-[#121212]"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center border border-neutral-700 text-neutral-400">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <h2 className="font-display text-lg font-semibold uppercase tracking-[0.04em] text-neutral-100">
                                            I&apos;m new here
                                        </h2>
                                        <p className="text-sm leading-relaxed text-neutral-400">
                                            Create a new account and get your recovery phrase.
                                        </p>
                                        <span className="mt-auto flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 group-hover:text-orange-400">
                                            Get started <ArrowRight className="h-3.5 w-3.5" />
                                        </span>
                                    </Panel>
                                </button>
                            </div>
                        )}

                        {mode === 'have' && (
                            <Panel ticks className="flex flex-col gap-6 p-6 sm:p-8">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-fit px-0"
                                    onClick={() => setMode('choose')}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                                <MnemonicForm onValidated={onValidated} />
                            </Panel>
                        )}

                        {mode === 'new' && (
                            <Panel ticks className="flex flex-col gap-6 p-6 sm:p-8">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-fit px-0"
                                    onClick={() => setMode('choose')}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                                <PanelHeading
                                    icon={<Mail className="h-6 w-6" />}
                                    title="Let's get started"
                                    description="We'll send a verification code to your email, then generate your secure mnemonic."
                                />
                                <form onSubmit={handleSubmit(handleRegister)} className="flex max-w-md flex-col gap-4">
                                    <div>
                                        <label
                                            className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500"
                                            htmlFor="email"
                                        >
                                            Email address
                                        </label>
                                        <Input
                                            id="email"
                                            icon={<Mail className="h-4 w-4" />}
                                            type="email"
                                            placeholder="you@example.com"
                                            register={register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: 'Enter a valid email',
                                                },
                                            })}
                                        />
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {!showPGP ? (
                                        <button
                                            type="button"
                                            aria-label="Add a PGP public key"
                                            onClick={() => setShowPGP(true)}
                                            className="border border-dashed border-orange-500/50 bg-orange-500/5 p-4 text-left transition-colors hover:border-orange-500 hover:bg-orange-500/10"
                                        >
                                            <div className="flex items-start gap-3.5">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-orange-500/50">
                                                    <KeyRound className="h-4 w-4 text-orange-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="mb-1 flex flex-wrap items-center gap-2">
                                                        <span className="font-display text-sm font-semibold uppercase tracking-[0.04em] text-orange-200">
                                                            Add PGP public key
                                                        </span>
                                                        <Badge>Recommended</Badge>
                                                    </div>
                                                    <p className="text-xs text-neutral-500">
                                                        Encrypt your verification email end-to-end.
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="flex flex-col gap-3 border border-orange-500/50 bg-orange-500/5 p-4">
                                            <div className="flex items-center justify-between">
                                                <label
                                                    htmlFor="pgp"
                                                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400"
                                                >
                                                    PGP public key
                                                </label>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-auto px-0"
                                                    onClick={() => {
                                                        setShowPGP(false);
                                                        resetField('pgp');
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                            <textarea
                                                id="pgp"
                                                placeholder={
                                                    '-----BEGIN PGP PUBLIC KEY BLOCK-----\n...\n-----END PGP PUBLIC KEY BLOCK-----'
                                                }
                                                className="h-28 w-full resize-y border border-neutral-800 bg-neutral-950 px-3 py-2.5 font-mono text-xs text-neutral-200 outline-none transition-colors placeholder:text-neutral-600 focus:border-orange-500"
                                                {...register('pgp', {
                                                    validate: (v) =>
                                                        !v ||
                                                        (/BEGIN PGP PUBLIC KEY BLOCK/.test(v) &&
                                                            /END PGP PUBLIC KEY BLOCK/.test(v)) ||
                                                        'Invalid PGP public key',
                                                })}
                                            />
                                            {errors.pgp && (
                                                <p className="text-sm text-red-400">{errors.pgp.message as string}</p>
                                            )}
                                            {isPgpArmored && (
                                                <p className="flex items-center gap-2 text-sm text-emerald-400">
                                                    <Check className="h-4 w-4" /> Your verification email will be
                                                    encrypted
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <p className="font-mono text-[11px] text-neutral-500">
                                        We never sell your email. Only opt-in notifications.
                                    </p>
                                    {startError && <p className="text-sm text-red-400">{startError}</p>}

                                    <Button type="submit" size="lg" className="w-full" disabled={genLoading}>
                                        {genLoading ? 'Sending code…' : 'Continue'}{' '}
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </form>
                            </Panel>
                        )}

                        {mode === 'verify' && (
                            <Panel ticks className="flex flex-col gap-6 p-6 sm:p-8">
                                <Button variant="ghost" size="sm" className="w-fit px-0" onClick={() => setMode('new')}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                                <div className="flex flex-col gap-2">
                                    <div className="mb-2 flex h-12 w-12 items-center justify-center border border-emerald-400 text-emerald-400">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.04em] text-neutral-100">
                                        Check your inbox
                                    </h2>
                                    <p className="text-sm leading-relaxed text-neutral-400">
                                        We sent a 3-word verification code to{' '}
                                        <span className="font-mono text-orange-300">{pendingEmail}</span>
                                    </p>
                                </div>
                                <div className="flex max-w-sm flex-col gap-4">
                                    <div>
                                        <label
                                            htmlFor="verification-code"
                                            className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500"
                                        >
                                            Verification code
                                        </label>
                                        <input
                                            id="verification-code"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="word word word"
                                            className="h-14 w-full border border-neutral-800 bg-neutral-950 px-4 text-center font-mono text-lg tracking-[0.2em] text-neutral-100 outline-none transition-colors placeholder:text-neutral-600 focus:border-orange-500"
                                        />
                                    </div>
                                    {verifyError && <p className="text-sm text-red-400">{verifyError}</p>}
                                    <Button
                                        size="lg"
                                        className="w-full"
                                        disabled={verifyLoading || code.trim().split(/\s+/).length < 3}
                                        onClick={submitVerification}
                                    >
                                        {verifyLoading ? 'Verifying…' : 'Verify'}{' '}
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                    <p className="font-mono text-[11px] text-neutral-500">
                                        The code uses words from the BIP39 wordlist. Keep the order.
                                    </p>
                                </div>
                            </Panel>
                        )}

                        {mode === 'show' && generatedMnemonic && (
                            <Panel ticks className="flex flex-col gap-6 p-6 sm:p-8">
                                <div className="flex items-center justify-between">
                                    <Button variant="ghost" size="sm" className="px-0" onClick={() => setMode('new')}>
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-0"
                                        onClick={() => setMode('choose')}
                                    >
                                        Start over
                                    </Button>
                                </div>

                                <div className="flex gap-3.5 border-l-2 border-amber-400 bg-amber-400/10 p-4">
                                    <Shield className="h-5 w-5 shrink-0 text-amber-400" />
                                    <div>
                                        <h4 className="mb-1 font-display text-sm font-semibold uppercase tracking-[0.04em] text-amber-200">
                                            Save this phrase securely
                                        </h4>
                                        <p className="text-xs leading-relaxed text-amber-200/70">
                                            Write it down and store it in a safe place. This phrase grants full access
                                            to your account. Never share it with anyone.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                    {mnemonicWords.map(({ id, word, position }) => (
                                        <div
                                            key={id}
                                            className="relative flex h-12 items-center border border-neutral-800 bg-[#0d0d0d] pl-9 pr-3"
                                        >
                                            <span className="absolute left-0 top-0 flex h-full w-7 items-center justify-center bg-[#1c1c1c] font-mono text-[9px] font-semibold text-orange-300">
                                                {String(position).padStart(2, '0')}
                                            </span>
                                            <span className="truncate font-mono text-[13px] text-neutral-100">
                                                {word}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-fit"
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard?.writeText(generatedMnemonic);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        } catch {}
                                    }}
                                >
                                    {copied ? (
                                        <Check className="mr-1 h-4 w-4" />
                                    ) : (
                                        <Clipboard className="mr-1 h-4 w-4" />
                                    )}
                                    {copied ? 'Copied' : 'Copy to clipboard'}
                                </Button>

                                <span aria-hidden className="h-px bg-neutral-800" />

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2.5">
                                        <LockSquare className="h-4 w-4 text-orange-500" />
                                        <h4 className="font-display text-base font-semibold uppercase tracking-[0.04em] text-neutral-100">
                                            Create a passcode
                                        </h4>
                                    </div>
                                    <p className="text-xs leading-relaxed text-neutral-500">
                                        Your mnemonic will be encrypted with this passcode and stored locally. We never
                                        see your passcode.
                                    </p>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Input
                                            isPassword
                                            showToggle={showPass}
                                            onToggle={() => setShowPass((v) => !v)}
                                            placeholder="Passcode (min 8 chars)"
                                            value={passcode}
                                            onChange={(e) => setPasscode(e.target.value)}
                                            autoComplete="new-password"
                                        />
                                        <Input
                                            isPassword
                                            showToggle={showPass2}
                                            onToggle={() => setShowPass2((v) => !v)}
                                            placeholder="Confirm passcode"
                                            value={passcode2}
                                            onChange={(e) => setPasscode2(e.target.value)}
                                            autoComplete="new-password"
                                        />
                                    </div>

                                    {}
                                    <div className="flex items-center gap-4">
                                        <div className="grid flex-grow grid-cols-4 gap-1.5">
                                            {[0, 1, 2, 3].map((i) => (
                                                <span
                                                    key={i}
                                                    className={cn(
                                                        'h-2 transition-colors',
                                                        i < passStrength
                                                            ? passStrengthColors[passStrength]
                                                            : 'bg-neutral-800',
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="w-20 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                                            {passcode ? passStrengthLabel : 'Strength'}
                                        </span>
                                    </div>

                                    {passErr && <p className="text-sm text-red-400">{passErr}</p>}

                                    <Button
                                        size="lg"
                                        className="w-full"
                                        disabled={!canEncrypt}
                                        onClick={handleEncryptContinue}
                                    >
                                        {savingEnc ? 'Encrypting…' : 'Encrypt & continue'}{' '}
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </Panel>
                        )}
                    </div>

                    <aside className="hidden flex-col gap-6 lg:flex">
                        <Panel className="flex flex-col gap-4 bg-[#0d0d0d] p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-neutral-700">
                                    <Download className="h-4 w-4 text-orange-500" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-display text-sm font-semibold uppercase tracking-[0.04em] text-neutral-100">
                                        Browser extension
                                    </span>
                                    <span className="text-xs text-neutral-500">In-context alias generation</span>
                                </div>
                            </div>
                            <Badge variant="outline" className="gap-2 border-amber-400 text-amber-300">
                                <Marker size={5} className="bg-amber-400" /> In development
                            </Badge>
                            <p className="text-xs leading-relaxed text-neutral-500">
                                Not available to install yet — the Chrome and Firefox builds are still in development.
                            </p>
                        </Panel>

                        <Panel className="flex flex-col gap-4 bg-[#0d0d0d] p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-neutral-700">
                                    <Zap className="h-4 w-4 text-orange-500" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-display text-sm font-semibold uppercase tracking-[0.04em] text-neutral-100">
                                        Developer tools
                                    </span>
                                    <span className="text-xs text-neutral-500">API &amp; CLI access</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm" asChild>
                                    <a href="https://api.1337.legal/swagger" target="_blank" rel="noopener noreferrer">
                                        <Zap className="mr-1 h-3 w-3" /> Swagger
                                    </a>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                    <a
                                        href="https://github.com/1337-legal/cli"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <GitFork className="mr-1 h-3 w-3" /> CLI
                                    </a>
                                </Button>
                            </div>
                        </Panel>

                        <Panel className="flex flex-col gap-4 bg-[#0d0d0d] p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-emerald-400/60">
                                    <CubeMark className="h-4 w-4 text-emerald-400" />
                                </div>
                                <span className="font-display text-sm font-semibold uppercase tracking-[0.04em] text-neutral-100">
                                    Your security
                                </span>
                            </div>
                            <ul className="flex flex-col gap-2.5">
                                {[
                                    'Mnemonic never leaves your device',
                                    'Local encryption with your passcode',
                                    'Zero-knowledge authentication',
                                ].map((t) => (
                                    <li key={t} className="flex items-start gap-2.5">
                                        <Marker size={5} className="mt-1.5 bg-emerald-400" />
                                        <span className="text-xs leading-relaxed text-neutral-400">{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </Panel>
                    </aside>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
};

export default Auth;
