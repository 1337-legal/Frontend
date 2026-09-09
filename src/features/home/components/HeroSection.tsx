import { IsoShellStack, Marker } from '@Components/icons/Lattice';
import { Badge } from '@Components/ui/badge';
import { Button } from '@Components/ui/button';
import { ArrowRight, GitFork, Zap } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

export const HeroSection: React.FC = () => (
    <header className="lattice border-b border-neutral-800">
        <div className="mx-auto grid max-w-7xl items-start gap-16 px-6 py-20 lg:grid-cols-[minmax(0,1fr)_470px] lg:px-12 lg:py-24">
            <div className="flex flex-col items-start">
                <div className="mb-9 flex flex-wrap gap-2.5">
                    <Badge variant="outline" className="gap-2 border-orange-500 text-orange-300">
                        <Marker /> 1337 Powered
                    </Badge>
                    <Badge>Beta</Badge>
                </div>

                <h1 className="font-display text-4xl font-bold uppercase leading-[0.96] tracking-tight text-neutral-100 text-balance sm:text-5xl lg:text-[52px] xl:text-[68px]">
                    Private email
                    <br />
                    aliases
                </h1>
                <p className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.02em] text-orange-500 sm:text-2xl xl:text-3xl">
                    Simple. Encrypted. Yours.
                </p>

                <div className="mt-9 flex items-center">
                    <Marker size={8} />
                    <span aria-hidden className="block h-px w-26 bg-neutral-700" />
                </div>

                <p className="mt-8 max-w-xl text-base leading-relaxed text-neutral-400 text-pretty md:text-[17px]">
                    Create and use clean, disposable email aliases that keep your real address hidden — with no content
                    logs, no IP logs, and nothing to correlate you.
                </p>
                <p className="mt-5 max-w-xl text-[15px] italic leading-relaxed text-neutral-500">
                    Because sometimes you want to be sure the flaw is not your mail.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-3.5">
                    <Button asChild size="lg" className="group">
                        <Link to="/auth">
                            Get started{' '}
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <a href="https://github.com/1337-legal" target="_blank" rel="noopener noreferrer">
                            <GitFork className="mr-1 h-4 w-4" /> GitHub
                        </a>
                    </Button>
                    <Button asChild size="lg" variant="ghost">
                        <a href="https://api.1337.legal/swagger" target="_blank" rel="noopener noreferrer">
                            <Zap className="mr-1 h-4 w-4" /> Swagger
                        </a>
                    </Button>
                </div>

                <div className="mt-8 flex items-center gap-3">
                    <Marker size={6} />
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                        10,000+ users keep their address private
                    </span>
                </div>
            </div>

            <div className="hidden justify-center lg:flex">
                <IsoShellStack className="w-[446px]" />
            </div>
        </div>
    </header>
);

export default HeroSection;
