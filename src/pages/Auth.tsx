import { ArrowDown, ArrowLeft, Download, ExternalLink, Github, Terminal } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import AuthNebulaScene from '@Features/auth/components/AuthNebulaScene';
import CodeBlock from '@Features/auth/components/CodeBlock';
import MnemonicForm from '@Features/auth/components/MnemonicForm';
import SectionCard from '@Features/auth/components/SectionCard';
import Backend from '@Services/BackendService';

const Auth: React.FC = () => {
    const [authedMnemonic, setAuthedMnemonic] = React.useState<string | null>(null);
    const onValidated = async (m: string) => {
        setAuthedMnemonic(m);
        try { await Backend.initWithMnemonic(m); } catch (e) { console.error(e); }
    };
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-neutral-950 text-neutral-100">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]">
                    <AuthNebulaScene />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0)_0%,rgba(10,10,10,0.45)_55%,rgba(0,0,0,0.88)_100%)]" />
            </div>

            <main className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-44 md:pt-32">
                <div className="mb-8 flex items-center gap-3">
                    <Link to="/" className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-neutral-400 transition hover:text-orange-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-500/40">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Home
                    </Link>
                    <span className="rounded border border-orange-400/40 bg-neutral-900/60 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-orange-300">Onboarding</span>
                </div>
                <div className="relative pb-14">
                    <MnemonicForm onValidated={onValidated} />
                    {authedMnemonic && (
                        <div className="mt-8">
                            <Link to="/account" className="inline-flex items-center rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-neutral-900 shadow hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50">
                                Account
                            </Link>
                        </div>
                    )}
                    <button
                        onClick={() => document.getElementById('alternatives')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className="group absolute left-1/2 bottom-2 -translate-x-1/2 inline-flex flex-col items-center text-neutral-600 hover:text-orange-300 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-500/40"
                        aria-label="Scroll to alternatives"
                    >
                        <span className="mb-1 text-[10px] tracking-wider font-medium uppercase text-neutral-500 group-hover:text-orange-300">Explore Tools</span>
                        <ArrowDown className="h-5 w-5 animate-bounce" />
                    </button>
                </div>

                <div id="alternatives" className="mb-10 scroll-mt-24">
                    <h2 className="font-semibold tracking-tight text-2xl mb-2">Alternatives & Power Tools</h2>
                    <p className="text-sm text-neutral-400 max-w-2xl">Prefer in‑context flows or scripting? Use the browser extension or CLI after authenticating above.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3 mb-16">
                    <SectionCard
                        title="Web App"
                        description="Manage aliases, rotate keys, inspect activity — all in-browser."
                        icon={<Github className="h-5 w-5" />}
                    >
                        <Link to="/privacy" className="bg-orange-500 text-neutral-900 hover:bg-orange-400 rounded-md px-3 py-1.5 text-xs font-semibold">Privacy</Link>
                        <Link to="/swagger" className="text-neutral-400 hover:text-orange-300 text-xs px-2 py-1 rounded-md transition">API</Link>
                    </SectionCard>

                    <SectionCard
                        title="Browser Extension"
                        description="In‑context alias generation, autofill, sealed requests."
                        icon={<Download className="h-5 w-5" />}
                    >
                        <a href="https://chromewebstore.google.com/detail/placeholder" target="_blank" rel="noopener noreferrer" className="bg-orange-500 text-neutral-900 hover:bg-orange-400 rounded-md px-3 py-1.5 text-xs font-semibold">Chrome <ExternalLink className="inline ml-1 h-3 w-3" /></a>
                        <a href="https://addons.mozilla.org/en-US/firefox/addon/placeholder" target="_blank" rel="noopener noreferrer" className="border border-neutral-700 bg-neutral-800/60 hover:border-orange-500/50 hover:text-orange-200 rounded-md px-3 py-1.5 text-xs font-semibold transition">Firefox <ExternalLink className="inline ml-1 h-3 w-3" /></a>
                        <a href="https://github.com/1337-legal/extension" target="_blank" rel="noopener noreferrer" className="border border-neutral-700 bg-neutral-800/60 hover:border-orange-500/50 hover:text-orange-200 rounded-md px-3 py-1.5 text-xs font-semibold transition">Repo <Github className="inline ml-1 h-3 w-3" /></a>
                    </SectionCard>

                    <SectionCard
                        title="CLI / Programmatic"
                        description="Scriptable auth + alias ops with Blindflare envelopes."
                        icon={<Terminal className="h-5 w-5" />}
                    >
                        <Link to="/swagger" className="bg-orange-500 text-neutral-900 hover:bg-orange-400 rounded-md px-3 py-1.5 text-xs font-semibold">OpenAPI</Link>
                        <a href="https://github.com/1337-legal/cli" target="_blank" rel="noopener noreferrer" className="border border-neutral-700 bg-neutral-800/60 hover:border-orange-500/50 hover:text-orange-200 rounded-md px-3 py-1.5 text-xs font-semibold transition">Repo <Github className="inline ml-1 h-3 w-3" /></a>
                    </SectionCard>
                </div>

                <section className="mt-14 space-y-10">
                    <div>
                        <h2 className="mb-3 font-semibold text-neutral-200">CLI Quickstart</h2>
                        <CodeBlock>
                            {`# Install (placeholder until published)
npm install -g @1337-legal/cli

# 1. Initialize (generates keypair, performs Blindflare HELLO + AUTH)
1337 init

# 2. Create an alias
1337 alias create
# => echo-rain-gesture@1337.legal

# 3. List aliases
1337 alias ls

# 4. Raw API (encrypted TX)
1337 request PUT /api/v1/alias --body '{}'`}
                        </CodeBlock>
                    </div>

                    <div>
                        <h2 className="mb-3 font-semibold text-neutral-200">API Flow (Summary)</h2>
                        <ol className="list-decimal space-y-2 pl-5 text-sm text-neutral-400">
                            <li>Client performs /blindflare/hello to negotiate context.</li>
                            <li>Auth intent returns JWT + wrapped session key.</li>
                            <li>Subsequent requests encrypted with session key.</li>
                            <li>Alias creation: PUT /api/v1/alias → returns generated alias.</li>
                        </ol>
                    </div>

                    <div className="rounded-lg border border-neutral-800/70 bg-neutral-900/40 p-5 text-sm text-neutral-400">
                        <strong className="mb-1 block text-xs font-semibold tracking-wide text-orange-300">OPEN SOURCE GUARANTEE</strong>
                        <p className="text-neutral-300">Extension + CLI share the same Blindflare primitives (no proprietary obfuscation). No plaintext alias requests or content logs — verify in the repos.</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-500">
                            <a href="https://github.com/1337-legal/command-line-tool" target="_blank" rel="noopener noreferrer" className="rounded bg-neutral-800/60 px-2 py-1 transition hover:bg-neutral-800 hover:text-orange-300">cli repo</a>
                            <a href="https://github.com/1337-legal/extension" target="_blank" rel="noopener noreferrer" className="rounded bg-neutral-800/60 px-2 py-1 transition hover:bg-neutral-800 hover:text-orange-300">extension repo</a>
                            <a href="https://github.com/1337-legal" target="_blank" rel="noopener noreferrer" className="rounded bg-neutral-800/60 px-2 py-1 transition hover:bg-neutral-800 hover:text-orange-300">org</a>
                        </div>
                    </div>
                </section>
            </main>
            <div className="pointer-events-none fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
    );
};

export default Auth;