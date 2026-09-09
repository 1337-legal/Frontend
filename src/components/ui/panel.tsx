import * as React from 'react';

import { cn } from '@/lib/utils';

const frameTone = {
    default: 'bg-neutral-800',
    accent: 'bg-orange-500',
    danger: 'bg-red-400',
    muted: 'bg-neutral-800/60',
} as const;

type PanelProps = React.ComponentProps<'div'> & {
    tone?: keyof typeof frameTone;
    size?: 'lg' | 'md';
    ticks?: boolean;
    frameClassName?: string;
};

function Panel({
    className,
    frameClassName,
    tone = 'default',
    size = 'lg',
    ticks = false,
    children,
    ...props
}: PanelProps) {
    const outer = size === 'lg' ? 'chamfer' : 'chamfer-md';
    const inner = size === 'lg' ? 'chamfer-in' : 'chamfer-md-in';

    return (
        <div className={cn(outer, 'p-px', frameTone[tone], frameClassName)} {...props}>
            <div className={cn(inner, ticks && 'ticks', 'bg-[#121212]', className)}>{children}</div>
        </div>
    );
}

export { Panel };
