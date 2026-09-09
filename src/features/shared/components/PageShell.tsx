import { Marker } from '@Components/icons/Lattice';
import { Badge } from '@Components/ui/badge';
import { Button } from '@Components/ui/button';
import SiteFooter from '@Features/shared/components/SiteFooter';
import SiteNav from '@Features/shared/components/SiteNav';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

type Props = {
    label: string;
    title: string;
    accent?: string;
    intro?: string;
    children: React.ReactNode;
};

export const PageShell: React.FC<Props> = ({ label, title, accent, intro, children }) => (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
        <SiteNav />

        <header className="lattice border-b border-neutral-800">
            <div className="mx-auto flex max-w-5xl flex-col items-start px-6 py-16 lg:px-12">
                <Button variant="ghost" size="sm" className="mb-8 px-0" asChild>
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
                    </Link>
                </Button>

                <Badge variant="outline" className="mb-8 gap-2 border-orange-500 text-orange-300">
                    <Marker /> {label}
                </Badge>

                <h1 className="font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight text-neutral-100 text-balance md:text-5xl">
                    {title}
                </h1>
                {accent && (
                    <p className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.03em] text-orange-500 md:text-2xl">
                        {accent}
                    </p>
                )}

                <div className="mt-8 flex items-center">
                    <Marker size={8} />
                    <span aria-hidden className="block h-px w-26 bg-neutral-700" />
                </div>

                {intro && (
                    <p className="mt-8 max-w-2xl text-base leading-relaxed text-neutral-400 text-pretty">{intro}</p>
                )}
            </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-16 lg:px-12">{children}</main>

        <SiteFooter />
    </div>
);

export const Clause: React.FC<{ index?: string; title: string; children: React.ReactNode }> = ({
    index,
    title,
    children,
}) => (
    <section className="border border-neutral-800 bg-[#0d0d0d] p-6">
        <div className="mb-3 flex items-center gap-3">
            {index && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#1c1c1c] font-mono text-[10px] font-semibold text-orange-300">
                    {index}
                </span>
            )}
            <h2 className="font-display text-lg font-semibold uppercase tracking-[0.04em] text-neutral-100">{title}</h2>
        </div>
        <div className="flex flex-col gap-2.5 text-sm leading-relaxed text-neutral-400">{children}</div>
    </section>
);

export const Bullets: React.FC<{ items: string[] }> = ({ items }) => (
    <ul className="flex flex-col gap-2.5">
        {items.map((i) => (
            <li key={i} className="flex items-start gap-3">
                <Marker size={5} className="mt-[7px] bg-orange-500" />
                <span>{i}</span>
            </li>
        ))}
    </ul>
);

export default PageShell;
