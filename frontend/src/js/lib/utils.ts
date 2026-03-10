import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(url1: string, url2: string): boolean {
    return url1 === url2;
}

export function resolveUrl(url: string): string {
    return url;
}
