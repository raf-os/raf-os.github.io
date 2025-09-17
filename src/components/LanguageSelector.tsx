import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AvailableLanguages } from "@/app/hooks/useLocalization";
import { cn } from "@/app/lib/utils";

const defaultLanguage = "en-us";

function FlagItem({ children, langcode }: { children?: React.ReactNode, langcode: keyof typeof AvailableLanguages }) {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();

    const _lang = searchParams.get("lang") || defaultLanguage;
    const selectedLanguage = Object.hasOwn(AvailableLanguages, _lang) ? _lang : defaultLanguage;

    const isSelected = selectedLanguage === langcode;

    const handleClick = () => {
        if (selectedLanguage === langcode) return;
        router.push(`${pathName}?lang=${langcode}`);
    }

    return (
        <button
            className={cn(
                "flex grow-1 shrink-1 md:grow-0 items-center justify-center md:w-20 md:h-12 rounded-lg text-4xl cursor-pointer select-none outline outline-offset-2",
                isSelected ? "bg-emerald-600/25 outline-emerald-400" : "bg-gray-800/75 outline-transparent"
            )}
            onClick={handleClick}
        >
            { children }
        </button>
    )
}

export default function LanguageSelector() {
    return (
        <div className="w-full flex gap-4 items-center justify-center py-2" role="list">
            <FlagItem langcode="en-us">🇺🇸</FlagItem>
            <FlagItem langcode="pt-br">🇧🇷</FlagItem>
        </div>
    )
}