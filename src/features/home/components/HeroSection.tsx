import { ArrowRight, Github, Zap } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import { Badge } from '@Components/ui/badge';
import { Button } from '@Components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@Components/ui/tooltip';

import HeroFlowField from './HeroFlowField';
import Spark from './Spark';

export const HeroSection: React.FC = () => (
    <header className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 pt-24 pb-16 md:pt-32">
        <HeroFlowField />
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-orange-400/50 bg-neutral-900/60 text-orange-300 backdrop-blur">
                <Spark className="mr-1" /> 1337 Powered
            </Badge>
            <Badge className="bg-orange-600/25 text-orange-200 hover:bg-orange-600/30">Beta</Badge>
        </div>
        <h1 className="text-balance font-cal text-4xl leading-tight tracking-tight md:text-6xl text-neutral-100 animate-fade-in-up">
            Private Email Aliases
            <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200 bg-clip-text font-semibold text-transparent">Simple. Encrypted. Yours.</span>
        </h1>
        <span aria-hidden className="block h-px w-24 bg-gradient-to-r from-orange-400/60 to-transparent animate-fade-in-up-delayed" />
        <p className="max-w-2xl text-lg text-neutral-400 md:text-xl animate-fade-in-up-delayed">
            Create and use clean, disposable email aliases that keep your real address hidden — with no content logs, no IP logs, and nothing to correlate you.
        </p>
        <p className="max-w-2xl text-base md:text-lg text-neutral-400/90 italic animate-fade-in-up-long">
            Because sometimes you want to be sure the flaw is not your mail.
        </p>
        <div className="flex flex-wrap gap-4">
            <Button size="lg" className="group bg-orange-500 text-neutral-900 hover:bg-orange-400 shadow-sm hover:shadow-md transition-shadow" asChild>
                <Link to="/auth">
                    Get Started <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-neutral-700 bg-neutral-900/40 backdrop-blur hover:bg-neutral-800/60" asChild>
                <a href="https://github.com/1337-legal" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" /> GitHub
                </a>
            </Button>
            <TooltipProvider delayDuration={150}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="lg" variant="ghost" className="text-neutral-400 hover:text-orange-300 hover:bg-transparent focus-visible:bg-transparent active:bg-transparent" asChild>
                            <Link to="/swagger">
                                <Zap className="mr-2 h-4 w-4" /> Swagger
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">Auto‑generated OpenAPI docs</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    </header>
);

export default HeroSection;
