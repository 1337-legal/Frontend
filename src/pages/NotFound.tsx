import { Marker } from '@Components/icons/Lattice';
import { Button } from '@Components/ui/button';
import SiteFooter from '@Features/shared/components/SiteFooter';
import SiteNav from '@Features/shared/components/SiteNav';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

const NotFound: React.FC = () => (
    <div className="flex min-h-screen w-full flex-col bg-neutral-950 text-neutral-100">
        <SiteNav />

        <main className="lattice flex flex-grow items-center">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-start px-6 py-24 lg:px-12">
                <div className="mb-8 flex items-center gap-3 border border-orange-500 px-3 py-2">
                    <Marker />
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                        404 — routing error
                    </span>
                </div>

                <h1 className="font-display text-5xl font-bold uppercase leading-[0.96] tracking-tight text-neutral-100 md:text-6xl">
                    Page not
                    <br />
                    found
                </h1>

                <div className="mt-8 flex items-center">
                    <Marker size={8} />
                    <span aria-hidden className="block h-px w-26 bg-neutral-700" />
                </div>

                <p className="mt-8 max-w-xl text-base leading-relaxed text-neutral-400 text-pretty">
                    The page you are looking for does not exist. If you believe this is an issue, return home or open an
                    issue in our public repositories.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                    <Button asChild size="lg">
                        <Link to="/">
                            <ArrowLeft className="mr-1 h-4 w-4" /> Home
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link to="/auth">Authenticate</Link>
                    </Button>
                    <Button asChild size="lg" variant="ghost">
                        <a href="https://github.com/1337-legal" target="_blank" rel="noopener noreferrer">
                            GitHub org
                        </a>
                    </Button>
                </div>
            </div>
        </main>

        <SiteFooter />
    </div>
);

export default NotFound;
