import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { OnionIcon } from '@Components/icons/Onion';
import { Button } from '@Components/ui/button';

const OnionInactive = () => {
    if (!import.meta.env?.VITE_ONION_URL) {
        return
    }

    return (
        <TooltipProvider delayDuration={200}>
            <div className="fixed top-3 right-3 z-50 animate-fade-in-up">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            onClick={() => window.open(import.meta.env?.VITE_ONION_URL, '_blank', 'noopener')}
                            aria-label="Access via onion edge"
                            className="group relative flex items-center gap-2 rounded-full px-4 py-1.5 pr-5 text-[11px] sm:text-xs font-medium tracking-wide
                                               text-neutral-200 bg-neutral-800/60 backdrop-blur-md border border-fuchsia-400/25
                                               shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_10px_-2px_rgba(217,70,239,0.35)]
                                               hover:text-white hover:border-fuchsia-300/50 transition-colors duration-300 cursor-pointer"
                        >
                            <span
                                aria-hidden
                                className="relative grid place-items-center h-7 w-7 rounded-full
                                                   bg-gradient-to-br from-fuchsia-500/25 to-amber-400/25
                                                   border border-fuchsia-300/40 shadow-inner shadow-fuchsia-100/10"
                            >
                                <span className="text-lg leading-none"><OnionIcon className='text-amber-300' /></span>
                            </span>
                            <span className="whitespace-nowrap flex items-center gap-1">
                                <span className="hidden sm:inline leading-none">Use onion edge</span>
                                <span className="sm:hidden leading-none">Onion</span>
                                <span className='items-center justify-center ml-1'>
                                    <span
                                        className="hidden sm:inline-flex h-1.5 w-1.5 shrink-0 -translate-y-[1px] rounded-full bg-fuchsia-400/90 shadow-[0_0_6px_2px_rgba(217,70,239,0.55)]"
                                        aria-hidden
                                    />
                                </span>
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-[10px] tracking-wide text-fuchsia-100">
                        Click to open the privacy-preserving onion version
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}

export default OnionInactive