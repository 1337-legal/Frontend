import { Button } from '@Components/ui/button';
import { Panel } from '@Components/ui/panel';
import PageShell from '@Features/shared/components/PageShell';
import React from 'react';

import licenseText from '../../LICENSE?raw';

const License: React.FC = () => (
    <PageShell
        label="License"
        title="Project license"
        intro="This page displays the exact contents of the repository LICENSE file for transparency."
    >
        <div className="flex flex-col gap-6">
            <Panel className="p-6">
                <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-neutral-300">
                    {licenseText}
                </pre>
            </Panel>
            <Button asChild variant="outline" className="w-fit">
                <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(licenseText)}`} download="LICENSE">
                    Download
                </a>
            </Button>
        </div>
    </PageShell>
);

export default License;
