import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "chamfer-md inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-[0.14em] transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 aria-invalid:ring-2 aria-invalid:ring-destructive/40",
    {
        variants: {
            variant: {
                default: 'bg-orange-500 text-neutral-950 hover:bg-orange-400',
                destructive: 'bg-red-500 text-neutral-950 hover:bg-red-400 focus-visible:ring-red-500/50',
                outline: 'bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700/80 hover:text-neutral-100',
                secondary: 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700',
                ghost: 'text-neutral-400 hover:text-orange-300',
                link: 'text-orange-400 underline-offset-4 hover:underline hover:text-orange-300',
            },
            size: {
                default: 'h-10 px-5 has-[>svg]:px-4',
                sm: 'h-8 px-3 has-[>svg]:px-2.5 text-[11px]',
                lg: 'h-12 px-7 has-[>svg]:px-6 text-[13px]',
                icon: 'size-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : 'button';

    return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
