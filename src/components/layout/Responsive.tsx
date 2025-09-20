import useMediaQuery, { Queries } from "@/hooks/useMediaQuery";

export type ResponsiveProps = {
    breakpoint: string,
    onMatch?: React.ReactNode,
    onFail?: React.ReactNode
}

export { Queries };

export default function Responsive({
    breakpoint,
    onMatch,
    onFail
}: ResponsiveProps) {
    const isMatch = useMediaQuery(breakpoint);

    return isMatch ? onMatch : onFail;
}