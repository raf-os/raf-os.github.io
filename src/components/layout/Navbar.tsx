'use client';

import { cn } from "@/app/lib/utils";
import DialogManager from "@/components/singletons/DialogManager";
import { useState, useLayoutEffect, useRef } from "react";

import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import Link from "next/link";

const GITHUB_LINK = "https://github.com/raf-os";
const EMAIL_ADDR = "mailto:rafael.aguiar93@outlook.com";

const ContactDialogContent = {
    title: "Contact info",
    message: (
        <>
            <p>Github: <a href={GITHUB_LINK} target="_blank">github.com/raf-os</a></p>
            <p>E-mail: <a href={`mailto:${EMAIL_ADDR}`}>rafael.aguiar93@outlook.com</a></p>
        </>
    )
}

export default function Navbar() {
    return (
        <div
            className="flex justify-center fixed z-10 top-0 w-full h-12 bg-gray-800 border-b border-b-gray-900 shadow-xl"
        >
            <div
                className="relative flex justify-between w-full h-full px-4 md:px-0 md:w-[900px]"
            >
                <div
                    className="flex h-full self-start items-center"
                >
                    <Link href="/" className="font-bold">
                        raf-os.github.io
                    </Link>
                </div>

                <NavlinkCollection>
                    <Navlink>
                        <a href={GITHUB_LINK} target="_blank">Github page</a>
                    </Navlink>
                    <Navlink onClick={() => DialogManager.showMessage(ContactDialogContent)}>
                        Contact
                    </Navlink>
                </NavlinkCollection>
            </div>
        </div>
    )
}

function NavlinkCollection({
    children,
    ...rest
}: React.ComponentPropsWithRef<'div'>) {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const [ boxHeight, setBoxHeight ] = useState<number | string>(0);
    const hamburgerElement = useRef<HTMLUListElement>(null);

    const handleToggle = () => {
        setIsOpen(open => !open);
    }

    useLayoutEffect(() => {
        if (hamburgerElement.current) {
            const bbox = hamburgerElement.current.scrollHeight;
            setBoxHeight(bbox);
        }
    }, []);

    return (
        <div
            className="flex h-full items-center justify-end"
            {...rest}
        >
            <div className="md:hidden">
                <div onClick={handleToggle}>
                    <MenuIcon />
                </div>
                <ul
                    ref={hamburgerElement}
                    style={{ maxHeight: isOpen ? boxHeight : 0, transition: "max-height 0.25s ease-out" }}
                    className="flex absolute top-12 right-0 overflow-hidden w-full flex-col items-end bg-gray-700 text-xl font-medium [&>li]:border-b"
                >
                    { children }
                </ul>
            </div>

            <ul className="hidden h-full md:flex">
                { children }
            </ul>
        </div>
    )
}

function Navlink({
    children,
    className,
    ...rest
}: React.ComponentPropsWithRef<'li'>) {
    return (
        <li
            className={cn(
                "flex p-2 md:py-0 justify-end items-center cursor-pointer w-full md:w-auto h-full hover:bg-gray-700 active:bg-gray-700 border-gray-800",
                className
            )}
            {...rest}
        >
            { children }
        </li>
    )
}