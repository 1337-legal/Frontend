import { ArrowLeft, Download, ExternalLink, Github, Terminal } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import { Badge } from '@Components/ui/badge';
import { Button } from '@Components/ui/button';

const SectionCard: React.FC<React.PropsWithChildren<{ title: string; description: string; icon?: React.ReactNode }>> = ({ title, description, icon, children }) => (
    <div className="group relative flex flex-col gap-4 rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-6 backdrop-blur transition hover:border-orange-500/40 hover:bg-neutral-900/60">
        <div className="flex items-start gap-3">
            <div className="mt-1 text-orange-300">{icon}</div>
            <div>
                <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>
                <p className="text-sm text-neutral-400">{description}</p>
            </div>
        </div>
        <div className="flex flex-wrap gap-3">
            {children}
        </div>
    </div>
);

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="w-full overflow-x-auto rounded-md border border-neutral-800 bg-neutral-950/60 p-4 text-sm leading-relaxed text-neutral-300">
        <code>{children}</code>
    </pre>
);

const GetStarted: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-neutral-100">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-[-20%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.14),transparent_65%)] blur-3xl" />
            </div>

            <main className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-28 md:pt-32">
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-orange-300 hover:bg-transparent focus-visible:bg-transparent active:bg-transparent" asChild>
                            <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
                        </Button>
                        <Badge variant="outline" className="border-orange-400/40 text-orange-300">Get Started</Badge>
                    </div>
                </div>

                <header className="mb-12 space-y-4">
                    <h1 className="font-cal text-4xl tracking-tight md:text-5xl">
                        Choose your entry point
                        <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200 bg-clip-text font-semibold text-transparent">
                            Browser Extension or CLI
                        </span>
                    </h1>
                    <p className="max-w-2xl text-lg text-neutral-400">
                        Use disposable, privacy‑preserving aliases anywhere. Install the extension for in‑browser generation & autofill,
                        or bootstrap programmatic access via the CLI & API.
                    </p>
                </header>

                {/* Open Source Callout */}
                <div className="mb-12 rounded-lg border border-orange-500/40 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-amber-300/5 p-5 shadow-[0_0_0_1px_rgba(251,146,60,0.15),0_4px_24px_-6px_rgba(251,146,60,0.25)]">
                    <p className="flex items-start gap-3 text-sm text-neutral-300">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900/70 ring-1 ring-orange-500/30">
                            <Github className="h-3.5 w-3.5 text-orange-300" />
                        </span>
                        <span>
                            <strong className="text-orange-300">Open Source (Alpha):</strong> Both the browser extension and CLI are MIT licensed. Audit the cryptography, file issues, or contribute code. <span className="ml-1 inline-flex items-center rounded bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-orange-300 ring-1 ring-orange-500/30">ALPHA</span><br />
                            Not yet published to web stores or npm registry — for now you must clone & build both the extension and CLI from source.
                            <br />Extension: <code className="rounded bg-neutral-900/60 px-1.5 py-0.5 text-[11px] text-orange-200">git clone https://github.com/1337-legal/extension && pnpm install && pnpm build</code>
                            <br />CLI: <code className="rounded bg-neutral-900/60 px-1.5 py-0.5 text-[11px] text-orange-200">git clone https://github.com/1337-legal/cli && pnpm install && pnpm build</code>
                            <br />Browse all repositories under the <a href="https://github.com/1337-legal" target="_blank" rel="noopener noreferrer" className="text-orange-300 underline decoration-dotted underline-offset-2 hover:text-orange-200">1337-legal GitHub org</a>.
                        </span>
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <SectionCard
                        title="Browser Extension"
                        description="Fast in‑context alias generation, autofill, and Blindflare‑sealed requests."
                        icon={<Download className="h-5 w-5" />}
                    >
                        <Button size="sm" className="bg-orange-500 text-neutral-900 hover:bg-orange-400" asChild>
                            {/* TODO: Replace with published Chrome Web Store URL */}
                            <a href="https://chromewebstore.google.com/detail/placeholder" target="_blank" rel="noopener noreferrer">
                                Chrome <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </Button>
                        <Button size="sm" variant="outline" className="border-neutral-700 bg-neutral-800/60 text-neutral-300 hover:border-orange-500/50 hover:text-orange-200 hover:bg-neutral-800" asChild>
                            {/* TODO: Replace with published AMO URL */}
                            <a href="https://addons.mozilla.org/en-US/firefox/addon/placeholder" target="_blank" rel="noopener noreferrer">
                                Firefox <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </Button>
                        <Button size="sm" variant="outline" className="border-neutral-700 bg-neutral-800/60 text-neutral-300 hover:border-orange-500/50 hover:text-orange-200 hover:bg-neutral-800" asChild>
                            <a href="https://github.com/1337-legal/extension" target="_blank" rel="noopener noreferrer">
                                Repo <Github className="ml-1 h-3 w-3" />
                            </a>
                        </Button>
                        <Button size="sm" variant="ghost" className="text-neutral-400 hover:text-orange-300 hover:bg-transparent focus-visible:bg-transparent active:bg-transparent" asChild>
                            <Link to="/swagger">API Docs</Link>
                        </Button>
                    </SectionCard>

                    <SectionCard
                        title="CLI / Programmatic"
                        description="Scriptable flows: handshake, auth, alias generation via Blindflare envelope."
                        icon={<Terminal className="h-5 w-5" />}
                    >
                        <Button size="sm" className="bg-orange-500 text-neutral-900 hover:bg-orange-400" asChild>
                            <Link to="/swagger">OpenAPI</Link>
                        </Button>
                        <Button size="sm" variant="outline" className="border-neutral-700 bg-neutral-800/60 text-neutral-300 hover:border-orange-500/50 hover:text-orange-200 hover:bg-neutral-800" asChild>
                            <a href="https://github.com/1337-legal/cli" target="_blank" rel="noopener noreferrer">
                                Repo <Github className="ml-1 h-3 w-3" />
                            </a>
                        </Button>
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
                            <li>Client performs Blindflare /blindflare/hello to negotiate context.</li>
                            <li>AUTH intent (public key + signature) returns JWT + wrapped session key.</li>
                            <li>Subsequent requests encrypted (TX envelope) with session key.</li>
                            <li>Alias creation: PUT /api/v1/alias → returns generated alias.</li>
                        </ol>
                    </div>

                    <div className="rounded-lg border border-neutral-800/70 bg-neutral-900/40 p-5 text-sm text-neutral-400">
                        <strong className="mb-1 block text-xs font-semibold tracking-wide text-orange-300">OPEN SOURCE GUARANTEE</strong>
                        <p className="text-neutral-300">
                            Extension + CLI are both open‑source (ALPHA build-from-source only) and share the same Blindflare primitives (no proprietary obfuscation). No plaintext alias requests or content logs are emitted — verify by reading the code.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-500">
                            <a href="https://github.com/1337-legal/command-line-tool" target="_blank" rel="noopener noreferrer" className="rounded bg-neutral-800/60 px-2 py-1 transition hover:bg-neutral-800 hover:text-orange-300">cli repo</a>
                            <a href="https://github.com/1337-legal/extension" target="_blank" rel="noopener noreferrer" className="rounded bg-neutral-800/60 px-2 py-1 transition hover:bg-neutral-800 hover:text-orange-300">extension repo</a>
                            <a href="https://github.com/1337-legal" target="_blank" rel="noopener noreferrer" className="rounded bg-neutral-800/60 px-2 py-1 transition hover:bg-neutral-800 hover:text-orange-300">org</a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default GetStarted;