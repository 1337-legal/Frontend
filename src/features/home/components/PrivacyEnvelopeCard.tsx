import { CubeMark, Marker } from '@Components/icons/Lattice';
import { Panel } from '@Components/ui/panel';
import { Mail } from 'lucide-react';
import React from 'react';

const claims = [
    'Request body is encrypted before leaving your device.',
    "Edge and CDN providers can't see what your HTTP body contains.",
    'Passwords are never stored — we rely on signature-based auth.',
    'Replies are sealed back the same way.',
    'End-to-end PGP forwarding supported — bring your public key.',
];

const Arrow: React.FC = () => (
    <svg
        width="30"
        height="14"
        viewBox="0 0 30 14"
        fill="none"
        stroke="#404040"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden="true"
        className="hidden shrink-0 sm:block"
    >
        <path d="M0 7 H24" />
        <path d="M19 2 L24 7 L19 12" />
    </svg>
);

const Stage: React.FC<{ caption: string; captionClass?: string; children: React.ReactNode }> = ({
    caption,
    captionClass = 'text-neutral-500',
    children,
}) => (
    <div className="flex flex-col items-center gap-2">
        {children}
        <span className={`font-mono text-[9px] uppercase tracking-[0.16em] ${captionClass}`}>{caption}</span>
    </div>
);

export const PrivacyEnvelopeCard: React.FC = () => (
    <Panel ticks className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-center gap-3">
            <CubeMark className="h-[22px] w-[22px] text-orange-500" />
            <h3 className="font-display text-xl font-semibold uppercase tracking-[0.04em] text-neutral-100">
                Blindflare privacy protocol
            </h3>
        </div>

        <p className="text-sm leading-relaxed text-neutral-400">
            Instead of sending readable JSON, your app sends an encrypted capsule. We can route and fulfill it — but not
            inspect its private contents.
        </p>

        {}
        <div className="flex flex-wrap items-center justify-center gap-5 border border-neutral-800 bg-neutral-950 p-6">
            <Stage caption="Device">
                <div className="flex h-[62px] w-[62px] items-center justify-center border border-neutral-700 bg-[#121212]">
                    <span className="font-mono text-[10px] tracking-[0.1em] text-neutral-400">JSON</span>
                </div>
            </Stage>
            <Arrow />
            <Stage caption="Sealed" captionClass="text-orange-300">
                <div className="hatch flex h-[62px] w-[62px] items-center justify-center border border-orange-500">
                    <div className="h-[26px] w-[26px] border border-orange-500 bg-neutral-950" />
                </div>
            </Stage>
            <Arrow />
            <Stage caption="Opaque">
                <div className="flex h-[62px] w-[62px] items-center justify-center border border-dashed border-neutral-700 bg-[#0d0d0d]">
                    <span className="font-mono text-[10px] tracking-[0.1em] text-neutral-500">CDN</span>
                </div>
            </Stage>
            <Arrow />
            <Stage caption="Relay">
                <div className="flex h-[62px] w-[62px] items-center justify-center border border-neutral-700 bg-[#121212]">
                    <Mail className="h-[22px] w-[22px] text-neutral-400" />
                </div>
            </Stage>
        </div>

        <ul className="flex flex-col gap-3">
            {claims.map((c) => (
                <li key={c} className="flex items-start gap-3">
                    <Marker className="mt-[7px] bg-orange-500" />
                    <span className="text-[13px] leading-relaxed text-neutral-400">{c}</span>
                </li>
            ))}
        </ul>

        <div className="flex flex-col gap-1.5 border-l-2 border-orange-500 bg-neutral-950 px-5 py-4 font-mono text-[11px]">
            <span className="font-semibold uppercase tracking-[0.14em] text-orange-500">Envelope :: sealed</span>
            <span className="text-neutral-500">data&nbsp;&nbsp;&nbsp;&nbsp;: 0x8f0c…b7</span>
            <span className="text-neutral-500">visible&nbsp;: size, route</span>
            <span className="text-neutral-500">hidden&nbsp;&nbsp;: alias, intent, password material</span>
        </div>
    </Panel>
);

export default PrivacyEnvelopeCard;
