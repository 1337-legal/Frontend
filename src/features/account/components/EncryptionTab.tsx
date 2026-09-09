import { CubeLock, Marker, ReloadSquare } from '@Components/icons/Lattice';
import { Button } from '@Components/ui/button';
import { Panel } from '@Components/ui/panel';
import BackendService from '@Services/BackendService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

const EncryptionTab: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => BackendService.getUser(),
    });

    const [pgpKey, setPgpKey] = useState('');
    const [status, setStatus] = useState('');
    const [syncedKey, setSyncedKey] = useState<string | null | undefined>(undefined);

    if (user?.pgpPublicKey !== syncedKey) {
        setSyncedKey(user?.pgpPublicKey);
        setPgpKey(user?.pgpPublicKey || '');
    }

    const [pgpFingerprint, setPgpFingerprint] = useState('');

    useEffect(() => {
        if (!pgpKey) return;
        let cancelled = false;
        const calcFingerprint = async () => {
            try {
                const hashBuffer = await window.crypto.subtle.digest('SHA-1', new TextEncoder().encode(pgpKey.trim()));
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
                if (!cancelled) setPgpFingerprint(`…${hex}`);
            } catch {
                if (!cancelled) setPgpFingerprint('');
            }
        };
        void calcFingerprint();
        return () => {
            cancelled = true;
        };
    }, [pgpKey]);

    const saveMutation = useMutation({
        mutationFn: (key: string) => BackendService.updateUser({ pgpPublicKey: key }),
        onSuccess: () => {
            setStatus('Key saved');
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (e: unknown) => setStatus(e instanceof Error ? e.message : 'Save failed'),
    });

    const removeMutation = useMutation({
        mutationFn: () => BackendService.updateUser({ pgpPublicKey: null }),
        onSuccess: () => {
            setStatus('Key removed');
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (e: unknown) => setStatus(e instanceof Error ? e.message : 'Remove failed'),
    });

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3.5">
                    <Marker size={10} />
                    <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-[0.03em] text-neutral-100">
                        PGP end-to-end
                    </h1>
                </div>
                <p className="max-w-2xl pl-6 font-mono text-[11px] leading-relaxed text-neutral-500">
                    Provide an ASCII-armored public key. Supported operations encrypt outbound content with this key in
                    addition to transport security.
                </p>
            </div>

            <Panel ticks className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-2.5">
                    <CubeLock className="h-4 w-4 text-orange-500" />
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                        Public key
                    </span>
                </div>

                <textarea
                    value={pgpKey}
                    onChange={(e) => setPgpKey(e.target.value)}
                    placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----"
                    aria-label="PGP public key"
                    className="h-48 w-full resize-y border border-neutral-800 bg-neutral-950 px-4 py-3 font-mono text-[11px] leading-relaxed text-neutral-100 outline-none transition-colors placeholder:text-neutral-600 focus:border-orange-500"
                />

                {pgpKey && pgpFingerprint && (
                    <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-neutral-400">
                        <span className="uppercase tracking-[0.14em] text-neutral-500">Fingerprint</span>
                        <span className="break-all text-orange-300">{pgpFingerprint}</span>
                    </p>
                )}

                <div className="flex flex-wrap gap-2.5">
                    <Button
                        onClick={() => saveMutation.mutate(pgpKey.trim())}
                        disabled={!pgpKey.trim() || saveMutation.isPending}
                    >
                        {saveMutation.isPending ? (
                            <ReloadSquare className="mr-1 h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <CubeLock className="mr-1 h-3.5 w-3.5" />
                        )}
                        {saveMutation.isPending ? 'Saving…' : 'Save key'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => removeMutation.mutate()}
                        disabled={!user?.pgpPublicKey || removeMutation.isPending}
                    >
                        Remove
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setPgpKey('')}
                        disabled={
                            saveMutation.isPending || removeMutation.isPending || (!pgpKey && !user?.pgpPublicKey)
                        }
                    >
                        Clear
                    </Button>
                </div>

                {status && <p className="font-mono text-[11px] text-neutral-400">{status}</p>}
            </Panel>

            <div className="border border-neutral-800 bg-[#0d0d0d] p-5">
                <div className="mb-2.5 flex items-center gap-2.5">
                    <Marker />
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                        Two layers, not one
                    </span>
                </div>
                <p className="max-w-2xl text-xs leading-relaxed text-neutral-500">
                    The Blindflare envelope already hides your request contents in transit. A PGP key adds a second,
                    independent layer that only you can open.
                </p>
            </div>
        </div>
    );
};

export default EncryptionTab;
