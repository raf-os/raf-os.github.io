'use client';

import { useSearchParams } from "next/navigation";
import { ArrayOrSelf } from "@lib/typeUtils";

export const AvailableLanguages = {
    'pt-br': "Portugês - Brasil",
    'en-us': "English",
}

export type TLocalizedItem = {
    [lang in keyof Omit<typeof AvailableLanguages, 'default'>]: string;
}

export function useLocalization<T extends TLocalizedItem>(localizedList: T) : string;
export function useLocalization<T extends TLocalizedItem>(localizedList: T[]) : string[];
export function useLocalization(localizedList: ArrayOrSelf<TLocalizedItem>): string | string[] {
    const searchParams = useSearchParams();
    const _lang = searchParams.get("lang") || "en-us";
    const language = Object.hasOwn(AvailableLanguages, _lang) ? _lang as keyof typeof AvailableLanguages : "en-us";

    const parseItem = (item: TLocalizedItem) => {
        return item[language] as string;
    }

    if (Array.isArray(localizedList)) {
        return localizedList.map(item => parseItem(item)) as string[];
    } else {
        return parseItem(localizedList);
    }
}