import { Fingerprint, HatGlasses, Lock, Mail, Shield } from 'lucide-react';
import React from 'react';

import { OnionIcon } from '@Components/icons/Onion';

export interface FeatureItem {
    icon: React.ElementType;
    title: string;
    desc: string;
}

export const features: FeatureItem[] = [
    { icon: Shield, title: 'Strict No KYC', desc: 'No government ID, selfies, or personal docs cryptographic trust replaces intrusive verification.' },
    { icon: Lock, title: 'Zero Logs', desc: 'No content, request, IP, or session logs retained — nothing to correlate activity.' },
    { icon: Mail, title: 'Humanish Aliases', desc: 'Pronounceable semantic triplets—easy to recall, hard to enumerate.' },
    { icon: Fingerprint, title: 'Mnemonic Auth', desc: 'Phrase‑based cryptographic derivation; your raw secret never leaves the device.' },
    { icon: OnionIcon, title: 'Tor Friendly', desc: 'We are accessible over Tor, allowing you to use our service without revealing your IP address.' },
    { icon: HatGlasses, title: 'Burnable Accounts', desc: 'Disappear at any moment. You can burn an alias or your account.' }
];

export const benefits: string[] = [
    'No one (including us) can read your request contents — bodies are sealed end‑to‑end.',
    'We never see or store your raw password; it is transformed before it ever leaves your device.',
    'Even network edges (e.g. CDN / Cloudflare) only see opaque encrypted envelopes.',
    'Delete any alias at any moment — once gone, the link between you and that alias is removed.',
    'We keep zero content logs, zero request/IP logs — nothing persistent to correlate you and your aliases.',
    'You stay in control: create, use, or dispose of aliases anytime.'
];
