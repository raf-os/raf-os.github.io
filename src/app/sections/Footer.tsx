'use client';

import { Mail, Github, type LucideIcon } from "lucide-react";

type TUserLink = {
    label: string,
    href: string,
    Icon?: LucideIcon,
}

const userLinks: TUserLink[] = [{
    label: "Email",
    href: "mailto:rafael.aguiar93@outlook.com",
    Icon: Mail
}, {
    label: "Github",
    href: "https://github.com/raf-os",
    Icon: Github
}]

export default function Footer() {
    return (
        <footer
            className="flex flex-col py-2 items-center justify-center bg-neutral-950 text-neutral-50 min-h-24"
        >
            <div
                className="flex w-full lg:w-[1024px]"
            >
                <div className="flex w-1/2 text-sm items-center">
                    Rafael Aguiar de Oliveira Salomão, 2025.
                </div>

                <div className="w-1/2 flex flex-col gap-1">
                    { userLinks.map((Link, idx) => (
                        <div key={`userLink(id::${idx})`} className="flex items-center gap-2 grow-0 shrink-0">
                            { Link.Icon && <Link.Icon />}<UserLink href={Link.href}>{Link.label}</UserLink>
                        </div>
                    )) }
                </div>
            </div>
        </footer>
    )
}

function UserLink({href, children, ...rest}: React.ComponentPropsWithRef<'a'>) {
    return (
        <a
            href={href}
            className="text-emerald-400 font-medium hover:text-emerald-600"
            {...rest}
        >
            {children}
        </a>
    )
}