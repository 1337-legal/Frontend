import { RefreshCw } from 'lucide-react';
import React from 'react';

interface Props {
    forwarding: string;
    updating: boolean;
    fwdStatus: string;
    onChange: (v: string) => void;
    onUpdate: () => void;
}

const RouteTab: React.FC<Props> = ({ forwarding, updating, fwdStatus, onChange, onUpdate }) => (
    <div className="space-y-8">
        <section>
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-200">Forwarding Address</h2>
            <p className="mb-4 text-[11px] text-neutral-500">Destination for routed mail / messages.</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input value={forwarding} onChange={e => onChange(e.target.value)} placeholder="you@example.com" className="flex-1 rounded-md bg-neutral-950/60 px-2 py-2 text-xs text-neutral-100 outline-none focus:bg-neutral-900/70 focus:ring-2 focus:ring-orange-500/30" />
                <button onClick={onUpdate} disabled={!forwarding || updating} className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-[11px] font-semibold text-neutral-900 hover:bg-orange-400 disabled:opacity-40">
                    {updating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Update'}
                </button>
            </div>
            {fwdStatus && <p className="mt-2 text-[10px] text-neutral-400">{fwdStatus}</p>}
        </section>
    </div>
);

export default RouteTab;