import {ArrowLeft, ArrowRight, Check, Clipboard, Download, ExternalLink, Eye, EyeOff, Github, KeyRound, Lock, Mail, Shield, Zap} from 'lucide-react';
import React, {useEffect} from 'react';
import type {SubmitHandler} from 'react-hook-form';
import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router';

import {Badge} from '@Components/ui/badge';
import {Button} from '@Components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@Components/ui/card';
import {Separator} from '@Components/ui/separator';
import AuthNebulaScene from '@Features/auth/components/AuthNebulaScene';
import MnemonicForm from '@Features/auth/components/MnemonicForm';
import Spark from '@Features/home/components/Spark';
import SiteFooter from '@Features/shared/components/SiteFooter';
import {generateMnemonic} from '@scure/bip39';
import {wordlist} from '@scure/bip39/wordlists/english.js';
import BackendService from '@Services/BackendService';
import {decryptMnemonic, encryptMnemonic} from '@Services/CryptoService';
import SessionService from '@Services/SessionService';

const getMessage = (d: unknown, fallback: string) => {
    if (d && typeof d === 'object' && 'message' in d) {
        const m = (d as Record<string, unknown>).message;
        if (typeof m === 'string') return m;
    }
    return fallback;
};

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = React.useState<'choose' | 'have' | 'new' | 'verify' | 'show' | 'unlock'>(
        () => (SessionService.getEncryptedMnemonic() ? 'unlock' : 'choose')
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
    const { register, handleSubmit, formState: { errors }, watch, resetField } = useForm<NewForm>({
        defaultValues: { email: '', pgp: '' }
    });

    const onValidated = async (m: string, address?: string) => {
        try {
            setGeneratedMnemonic(m);
            setPasscode('');
            setPasscode2('');
            setPassErr('');

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

    const stepTitle = mode === 'choose' ? 'Choose how to continue' : mode === 'have' ? 'Enter your mnemonic' : mode === 'new' ? 'Start with your email' : mode === 'verify' ? 'Check your inbox' : mode === 'unlock' ? 'Welcome back' : 'Save your mnemonic';
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
    const passStrengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-400'];

    const canEncrypt = !savingEnc && passcode.length >= 8 && passcode === passcode2;

    const handleEncryptContinue = async () => {
        if (!canEncrypt || !generatedMnemonic) return;
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

    // Input component matching Home page style
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
        register?: ReturnType<typeof register>;
    }> = ({ icon, type = 'text', placeholder, value, onChange, showToggle, isPassword, onToggle, className = '', id, autoComplete, register: registerProps }) => (
        <div className="relative flex items-center">
            {icon && (
                <span className="absolute left-3 text-neutral-500">
                    {icon}
                </span>
            )}
            <input
                id={id}
                type={isPassword ? (showToggle ? 'text' : 'password') : type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                className={`w-full rounded-md border border-neutral-700 bg-neutral-900/60 ${icon ? 'pl-10' : 'pl-4'} pr-${onToggle ? '10' : '4'} py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition-colors focus:border-orange-500/60 focus:bg-neutral-900 ${className}`}
                {...registerProps}
            />
            {onToggle && (
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 p-1 text-neutral-500 transition-colors hover:text-orange-400"
                    aria-label={showToggle ? 'Hide' : 'Show'}
                >
                    {showToggle ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            )}
        </div>
    );

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-neutral-100">
            {/* Background - matching Home page style */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 opacity-40">
                    <AuthNebulaScene />
                </div>
                <div className="absolute left-1/2 top-[-15%] h-[640px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.18),transparent_60%)] blur-3xl" />
                <div className="absolute right-[-10%] bottom-[-10%] h-[480px] w-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,115,60,0.14),transparent_70%)] blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-6 pt-16 pb-8 md:pt-24">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-orange-300 hover:bg-transparent" asChild>
                        <Link to="/">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Link>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-orange-400/50 bg-neutral-900/60 text-orange-300 backdrop-blur">
                        <Spark className="mr-1" /> Authentication
                    </Badge>
                    <Badge className="bg-orange-600/25 text-orange-200 hover:bg-orange-600/30">
                        Step {mode === 'unlock' ? 1 : stepNum}/{maxSteps}
                    </Badge>
                </div>
                <h1 className="text-balance font-cal text-3xl leading-tight tracking-tight md:text-5xl text-neutral-100">
                    {stepTitle}
                    <span className="block bg-linear-to-r from-orange-400 via-orange-300 to-amber-200 bg-clip-text font-semibold text-transparent">
                        {mode === 'unlock' ? 'Secure Access' : mode === 'show' ? 'Your Recovery Phrase' : 'Zero-Knowledge Auth'}
                    </span>
                </h1>
                <span aria-hidden className="block h-px w-24 bg-linear-to-r from-orange-400/60 to-transparent" />
            </header>

            {/* Main Content */}
            <main className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
                <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                    {/* Left Column - Main Form */}
                    <div className="space-y-6">
                        {/* Unlock Mode */}
                        {mode === 'unlock' && (
                            <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                                        <Lock className="h-7 w-7" />
                                    </div>
                                    <CardTitle className="text-xl text-neutral-100">Welcome back</CardTitle>
                                    <CardDescription className="text-neutral-400">
                                        Enter your passcode to unlock your encrypted mnemonic
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="mx-auto max-w-sm space-y-4">
                                        <Input
                                            icon={<KeyRound className="h-4 w-4" />}
                                            isPassword
                                            showToggle={showUnlockPass}
                                            onToggle={() => setShowUnlockPass(v => !v)}
                                            placeholder="Enter your passcode"
                                            value={unlockPass}
                                            onChange={(e) => setUnlockPass(e.target.value)}
                                        />
                                        {unlockErr && (
                                            <p className="text-sm text-red-400 text-center">{unlockErr}</p>
                                        )}
                                        <Button
                                            size="lg"
                                            className="w-full bg-orange-500 text-neutral-900 hover:bg-orange-400"
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
                                        >
                                            {unlockLoading ? 'Unlocking...' : 'Unlock'} <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                        <Separator className="bg-neutral-800" />
                                        <Button
                                            variant="ghost"
                                            className="w-full text-neutral-400 hover:text-orange-300 hover:bg-transparent"
                                            onClick={() => setMode('choose')}
                                        >
                                            Use a different mnemonic
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Choose Mode */}
                        {mode === 'choose' && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card
                                    className="group cursor-pointer border-neutral-800 bg-neutral-950/50 backdrop-blur-sm transition hover:border-orange-500/50 hover:shadow-[0_0_0_1px_rgba(251,146,60,0.35),0_8px_30px_-8px_rgba(251,146,60,0.4)]"
                                    onClick={() => setMode('have')}
                                >
                                    <CardHeader className="space-y-4">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition-transform group-hover:scale-110">
                                            <KeyRound className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg text-neutral-100">I have a mnemonic</CardTitle>
                                        <CardDescription className="text-neutral-400">
                                            Sign in using your existing 24-word recovery phrase
                                        </CardDescription>
                                        <div className="flex items-center gap-2 text-sm font-medium text-orange-400 opacity-0 transition-opacity group-hover:opacity-100">
                                            Continue <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </CardHeader>
                                </Card>
                                <Card
                                    className="group cursor-pointer border-neutral-800 bg-neutral-950/50 backdrop-blur-sm transition hover:border-orange-500/50 hover:shadow-[0_0_0_1px_rgba(251,146,60,0.35),0_8px_30px_-8px_rgba(251,146,60,0.4)]"
                                    onClick={() => setMode('new')}
                                >
                                    <CardHeader className="space-y-4">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition-transform group-hover:scale-110">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg text-neutral-100">I'm new here</CardTitle>
                                        <CardDescription className="text-neutral-400">
                                            Create a new account and get your recovery phrase
                                        </CardDescription>
                                        <div className="flex items-center gap-2 text-sm font-medium text-orange-400 opacity-0 transition-opacity group-hover:opacity-100">
                                            Get started <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>
                        )}

                        {/* Have Mnemonic Mode */}
                        {mode === 'have' && (
                            <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
                                <CardHeader>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-fit text-neutral-400 hover:text-orange-300 hover:bg-transparent"
                                        onClick={() => setMode('choose')}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <MnemonicForm onValidated={onValidated} />
                                </CardContent>
                            </Card>
                        )}

                        {/* New User Mode */}
                        {mode === 'new' && (
                            <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
                                <CardHeader>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-fit text-neutral-400 hover:text-orange-300 hover:bg-transparent"
                                        onClick={() => setMode('choose')}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                    <div className="text-center pt-4">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                                            <Mail className="h-7 w-7" />
                                        </div>
                                        <CardTitle className="text-xl text-neutral-100">Let's get started</CardTitle>
                                        <CardDescription className="text-neutral-400 mt-2">
                                            We'll send a verification code to your email, then generate your secure mnemonic
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit(handleRegister)} className="mx-auto max-w-md space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-300 mb-2" htmlFor="email">
                                                Email address
                                            </label>
                                            <Input
                                                id="email"
                                                icon={<Mail className="h-4 w-4" />}
                                                type="email"
                                                placeholder="you@example.com"
                                                register={register('email', {
                                                    required: 'Email is required',
                                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                                                })}
                                            />
                                            {errors.email && (
                                                <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                                            )}
                                        </div>

                                        {/* PGP Section */}
                                        {!showPGP ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowPGP(true)}
                                                className="w-full rounded-md border border-dashed border-orange-500/40 bg-orange-500/5 p-4 text-left transition-all hover:border-orange-500/60 hover:bg-orange-500/10"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                                                        <KeyRound className="h-4 w-4 text-orange-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-medium text-orange-200">Add PGP public key</span>
                                                            <Badge className="bg-orange-600/25 text-orange-200 text-[10px]">Recommended</Badge>
                                                        </div>
                                                        <p className="text-xs text-neutral-500">
                                                            Encrypt your verification email end-to-end
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="rounded-md border border-orange-500/40 bg-orange-500/5 p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-neutral-300">PGP Public Key</label>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-neutral-500 hover:text-orange-300 hover:bg-transparent h-auto p-0"
                                                        onClick={() => { setShowPGP(false); resetField('pgp'); }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                                <textarea
                                                    id="pgp"
                                                    placeholder={`-----BEGIN PGP PUBLIC KEY BLOCK-----\n...\n-----END PGP PUBLIC KEY BLOCK-----`}
                                                    className="w-full h-28 resize-y rounded-md border border-neutral-700 bg-neutral-900/60 px-3 py-2 text-xs font-mono text-neutral-200 placeholder:text-neutral-600 outline-none transition-colors focus:border-orange-500/60"
                                                    {...register('pgp', {
                                                        validate: (v) => !v || (/BEGIN PGP PUBLIC KEY BLOCK/.test(v) && /END PGP PUBLIC KEY BLOCK/.test(v)) || 'Invalid PGP public key'
                                                    })}
                                                />
                                                {errors.pgp && (
                                                    <p className="text-sm text-red-400">{errors.pgp.message as string}</p>
                                                )}
                                                {isPgpArmored && (
                                                    <p className="flex items-center gap-2 text-sm text-emerald-400">
                                                        <Check className="h-4 w-4" /> Your verification email will be encrypted
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <p className="text-xs text-neutral-500 text-center">
                                            We never sell your email. Only opt-in notifications.
                                        </p>

                                        {startError && (
                                            <p className="text-sm text-red-400 text-center">{startError}</p>
                                        )}

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full bg-orange-500 text-neutral-900 hover:bg-orange-400"
                                            disabled={genLoading}
                                        >
                                            {genLoading ? 'Sending code...' : 'Continue'} <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Verify Mode */}
                        {mode === 'verify' && (
                            <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
                                <CardHeader>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-fit text-neutral-400 hover:text-orange-300 hover:bg-transparent"
                                        onClick={() => setMode('new')}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                    <div className="text-center pt-4">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                            <Mail className="h-7 w-7" />
                                        </div>
                                        <CardTitle className="text-xl text-neutral-100">Check your inbox</CardTitle>
                                        <CardDescription className="text-neutral-400 mt-2">
                                            We sent a 3-word verification code to <span className="text-orange-300 font-medium">{pendingEmail}</span>
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mx-auto max-w-sm space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">Verification code</label>
                                            <input
                                                aria-label="verification code"
                                                value={code}
                                                onChange={e => setCode(e.target.value)}
                                                placeholder="word word word"
                                                className="w-full rounded-md border border-neutral-700 bg-neutral-900/60 px-4 py-3 text-center text-lg font-mono tracking-widest text-neutral-100 placeholder:text-neutral-600 outline-none transition-colors focus:border-orange-500/60"
                                            />
                                        </div>
                                        {verifyError && (
                                            <p className="text-sm text-red-400 text-center">{verifyError}</p>
                                        )}
                                        <Button
                                            size="lg"
                                            className="w-full bg-orange-500 text-neutral-900 hover:bg-orange-400"
                                            disabled={verifyLoading || code.trim().split(/\s+/).length < 3}
                                            onClick={submitVerification}
                                        >
                                            {verifyLoading ? 'Verifying...' : 'Verify'} <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                        <p className="text-xs text-neutral-500 text-center">
                                            The code uses words from the BIP39 wordlist. Keep the order.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Show Mnemonic Mode */}
                        {mode === 'show' && generatedMnemonic && (
                            <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-neutral-400 hover:text-orange-300 hover:bg-transparent"
                                            onClick={() => setMode('new')}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-neutral-500 hover:text-orange-300 hover:bg-transparent"
                                            onClick={() => setMode('choose')}
                                        >
                                            Start over
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Warning Banner */}
                                    <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4">
                                        <div className="flex gap-3">
                                            <Shield className="h-5 w-5 text-amber-400 shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-amber-200 mb-1">Save this phrase securely</h4>
                                                <p className="text-xs text-amber-200/70">
                                                    Write it down and store it in a safe place. This phrase grants full access to your account. Never share it with anyone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mnemonic Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {generatedMnemonic.split(' ').map((w, i) => (
                                            <div
                                                key={i}
                                                className="group flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 transition hover:border-orange-500/40"
                                            >
                                                <span className="flex h-5 w-5 items-center justify-center rounded bg-neutral-800 text-[10px] font-bold text-neutral-500 group-hover:text-orange-400">
                                                    {i + 1}
                                                </span>
                                                <span className="text-sm font-mono text-neutral-200 truncate">{w}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Copy Button */}
                                    <div className="flex justify-center">
                                        <Button
                                            variant="outline"
                                            className="border-neutral-700 hover:border-neutral-600 text-neutral-200 hover:text-neutral-100 bg-neutral-900/40 hover:bg-neutral-800/60"
                                            onClick={async () => {
                                                try {
                                                    await navigator.clipboard?.writeText(generatedMnemonic);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                } catch { /* noop */ }
                                            }}
                                        >
                                            {copied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
                                            {copied ? 'Copied!' : 'Copy to clipboard'}
                                        </Button>
                                    </div>

                                    <Separator className="bg-neutral-800" />

                                    {/* Passcode Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Lock className="h-4 w-4 text-orange-400" />
                                            <h4 className="text-sm font-semibold text-neutral-200">Create a passcode</h4>
                                        </div>
                                        <p className="text-xs text-neutral-500">
                                            Your mnemonic will be encrypted with this passcode and stored locally. We never see your passcode.
                                        </p>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <Input
                                                isPassword
                                                showToggle={showPass}
                                                onToggle={() => setShowPass(v => !v)}
                                                placeholder="Passcode (min 8 chars)"
                                                value={passcode}
                                                onChange={(e) => setPasscode(e.target.value)}
                                                autoComplete="new-password"
                                            />
                                            <Input
                                                isPassword
                                                showToggle={showPass2}
                                                onToggle={() => setShowPass2(v => !v)}
                                                placeholder="Confirm passcode"
                                                value={passcode2}
                                                onChange={(e) => setPasscode2(e.target.value)}
                                                autoComplete="new-password"
                                            />
                                        </div>

                                        {/* Strength Indicator */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${passStrengthColors[passStrength]}`}
                                                    style={{ width: `${(passStrength / 4) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-neutral-500 w-16">{passcode ? passStrengthLabel : 'Strength'}</span>
                                        </div>

                                        {passErr && (
                                            <p className="text-sm text-red-400">{passErr}</p>
                                        )}

                                        <Button
                                            size="lg"
                                            className="w-full bg-orange-500 text-neutral-900 hover:bg-orange-400"
                                            disabled={!canEncrypt}
                                            onClick={handleEncryptContinue}
                                        >
                                            {savingEnc ? 'Encrypting...' : 'Encrypt & Continue'} <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <aside className="hidden lg:block space-y-6">
                        <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
                            <CardHeader className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                                        <Download className="h-4 w-4 text-orange-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm text-neutral-200">Browser Extension</CardTitle>
                                        <CardDescription className="text-xs">In-context alias generation</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm" className="bg-orange-500 text-neutral-900 hover:bg-orange-400" asChild>
                                        <a href="https://chromewebstore.google.com/detail/placeholder" target="_blank" rel="noopener noreferrer">
                                            Chrome <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-neutral-700 hover:border-neutral-600 text-neutral-200 hover:text-neutral-100 bg-neutral-900/40 hover:bg-neutral-800/60"
                                        asChild
                                    >
                                        <a href="https://addons.mozilla.org/en-US/firefox/addon/placeholder" target="_blank" rel="noopener noreferrer">
                                            Firefox <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
                            <CardHeader className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                                        <Zap className="h-4 w-4 text-orange-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm text-neutral-200">Developer Tools</CardTitle>
                                        <CardDescription className="text-xs">API & CLI access</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm" className="bg-orange-500 text-neutral-900 hover:bg-orange-400" asChild>
                                        <Link to="https://api.1337.legal/swagger" target="_blank">
                                            <Zap className="mr-1 h-3 w-3" /> Swagger
                                        </Link>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-neutral-700 hover:border-neutral-600 text-neutral-200 hover:text-neutral-100 bg-neutral-900/40 hover:bg-neutral-800/60"
                                        asChild
                                    >
                                        <a href="https://github.com/1337-legal/cli" target="_blank" rel="noopener noreferrer">
                                            <Github className="mr-1 h-3 w-3" /> CLI
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
                            <CardHeader className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                                        <Shield className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <CardTitle className="text-sm text-neutral-200">Your security</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-xs text-neutral-400">
                                    <li className="flex items-start gap-2">
                                        <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                                        <span>Mnemonic never leaves your device</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                                        <span>Local encryption with your passcode</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                                        <span>Zero-knowledge authentication</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
};

export default Auth;