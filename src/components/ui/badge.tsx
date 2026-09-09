import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center justify-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:pointer-events-none transition-colors overflow-hidden',
    {
        variants: {
            variant: {
                default: 'chamfer-sm bg-orange-500 text-neutral-950',
                secondary: 'chamfer-sm bg-neutral-800 text-neutral-200',
                destructive: 'chamfer-sm bg-red-500 text-neutral-950',
                outline: 'border border-neutral-700 text-neutral-300',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'span';

    return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
