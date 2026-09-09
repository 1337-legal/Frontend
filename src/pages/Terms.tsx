import PageShell, { Bullets, Clause } from '@Features/shared/components/PageShell';
import React from 'react';

const Terms: React.FC = () => (
    <PageShell
        label="Terms"
        title="Terms of use"
        accent="Plain & minimal"
        intro='Alpha software provided "as is" — focus is privacy, correctness, and cryptographic transparency. These terms are short so you can actually read them.'
    >
        <div className="flex flex-col gap-4">
            <Clause index="01" title="Acceptance">
                <p>
                    By generating an alias, or using the CLI, the API, or the browser extension once it is released, you
                    agree to these Terms. If you disagree, do not use the service.
                </p>
            </Clause>
            <Clause index="02" title="License">
                <p>
                    Code is MIT licensed unless otherwise noted. You may audit, fork, patch. Brand names and logos are
                    excluded from the license.
                </p>
            </Clause>
            <Clause index="03" title="Acceptable use">
                <Bullets
                    items={[
                        'No abuse: bulk spam, fraud, harassment, or illegal content distribution.',
                        'No automated high-volume scraping of internal APIs beyond documented rate limits.',
                        'No attempt to de-anonymize other users or weaken crypto primitives.',
                    ]}
                />
            </Clause>
            <Clause index="04" title="Privacy alignment">
                <p>
                    Service is designed to minimize retained data. Review the Privacy page for specifics. If a term here
                    conflicts with that page, the stricter privacy interpretation governs.
                </p>
            </Clause>
            <Clause index="05" title="Availability & changes">
                <p>
                    Alpha: features may shift, be rate-limited, or withdrawn without notice. We&apos;ll aim for
                    changelog transparency through Git history.
                </p>
            </Clause>
            <Clause index="06" title="Disclaimer">
                <p>
                    Provided &quot;as is&quot; without warranties of any kind (express or implied). Use at your own
                    risk; verify cryptographic assumptions independently.
                </p>
            </Clause>
            <Clause index="07" title="Limitation of liability">
                <p>
                    To the maximum extent permitted by law we are not liable for indirect, incidental, special,
                    consequential, or exemplary damages arising from use or inability to use the service.
                </p>
            </Clause>
            <Clause index="08" title="Termination">
                <p>
                    We may throttle or block keys involved in abuse. You may stop using the service at any time;
                    deleting your local keys severs association.
                </p>
            </Clause>
            <Clause index="09" title="Governing law">
                <p>
                    Jurisdiction kept intentionally unspecified during alpha; disputes seek amicable resolution first.
                </p>
            </Clause>
            <Clause index="10" title="Updates">
                <p>
                    We may revise these Terms; material changes timestamped and committed publicly. Continued use after
                    changes = acceptance.
                </p>
            </Clause>

            <p className="mt-4 font-mono text-[11px] text-neutral-500">
                Questions:{' '}
                <a href="mailto:legal@1337.legal" className="text-orange-400 hover:text-orange-300">
                    legal@1337.legal
                </a>
                . Last updated {new Date().toISOString().split('T')[0]}.
            </p>
        </div>
    </PageShell>
);

export default Terms;
