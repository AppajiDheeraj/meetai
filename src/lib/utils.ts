import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import humanizeDuration from "humanize-duration"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number) {
    return humanizeDuration(seconds * 1000, {
        largest: 1,
        round: true,
        units: ["h", "m", "s"],
    });
};
