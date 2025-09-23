'use client';

import { type ClassValue, clsx} from "clsx";
import { twMerge } from "tailwind-merge";
import { ILocalizedProjectItem } from "@/app/sections/ProjectList/localizations";
import { TLocalizedItem } from "@/hooks/useLocalization";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatProjectLocalization(project: ILocalizedProjectItem) {
    const {image: _, hyperlink: __, _NAME: _N, _TYPE: _T, languages: _L , ...localizations} = project;
    const formatted: TLocalizedItem[] = [];

    for (const [key, value] of Object.entries(localizations)) {
        Object.entries(value).map(([_, v], idx) => {
            formatted[idx] = { ...formatted[idx], [key]: v }
        });
    }

    return formatted;
}