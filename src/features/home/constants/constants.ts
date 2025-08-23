import { Fingerprint, KeyRound, Lock, Mail, Shield, TerminalSquare } from 'lucide-react';
import React from 'react';

export interface FeatureItem {
    icon: React.ElementType;
    title: string;
    desc: string;
}

export const features: FeatureItem[] = [
    { icon: Shield, title: 'Blindflare Core', desc: 'Cryptographic handshake + per-request transaction encryption.' },
    { icon: KeyRound, title: 'Session Wrapping', desc: 'Hybrid ECC wrapped session keys; zero plaintext exposure.' },
    { icon: Fingerprint, title: 'Deterministic Integrity', desc: 'Signed intents prevent replay & tampering.' },
    { icon: Mail, title: 'Human-ish Aliases', desc: 'Random semantic triplets — memorable yet unguessable.' },
    { icon: TerminalSquare, title: 'Developer Friendly', desc: 'Predictable JSON envelopes & emerging SDK.' },
    { icon: Lock, title: 'Forward-Secrecy Path', desc: 'Ephemeral negotiation primes for future FS extension.' },
];

export const benefits: string[] = [
    'No one (including us) can read your request contents — bodies are sealed end‑to‑end.',
    'We never see or store your raw password; it is transformed before it ever leaves your device.',
    'Even network edges (e.g. CDN / Cloudflare) only see opaque encrypted envelopes.',
    'Delete any alias at any moment — once gone, the link between you and that alias is removed.',
    'We keep zero content logs, zero request/IP logs — nothing persistent to correlate you and your aliases.',
    'You stay in control: create, use, or dispose of aliases anytime.'
];
