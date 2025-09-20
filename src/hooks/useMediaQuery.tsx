import { useEffect, useState } from "react";

export const Queries = {
    IsMobile: "(width <= 48rem)",
    IsTablet: "(width >= 48rem)",
    IsDesktop: "(width >= 64rem)"
}

export default function useMediaQuery(query: string, onChange?: (match: boolean) => void) {
    const [ isMatch, setIsMatch ] = useState<boolean>(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        const listener = (mq: MediaQueryList | MediaQueryListEvent) => {
            const { matches } = mq;
            if (matches !== isMatch) {
                onChange?.(matches);
                setIsMatch(matches);
            }
        }

        listener(media);

        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [query, isMatch]);

    return isMatch;
}