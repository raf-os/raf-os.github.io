'use client';

import { useContext } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useLocalization, Localized } from "@/hooks/useLocalization";
import { ProjectListContext } from "./context";
import { ILocalizedProjectItem, myProjects } from "./localizations";
import { cn, formatProjectLocalization } from "@/app/lib/utils";

export function ProjectListLabel({ children, className, ...rest}: React.ComponentPropsWithRef<'label'>) {
    return (
        <label
            className={cn(
                "w-full text-right text-sm font-bold uppercase text-emerald-400",
                className
            )}
            {...rest}
        >
            {children}
        </label>
    )
}

export function ProjectListSection({children, className, ...rest}: React.ComponentPropsWithRef<'ul'>) {
    return (
        <ul
            className={cn(
                "w-full flex flex-col items-end gap-2",
                className
            )}
            { ...rest }
        >
            {children}
        </ul>
    )
}

export function TitleListItem({ item, isSelected, pid }: { item: ILocalizedProjectItem, isSelected: boolean, pid: number}) {
    const [ t ] = formatProjectLocalization(item);
    const projectTitle = useLocalization(t);

    const { handleProjectSelection } = useContext(ProjectListContext);

    const handleSelect = () => {
        handleProjectSelection(pid);
    }

    return (
        <li
            className={cn(
                "cursor-pointer flex relative",
                isSelected && "font-bold"
            )}
            role="button"
            onClick={handleSelect}
        >
            { projectTitle }

            { isSelected && (
                <motion.div
                    className="w-[8px] translate-x-[13px] h-full absolute top-0 left-full rounded-full bg-emerald-500"
                    layoutId="selector"
                />
            )}
        </li>
    )
}

export function ProjectItem({ item }: { item: ILocalizedProjectItem }) {
    const { image, hyperlink } = item;

    const formatted = formatProjectLocalization(item);

    formatted.push({
        "en-us": "Programming languages",
        "pt-br": "Linguagens de programação"
    });

    const [ title, description, languagesLabel ] = useLocalization(formatted);

    const variants = {
        visible: {
            opacity: 1,
        },
        hidden: {
            opacity: 0,
        }
    }

    return (
        <motion.div
            className="w-full flex flex-col items-start gap-4"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25 }}
            layout
        >
            <h2
                className="text-2xl hidden lg:block font-medium text-emerald-400"
            >
                { title }
            </h2>

            <div className="w-full markdown-styling">
                <div className="lg:float-right p-8">
                    <Image
                        width={256}
                        height={256}
                        src={`/project-images/${image}`}
                        className="mx-auto lg:mx-0 rounded-full outline-4 outline-offset-2 outline-emerald-500 shadow-lg shadow-black/25 object-cover object-center"
                        alt="Project image"
                    />
                </div>

                <Localized className="lg:clear-left" useMarkdown>
                    { description }
                </Localized>

                <p>
                    { languagesLabel }: { item.languages }
                </p>

                { hyperlink && (
                    <a
                        className="btn ml-2 mt-4"
                        href={hyperlink}
                        target="_blank"
                    >
                        Go to project page
                    </a>
                )}
            </div>
        </motion.div>
    )
}