import { Copy, Eye, EyeOff, RefreshCw, ShieldCheck } from 'lucide-react';
// filepath: c:\Users\Sierra\Documents\Projects\1337.legal\Frontend\src\features\auth\components\MnemonicForm.tsx
import React, { useCallback, useRef, useState } from 'react';

import { generateMnemonic, validateMnemonic } from '@scure/bip39';
import { wordlist as english } from '@scure/bip39/wordlists/english';
import { useMutation } from '@tanstack/react-query';

const splitWords = (v: string) => v.trim().toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);

interface Props { onValidated?: (mnemonic: string) => void; }

const MnemonicForm: React.FC<Props> = ({ onValidated }) => {
    const [mnemonic, setMnemonic] = useState('');
    const [words, setWords] = useState<string[]>(Array(12).fill(''));
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const filled = words.filter(Boolean).length;
    const [suggestions, setSuggestions] = useState<string[][]>(Array.from({ length: 12 }, () => []));
    const [highlight, setHighlight] = useState<number[]>(Array(12).fill(-1));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const applyMnemonic = useCallback((m: string) => {
        const w = splitWords(m).slice(0, 12);
        setWords(Array.from({ length: 12 }, (_, i) => w[i] || ''));
        setMnemonic(w.join(' '));
    }, []);

    const generateMutation = useMutation({
        mutationFn: async () => generateMnemonic(english, 128),
        onSuccess: (m) => { applyMnemonic(m); setError(''); }
    });

    const validateMutation = useMutation({
        mutationFn: async () => {
            const w = splitWords(mnemonic);
            if (w.length !== 12) throw new Error('Need exactly 12 words.');
            if (!validateMnemonic(mnemonic, english)) throw new Error('Invalid BIP39 checksum.');
            return mnemonic;
        },
        onSuccess: (m) => { setError(''); onValidated?.(m); },
        onError: (e: unknown) => setError(e instanceof Error ? e.message : 'Validation failed')
    });

    const onWordChange = (i: number, value: string) => {
        const next = [...words];
        next[i] = value.toLowerCase().replace(/[^a-z]/g, '');
        setWords(next);
        const joined = next.join(' ').trim();
        setMnemonic(joined);
        setSuggestions(prev => {
            const clone = [...prev];
            const q = next[i];
            if (q) {
                const matches = english.filter(w => w.startsWith(q)).slice(0, 8);
                clone[i] = (matches.length === 1 && matches[0] === q) ? [] : matches;
            } else clone[i] = [];
            return clone;
        });
        setHighlight(h => { const copy = [...h]; copy[i] = -1; return copy; });
    };

    const onWordPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData('text');
        const w = splitWords(text);
        if (w.length > 1) { e.preventDefault(); applyMnemonic(w.join(' ')); }
    };

    const copy = () => navigator.clipboard.writeText(mnemonic);

    const selectSuggestion = (i: number, word: string) => {
        const next = [...words];
        next[i] = word;
        setWords(next);
        setMnemonic(next.join(' ').trim());
        setSuggestions(prev => { const clone = [...prev]; clone[i] = []; return clone; });
        setHighlight(h => { const copy = [...h]; copy[i] = -1; return copy; });
        requestAnimationFrame(() => inputsRef.current[i + 1]?.focus());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
        if (!suggestions[i] || suggestions[i].length === 0) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => { const copy = [...h]; copy[i] = (copy[i] + 1) % suggestions[i].length; return copy; }); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => { const copy = [...h]; copy[i] = copy[i] <= 0 ? suggestions[i].length - 1 : copy[i] - 1; return copy; }); }
        else if (e.key === 'Enter') { if (highlight[i] >= 0) { e.preventDefault(); selectSuggestion(i, suggestions[i][highlight[i]]); } }
        else if (e.key === 'Tab') { if (highlight[i] === -1 && suggestions[i].length > 0) { e.preventDefault(); selectSuggestion(i, suggestions[i][0]); } }
    };

    return (
        <section className="mb-20">
            <header className="mb-8 space-y-4">
                <h1 className="font-cal text-4xl tracking-tight md:text-5xl">
                    Secure Sign‑In
                    <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200 bg-clip-text font-semibold text-transparent">12‑Word Mnemonic (BIP39)</span>
                </h1>
                <p className="max-w-2xl text-sm md:text-base text-neutral-400">Enter or generate a 12‑word mnemonic. This never leaves your device; only derived keys are transmitted. Filling all 12 words enables Sign In.</p>
                <div className="flex flex-wrap gap-2 pt-1">
                    <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="inline-flex items-center rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow hover:bg-orange-400 disabled:opacity-50">
                        <RefreshCw className={`mr-1 h-3.5 w-3.5 ${generateMutation.isPending ? 'animate-spin' : ''}`} /> {generateMutation.isPending ? 'Generating...' : 'New Mnemonic'}
                    </button>
                    <button onClick={() => validateMutation.mutate()} disabled={!mnemonic || validateMutation.isPending} className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:border-orange-500/60 hover:text-orange-200 disabled:opacity-50">
                        {validateMutation.isPending ? 'Validating...' : 'Sign In'}
                    </button>
                    <button onClick={() => setShow(s => !s)} className="inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-400 transition hover:text-orange-300">
                        {show ? <EyeOff className="mr-1 h-4 w-4" /> : <Eye className="mr-1 h-4 w-4" />} {show ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={copy} disabled={!mnemonic} className="inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-400 transition hover:text-orange-300 disabled:opacity-40">
                        <Copy className="mr-1 h-4 w-4" /> Copy
                    </button>
                </div>
            </header>
            <div className="mb-4">
                <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {words.map((w, i) => (
                        <div key={i} className="group relative">
                            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-orange-500/15 via-amber-400/10 to-transparent opacity-0 transition-opacity group-hover:opacity-70 group-focus-within:opacity-100" />
                            <div className="absolute inset-0 rounded-md border border-neutral-800/70 group-hover:border-neutral-700 group-focus-within:border-orange-400/60 transition-colors" />
                            <input
                                ref={el => { inputsRef.current[i] = el; }}
                                aria-label={`word ${i + 1}`}
                                value={w}
                                onChange={e => onWordChange(i, e.target.value)}
                                onPaste={onWordPaste}
                                onKeyDown={e => handleKeyDown(e, i)}
                                placeholder={(i + 1).toString().padStart(2, '0')}
                                type={show ? 'text' : 'password'}
                                autoComplete="off"
                                spellCheck={false}
                                className="relative z-10 w-full rounded-md bg-neutral-900/60 px-2 py-2 text-[11px] font-mono tracking-wide text-neutral-100 placeholder-neutral-600 outline-none transition focus:bg-neutral-900/80 focus:ring-2 focus:ring-orange-500/30 disabled:opacity-50"
                            />
                            <span className="pointer-events-none absolute -top-1 -left-1 z-20 rounded bg-neutral-950/90 px-1 text-[9px] font-semibold text-orange-300 ring-1 ring-orange-500/30 shadow">{i + 1}</span>
                            {w && (
                                <span className="pointer-events-none absolute -bottom-1 -right-1 z-20 rounded bg-neutral-950/80 px-1 text-[8px] tracking-tight text-neutral-500 ring-1 ring-neutral-700/40">{w.length}</span>
                            )}
                            {suggestions[i] && suggestions[i].length > 0 && (
                                <ul className="absolute top-full left-0 right-0 z-30 mt-1 overflow-hidden rounded-md border border-neutral-800/80 bg-neutral-950/95 backdrop-blur-sm shadow-lg">
                                    {suggestions[i].map((s, si) => (
                                        <li
                                            key={s}
                                            onMouseDown={(e) => { e.preventDefault(); selectSuggestion(i, s); }}
                                            className={`cursor-pointer px-2 py-1 text-[10px] tracking-wide transition-colors ${highlight[i] === si ? 'bg-orange-500/30 text-orange-200' : 'hover:bg-neutral-800/80 text-neutral-300'}`}
                                        >
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-3">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                        <div className="h-full bg-gradient-to-r from-orange-600 via-amber-400 to-orange-300 transition-all duration-500" style={{ width: `${(filled / 12) * 100}%` }} />
                    </div>
                    <p className="mt-1 text-[10px] font-medium tracking-wide text-neutral-500">{filled}/12 words {filled === 12 ? <span className="text-orange-300 ml-1">ready</span> : <span className="ml-1 text-neutral-600">fill all words</span>}</p>
                </div>
            </div>
            {error && <p className="mb-4 text-xs text-red-400">{error}</p>}
            {!error && validateMutation.isError && <p className="mb-4 text-xs text-red-400">Validation failed.</p>}
            <div className="rounded-md border border-neutral-800/70 bg-neutral-900/40 p-4 text-[11px] text-neutral-400 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-orange-400 mt-0.5" />
                <p><strong className="text-orange-300">Security Tip:</strong> Store these words offline. Anyone with them controls your aliases. Only derived keys are sent during auth.</p>
            </div>
        </section>
    );
};

export default MnemonicForm;