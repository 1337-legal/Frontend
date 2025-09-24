import { ArrowLeft, ScrollText } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import { Badge } from '@Components/ui/badge';
import { Button } from '@Components/ui/button';
import SiteFooter from '@Features/shared/components/SiteFooter';

import licenseText from '../../LICENSE?raw';

const License: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-neutral-100">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-[-25%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.14),transparent_65%)] blur-3xl" />
            </div>
            <main className="relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-32 md:pt-32">
                <div className="mb-10 flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-orange-300 hover:bg-transparent" asChild>
                        <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
                    </Button>
                    <Badge variant="outline" className="border-orange-400/40 text-orange-300">License</Badge>
                </div>

                <header className="mb-6 space-y-2">
                    <h1 className="font-cal text-3xl leading-tight md:text-4xl flex items-center gap-2">
                        <ScrollText className="h-7 w-7 text-orange-300" />
                        Project License
                    </h1>
                    <p className="text-neutral-400">This page displays the exact contents of the repository LICENSE file for transparency.</p>
                </header>

                <section className="space-y-4">
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-neutral-200">
                            {licenseText}
                        </pre>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <Button asChild variant="secondary" className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700">
                            <a
                                href={`data:text/plain;charset=utf-8,${encodeURIComponent(licenseText)}`}
                                download="LICENSE"
                            >
                                Download
                            </a>
                        </Button>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
};

export default License;
