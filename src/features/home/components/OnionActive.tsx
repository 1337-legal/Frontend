import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@Components/ui/button';

const OnionActive = () => {
    return (
        <TooltipProvider delayDuration={200}>
            <div className="fixed top-3 right-3 z-50 animate-fade-in-up">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            role="status"
                            aria-label="Onion edge detected"
                            aria-disabled="true"
                            className="group relative flex items-center gap-2 rounded-full px-4 py-1.5 pr-5 text-[11px] sm:text-xs font-medium tracking-wide text-amber-50/90
                                               bg-neutral-900/55 backdrop-blur-md border border-amber-300/20
                                               shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_12px_-2px_rgba(251,146,60,0.25)]
                                               hover:border-amber-300/35 hover:text-amber-50
                                               transition-colors duration-300
                                               animate-[onionPulse_7.2s_ease-in-out_infinite]"
                        >
                            <span aria-hidden
                                className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                                     bg-[linear-gradient(120deg,rgba(251,146,60,0.35),rgba(217,70,239,0.35),rgba(251,146,60,0.35))] bg-[length:200%_100%] animate-[pulse_8s_ease_infinite]" />
                            <span
                                aria-hidden
                                className="relative grid place-items-center h-7 w-7 rounded-full
                                                   bg-gradient-to-br from-amber-400/25 to-fuchsia-500/25
                                                   border border-amber-300/35 shadow-inner shadow-amber-100/10
                                                   animate-[onionGlow_6s_ease-in-out_infinite]"
                            >
                                <span className="text-lg leading-none drop-shadow">🧅</span>
                                <span className="absolute inset-0 rounded-full border border-amber-300/25 animate-[spin_14s_linear_infinite]" />
                                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                                         bg-gradient-to-tr from-fuchsia-500/30 to-amber-400/30 mix-blend-screen" />
                            </span>
                            <span className="whitespace-nowrap flex items-center gap-1">
                                <span className="hidden sm:inline leading-none">Onion edge detected</span>
                                <span className="sm:hidden leading-none">Onion edge</span>
                                <span className='items-center justify-center ml-1'>
                                    <span
                                        className="hidden sm:inline-flex h-1.5 w-1.5 shrink-0 -translate-y-[1px] rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(16,185,129,0.55)] animate-pulse"
                                        aria-hidden
                                    /></span>
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-[10px] tracking-wide text-amber-100">
                        Routed via privacy-preserving onion edge
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}

export default OnionActive