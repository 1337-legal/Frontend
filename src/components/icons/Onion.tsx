import { Icon } from 'lucide-react';

import { onion } from '@lucide/lab';

type Props = {
    className?: string;
};

export const OnionIcon = ({ className }: Props) => (
    <Icon iconNode={onion} className={className} />
);