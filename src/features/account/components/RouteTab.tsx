import { RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import Backend from '@Services/BackendService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const RouteTab: React.FC = () => {
    const qc = useQueryClient();
    const { data: user, isLoading, isFetching } = useQuery({
        queryKey: ['user'],
        queryFn: () => Backend.getUser(),
    });

    const [forwarding, setForwarding] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        setForwarding(user?.address || '');
    }, [user?.address]);

    const updateMutation = useMutation({
        mutationFn: (address: string) => Backend.updateUser({ address }),
        onSuccess: () => {
            setStatus('Updated');
            qc.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (e: unknown) => setStatus(e instanceof Error ? e.message : 'Update failed'),
    });

    const onUpdate = () => {
        if (!forwarding) return;
        setStatus('');
        updateMutation.mutate(forwarding);
    };

    return (
        <div className="space-y-8">
            <section>
                <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-200">Forwarding Address</h2>
                <p className="mb-4 text-[11px] text-neutral-500">Destination for routed mail / messages.</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input value={forwarding} onChange={e => setForwarding(e.target.value)} placeholder="you@example.com" className="flex-1 rounded-md bg-neutral-950/60 px-2 py-2 text-xs text-neutral-100 outline-none focus:bg-neutral-900/70 focus:ring-2 focus:ring-orange-500/30" />
                    <button onClick={onUpdate} disabled={!forwarding || updateMutation.isPending} className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-[11px] font-semibold text-neutral-900 hover:bg-orange-400 disabled:opacity-40">
                        {updateMutation.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Update'}
                    </button>
                </div>
                {(status || isLoading || isFetching) && (
                    <p className="mt-2 text-[10px] text-neutral-400">{isLoading || isFetching ? 'Loading…' : status}</p>
                )}
            </section>
        </div>
    );
};

export default RouteTab;