import { Marker } from '@Components/icons/Lattice';
import { Button } from '@Components/ui/button';
import { validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';

const splitWords = (v: string) =>
    v
        .trim()
        .toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(/\s+/)
        .filter(Boolean);

interface Props {
    onValidated?: (mnemonic: string) => void;
}

type FormValues = { words: string[] };

const MnemonicForm: React.FC<Props> = ({ onValidated }) => {
    const WORD_COUNT = 24;
    const { register, setValue, watch } = useForm<FormValues>({
        defaultValues: { words: Array(24).fill('') },
    });
    const words = watch('words') || [];
    const mnemonic = words.slice(0, WORD_COUNT).join(' ').trim();

    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const filled = words.slice(0, WORD_COUNT).filter(Boolean).length;
    const [suggestions, setSuggestions] = useState<string[][]>(Array.from({ length: 24 }, () => []));
    const [highlight, setHighlight] = useState<number[]>(Array(24).fill(-1));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const applyMnemonic = useCallback(
        (m: string) => {
            const w = splitWords(m).slice(0, 24);
            Array.from({ length: 24 }, (_, i) => w[i] || '').forEach((val, i) => {
                setValue(`words.${i}` as const, val, { shouldDirty: true, shouldTouch: true });
            });
        },
        [setValue],
    );

    const validateMutation = useMutation({
        mutationFn: async (m: string) => {
            const w = splitWords(m);
            if (w.length !== 24) throw new Error('Need exactly 24 words.');
            if (!validateMnemonic(m, wordlist)) throw new Error('Invalid BIP39 checksum.');
            return m;
        },
        onSuccess: (m) => {
            setError('');
            onValidated?.(m);
        },
        onError: (e: unknown) => setError(e instanceof Error ? e.message : 'Validation failed'),
    });

    const onWordChange = (i: number, value: string) => {
        const sanitized = value.toLowerCase().replace(/[^a-z]/g, '');
        setValue(`words.${i}` as const, sanitized, { shouldDirty: true });
        setSuggestions((prev) => {
            const clone = [...prev];
            const q = sanitized;
            if (q) {
                const matches = wordlist.filter((w) => w.startsWith(q)).slice(0, 8);
                clone[i] = matches.length === 1 && matches[0] === q ? [] : matches;
            } else clone[i] = [];
            return clone;
        });
        setHighlight((h) => {
            const copy = [...h];
            copy[i] = -1;
            return copy;
        });
    };

    const onWordPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData('text');
        const w = splitWords(text);
        if (w.length > 1) {
            e.preventDefault();
            applyMnemonic(w.join(' '));
        }
    };

    const selectSuggestion = (i: number, word: string) => {
        setValue(`words.${i}` as const, word, { shouldDirty: true });
        setSuggestions((prev) => {
            const clone = [...prev];
            clone[i] = [];
            return clone;
        });
        setHighlight((h) => {
            const copy = [...h];
            copy[i] = -1;
            return copy;
        });
        requestAnimationFrame(() => inputsRef.current[i + 1]?.focus());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
        if (!suggestions[i] || suggestions[i].length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlight((h) => {
                const copy = [...h];
                copy[i] = (copy[i] + 1) % suggestions[i].length;
                return copy;
            });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlight((h) => {
                const copy = [...h];
                copy[i] = copy[i] <= 0 ? suggestions[i].length - 1 : copy[i] - 1;
                return copy;
            });
        } else if (e.key === 'Enter') {
            if (highlight[i] >= 0) {
                e.preventDefault();
                selectSuggestion(i, suggestions[i][highlight[i]]);
            }
        } else if (e.key === 'Tab') {
            if (highlight[i] === -1 && suggestions[i].length > 0) {
                e.preventDefault();
                selectSuggestion(i, suggestions[i][0]);
            }
        }
    };

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Marker size={9} />
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-neutral-100">
                        Mnemonic input
                    </span>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setShow((s) => !s)}>
                    {show ? <EyeOff className="mr-1 h-3.5 w-3.5" /> : <Eye className="mr-1 h-3.5 w-3.5" />}
                    {show ? 'Hide' : 'Show'}
                </Button>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-neutral-400">
                Enter your 24-word mnemonic. This never leaves your device; only derived keys are transmitted.
            </p>

            {}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: WORD_COUNT }, (_, i) => {
                    const { ref: fieldRef, name, onBlur } = register(`words.${i}` as const);
                    const w = words[i] || '';
                    const open = suggestions[i] && suggestions[i].length > 0;
                    return (
                        <div key={i} className={cn('relative', open && 'z-20')}>
                            <div
                                className={cn(
                                    'relative flex h-12 items-center border bg-[#0d0d0d] transition-colors',
                                    w ? 'border-neutral-700' : 'border-neutral-800',
                                    'focus-within:border-orange-500',
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex h-full w-7 shrink-0 items-center justify-center font-mono text-[9px] font-semibold',
                                        w ? 'bg-[#1c1c1c] text-orange-300' : 'bg-[#141414] text-neutral-500',
                                    )}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <input
                                    ref={(el) => {
                                        inputsRef.current[i] = el;
                                        fieldRef(el);
                                    }}
                                    name={name}
                                    onBlur={onBlur}
                                    aria-label={`word ${i + 1}`}
                                    value={w}
                                    onChange={(e) => onWordChange(i, e.target.value)}
                                    onPaste={onWordPaste}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    placeholder="—"
                                    type={show ? 'text' : 'password'}
                                    autoComplete="off"
                                    spellCheck={false}
                                    className="h-full w-full bg-transparent px-3 font-mono text-[13px] tracking-[0.02em] text-neutral-100 outline-none placeholder:text-neutral-600"
                                />
                            </div>
                            {open && (
                                <ul className="absolute left-0 right-0 top-full border border-orange-500 bg-neutral-950">
                                    {suggestions[i].map((s, si) => (
                                        <li key={s}>
                                            <button
                                                type="button"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    selectSuggestion(i, s);
                                                }}
                                                className={cn(
                                                    'w-full cursor-pointer px-3 py-1.5 text-left font-mono text-[11px] transition-colors',
                                                    highlight[i] === si
                                                        ? 'bg-orange-500 font-semibold text-neutral-950'
                                                        : 'text-neutral-300 hover:bg-neutral-800',
                                                )}
                                            >
                                                {s}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>

            {}
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-12 gap-1 sm:grid-cols-24">
                    {Array.from({ length: WORD_COUNT }, (_, i) => (
                        <span
                            key={i}
                            className={cn('h-2 transition-colors', i < filled ? 'bg-orange-500' : 'bg-neutral-800')}
                        />
                    ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                        {filled} / {WORD_COUNT} words
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                        {filled === WORD_COUNT ? (
                            <span className="text-orange-300">Ready</span>
                        ) : (
                            'Fill all words to continue'
                        )}
                    </span>
                </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {!error && validateMutation.isError && <p className="text-sm text-red-400">Validation failed.</p>}

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    type="button"
                    size="lg"
                    onClick={() => validateMutation.mutate(mnemonic)}
                    disabled={filled !== WORD_COUNT || validateMutation.isPending}
                >
                    {validateMutation.isPending ? 'Validating…' : 'Sign in'}
                </Button>
                <span className="font-mono text-[11px] text-neutral-500">Paste all 24 words at once</span>
            </div>
        </section>
    );
};

export default MnemonicForm;
