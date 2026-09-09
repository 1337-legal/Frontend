import { Marker } from '@Components/icons/Lattice';
import React from 'react';

const specs = ['No KYC', 'Zero logs', 'Tor reachable', 'BIP39 mnemonic'];

export const SpecBar: React.FC = () => (
    <div className="hatch-neutral grid grid-cols-2 border-b border-neutral-800 bg-[#0d0d0d] md:grid-cols-4">
        {specs.map((s, i) => (
            <div
                key={s}
                className={`flex h-19 items-center justify-center gap-3 ${i % 2 === 1 ? 'border-l border-neutral-800' : ''} ${i >= 2 ? 'border-t border-neutral-800 md:border-t-0' : ''} ${i === 2 ? 'md:border-l md:border-neutral-800' : ''}`}
            >
                <Marker size={7} />
                <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-neutral-300">{s}</span>
            </div>
        ))}
    </div>
);

export default SpecBar;
