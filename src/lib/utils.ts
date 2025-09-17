import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isOnion() {
    if (typeof document === 'undefined') return false;
    try {
        return document.location.hostname.endsWith('.onion');
    } catch {
        return false;
    }
}