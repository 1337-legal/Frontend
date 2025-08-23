import { Shield } from 'lucide-react';
import React from 'react';

export const SiteFooter: React.FC = () => (
    <footer className="relative mt-8 border-t border-neutral-800/80 bg-neutral-950/90 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.08),transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
            <div className="space-y-3">
                <p className="font-semibold text-neutral-200">1337.legal</p>
                <p className="text-xs text-neutral-500 leading-relaxed">Secure email identity — disposable aliases sealed with strong encryption. We cannot read your contents.</p>
                <p className="text-[10px] uppercase tracking-wide text-orange-400/80">Bitcoin & Monero accepted</p>
            </div>
            <div className="flex flex-col gap-3 text-xs">
                <p className="font-medium text-neutral-300">Resources</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-neutral-500">
                    {['Docs', 'Status', 'Roadmap', 'License', 'Privacy', 'Terms'].map(l => (
                        <span key={l} className="cursor-pointer transition hover:text-orange-300/80">{l}</span>
                    ))}
                </div>
            </div>
            <div className="space-y-3 text-xs">
                <p className="font-medium text-neutral-300">Build</p>
                <p className="flex items-center gap-2 text-neutral-500"><Shield className="h-3.5 w-3.5 text-orange-400" /> Preview build — not production email yet.</p>
                <p className="text-neutral-600">© {new Date().getFullYear()} 1337.legal</p>
            </div>
        </div>
    </footer>
);

export default SiteFooter;
