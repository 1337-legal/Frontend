import PageShell, { Bullets, Clause } from '@Features/shared/components/PageShell';
import React from 'react';

const Privacy: React.FC = () => (
    <PageShell
        label="Privacy"
        title="Privacy first"
        accent="No hidden harvest"
        intro="We collect the minimum required to operate blind, end-to-end alias issuance. No ad tech, fingerprinting, third-party trackers, or data resale — ever."
    >
        <div className="flex flex-col gap-4">
            <Clause index="01" title="Core principles">
                <Bullets
                    items={[
                        'Open source cryptographic flows (reviewable, reproducible builds).',
                        'Blindflare envelope: server never sees plaintext alias generation intent.',
                        'Zero analytics beacons; only coarse, ephemeral operational metrics (aggregate process counters in RAM) — not persisted.',
                        'No profiling: no cross-site tracking, no device graph, no behavioral enrichment.',
                        'Keys generated client-side; secret material never transmitted unencrypted.',
                    ]}
                />
            </Clause>
            <Clause index="02" title="Data we avoid or minimize">
                <Bullets
                    items={[
                        'No real email harvesting; aliases are deterministic / random words only.',
                        'No content logging: request bodies inside the encrypted transport envelope stay in memory for processing, then are released.',
                        'No IP retention beyond transient reverse-proxy access logs with truncated addresses (rotated quickly).',
                        'No cookies for tracking; only a session token (JWT) if you authenticate — short TTL, revocable.',
                    ]}
                />
            </Clause>
            <Clause index="03" title="Limited operational data">
                <p>
                    To resist abuse (spam flooding, brute force) we may retain rolling counters — alias creations per
                    key, failed auth attempts — keyed to hashed public keys. No linkage to a person, and hashes rotate.
                </p>
            </Clause>
            <Clause index="04" title="Your controls">
                <Bullets
                    items={[
                        'Revoke: regenerate your keypair, which invalidates previous session material.',
                        'Export: inspect local storage or config file; there is nothing server-side to export.',
                        'Erase: delete local keys; the server retains no user profile to purge.',
                    ]}
                />
            </Clause>
            <Clause index="05" title="Third parties">
                <p>
                    We avoid third-party SDKs. Hosting and edge providers (DNS, CDN) see standard network metadata only.
                    No sharing with advertisers or data brokers.
                </p>
            </Clause>
            <Clause index="06" title="Changes">
                <p>
                    Material changes require a bump in this page with a dated changelog entry. You can diff in Git —
                    transparency by design.
                </p>
            </Clause>

            <p className="mt-4 font-mono text-[11px] text-neutral-500">
                Alpha build. Questions:{' '}
                <a href="mailto:privacy@1337.legal" className="text-orange-400 hover:text-orange-300">
                    privacy@1337.legal
                </a>
                . Last updated {new Date().toISOString().split('T')[0]}.
            </p>
        </div>
    </PageShell>
);

export default Privacy;
