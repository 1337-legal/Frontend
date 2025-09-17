import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import AuthNebulaScene from '@Features/auth/components/AuthNebulaScene';

const NotFound: React.FC = () => {

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-neutral-100">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]">
                    <AuthNebulaScene />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0)_0%,rgba(10,10,10,0.55)_50%,rgba(0,0,0,0.9)_100%)]" />
            </div>
            <main className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-36 text-center md:py-48">
                <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-neutral-900/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-orange-300">
                    <span>404</span>
                    <span className="h-1 w-1 rounded-full bg-orange-400/60" />
                    <span>routing error</span>
                </div>
                <h1 className="mb-4 pb-2 overflow-visible leading-[1.2] bg-gradient-to-br from-orange-200 via-orange-400 to-rose-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">Page Not Found</h1>
                <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-neutral-400">
                    The page you are looking for does not exist. If you believe this is an issue, please return home or open an issue in our public repositories.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                    <Link to="/" className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 font-semibold text-neutral-900 shadow transition hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Home
                    </Link>
                    <Link to="/auth" className="rounded-md border border-neutral-700 bg-neutral-900/60 px-4 py-2 font-semibold text-neutral-300 transition hover:border-orange-500/50 hover:text-orange-200">Authenticate</Link>
                    <a href="https://github.com/1337-legal" target="_blank" rel="noopener noreferrer" className="rounded-md border border-neutral-700 bg-neutral-900/60 px-4 py-2 font-semibold text-neutral-300 transition hover:border-orange-500/50 hover:text-orange-200">GitHub Org</a>
                </div>
            </main>
            <div className="pointer-events-none fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
    );
};

export default NotFound;