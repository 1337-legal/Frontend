import { Marker, ReloadSquare } from '@Components/icons/Lattice';
import { Button } from '@Components/ui/button';
import { Panel } from '@Components/ui/panel';
import BackendService from '@Services/BackendService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

const RouteTab: React.FC = () => {
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ['user'],
        queryFn: () => BackendService.getUser(),
    });

    const [forwarding, setForwarding] = useState('');
    const [status, setStatus] = useState('');
    const [syncedAddress, setSyncedAddress] = useState<string | undefined>(undefined);

    if (user?.address !== syncedAddress) {
        setSyncedAddress(user?.address);
        setForwarding(user?.address || '');
    }

    const updateMutation = useMutation({
        mutationFn: (address: string) => BackendService.updateUser({ address }),
        onSuccess: () => {
            setStatus('Updated');
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (e: unknown) => setStatus(e instanceof Error ? e.message : 'Update failed'),
    });

    const onUpdate = () => {
        if (!forwarding) return;
        setStatus('');
        updateMutation.mutate(forwarding);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3.5">
                    <Marker size={10} />
                    <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-[0.03em] text-neutral-100">
                        Forwarding address
                    </h1>
                </div>
                <p className="pl-6 font-mono text-[11px] leading-relaxed text-neutral-500">
                    Destination for routed mail and messages.
                </p>
            </div>

            <Panel ticks className="flex flex-col gap-4 p-6">
                <label
                    htmlFor="forwarding"
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-300"
                >
                    Destination inbox
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        id="forwarding"
                        value={forwarding}
                        onChange={(e) => setForwarding(e.target.value)}
                        placeholder="you@example.com"
                        className="h-12 flex-grow border border-neutral-800 bg-neutral-950 px-4 font-mono text-sm text-neutral-100 outline-none transition-colors placeholder:text-neutral-600 focus:border-orange-500"
                    />
                    <Button
                        onClick={onUpdate}
                        disabled={!forwarding || updateMutation.isPending}
                        className="h-12 shrink-0"
                    >
                        {updateMutation.isPending ? <ReloadSquare className="h-3.5 w-3.5 animate-spin" /> : 'Update'}
                    </Button>
                </div>
                {(status || isLoading || isFetching) && (
                    <p className="font-mono text-[11px] text-neutral-400">
                        {isLoading || isFetching ? 'Loading…' : status}
                    </p>
                )}
            </Panel>

            <div className="border border-neutral-800 bg-[#0d0d0d] p-5">
                <div className="mb-2.5 flex items-center gap-2.5">
                    <Marker />
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                        How routing works
                    </span>
                </div>
                <p className="max-w-2xl text-xs leading-relaxed text-neutral-500">
                    Every alias you create forwards here. Upstream services only ever see the alias — your destination
                    inbox is never disclosed to them.
                </p>
            </div>
        </div>
    );
};

export default RouteTab;
