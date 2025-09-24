import { ArrowLeft, Scale } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import { Badge } from '@Components/ui/badge';
import { Button } from '@Components/ui/button';
import SiteFooter from '@Features/shared/components/SiteFooter';

const Terms: React.FC = () => {
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
                    <Badge variant="outline" className="border-orange-400/40 text-orange-300">Terms</Badge>
                </div>
                <header className="mb-10 space-y-3">
                    <h1 className="font-cal text-4xl leading-tight md:text-5xl">Terms of Use <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200 bg-clip-text font-semibold text-transparent">Plain & Minimal</span></h1>
                    <p className="max-w-2xl text-neutral-400 text-lg">Alpha software provided "as is" — focus is privacy, correctness, and cryptographic transparency. These terms are short so you can actually read them.</p>
                </header>
                <section className="space-y-8 text-sm leading-relaxed text-neutral-300">
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 flex items-center gap-2 text-neutral-200 font-semibold text-base"><Scale className="h-4 w-4 text-orange-300" /> 1. Acceptance</h2>
                        <p className="text-neutral-400">By generating an alias, using the extension, CLI, or API you agree to these Terms. If you disagree, do not use the service.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">2. License</h2>
                        <p className="text-neutral-400">Code is MIT licensed unless otherwise noted. You may audit, fork, patch. Brand names and logos are excluded from the license.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">3. Acceptable Use</h2>
                        <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                            <li>No abuse: bulk spam, fraud, harassment, or illegal content distribution.</li>
                            <li>No automated high‑volume scraping of internal APIs beyond documented rate limits.</li>
                            <li>No attempt to de‑anonymize other users or weaken crypto primitives.</li>
                        </ul>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">4. Privacy Alignment</h2>
                        <p className="text-neutral-400">Service is designed to minimize retained data. Review the Privacy page for specifics. If a term here conflicts with that page, the stricter privacy interpretation governs.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">5. Availability & Changes</h2>
                        <p className="text-neutral-400">Alpha: features may shift, be rate‑limited, or withdrawn without notice. We'll aim for changelog transparency through Git history.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">6. Disclaimer</h2>
                        <p className="text-neutral-400">Provided "as is" without warranties of any kind (express or implied). Use at your own risk; verify cryptographic assumptions independently.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">7. Limitation of Liability</h2>
                        <p className="text-neutral-400">To the maximum extent permitted by law we are not liable for indirect, incidental, special, consequential, or exemplary damages arising from use or inability to use the service.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">8. Termination</h2>
                        <p className="text-neutral-400">We may throttle or block keys involved in abuse. You may stop using the service at any time; deleting your local keys severs association.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">9. Governing Law</h2>
                        <p className="text-neutral-400">Jurisdiction kept intentionally unspecified during alpha; disputes seek amicable resolution first.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-5">
                        <h2 className="mb-2 text-neutral-200 font-semibold text-base">10. Updates</h2>
                        <p className="text-neutral-400">We may revise these Terms; material changes timestamped and committed publicly. Continued use after changes = acceptance.</p>
                    </div>
                    <p className="text-xs text-neutral-500">Questions: <a href="mailto:legal@1337.legal" className="text-orange-300 hover:underline">legal@1337.legal</a>. Last updated {new Date().toISOString().split('T')[0]}.</p>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
};

export default Terms;
