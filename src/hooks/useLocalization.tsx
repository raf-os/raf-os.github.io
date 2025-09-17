'use client';

import { useSearchParams } from "next/navigation";
import { ArrayOrSelf } from "@lib/typeUtils";
import { cn } from "@lib/utils";
import Slot from "@/components/Slot";

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
        // Yes, I know this is jank. It does mean I get to have slightly less redundant code, and can just use a variable name instead of localize['variable'].
        return localizedList.map(item => parseItem(item)) as string[];
    } else {
        return parseItem(localizedList);
    }
}

export function mergeMultiline(...lines: string[]) {
    return lines.join('\n');
}

export function Localized({ children, className, asChild }: { children?: React.ReactNode, className?: string, asChild?: boolean }) {
    const simpleComponent = (asChild!==true && typeof children==="string");
    const Comp = asChild ? Slot : "div";
    return simpleComponent? (
        <>
            {children.split('\n').map((paragraph, idx) => <p key={`__localized-${idx}`}>{paragraph}</p>)}
        </>
    ):
    (
        <Comp
            className={cn(
                "whitespace-pre-line",
                className
            )}
        >
            { children }
        </Comp>
    )
}