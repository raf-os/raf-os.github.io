'use client';

import { ILocalizedProjectItem, projectsWithID, myProjects } from "./localizations";
import { ProjectListContext } from "./context";
import { useLocalization } from "@/hooks/useLocalization";
import { formatProjectLocalization, cn } from "@/app/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, useRef, useEffect, useContext } from "react";
import { ChevronDown } from "lucide-react";


type ProjectListMobileProps = {
    labelPublic: string,
    labelPrivate: string,
    selectedProject: number,
}

/** MOBILE ONLY */
export function ProjectListItemMobile({
    project,
    isSelected,
    onSelect
}: {
    project: ILocalizedProjectItem & { __ID: number },
    isSelected?: boolean,
    onSelect: (id: number) => void;
}) {
    const localizedTitle = useLocalization(formatProjectLocalization(project)[0]);
    const handleOnSelect = () => {
        onSelect(project.__ID);
    }
    return (
        <li
            className={cn(
                "text-lg font-medium not-first:pt-2 pl-2 not-last:pb-2",
                isSelected && "text-gray-600"
            )}
            role="button"
            onClick={handleOnSelect}
        >
            { localizedTitle }
        </li>
    )
}

/** MOBILE ONLY */
export function ProjectListMobile(props: ProjectListMobileProps) {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const _selectorRef = useRef<HTMLButtonElement>(null);
    const _menuRef = useRef<HTMLDivElement>(null);

    const privateProjects = projectsWithID.filter(proj => proj._TYPE==="private");
    const publicProjects = projectsWithID.filter(proj => proj._TYPE==="public");

    const { selectedProject, labelPrivate, labelPublic } = props;
    const {handleProjectSelection} = useContext(ProjectListContext);

    const selectedTitle = myProjects[selectedProject];
    const localizedSelectedTitle = useLocalization(formatProjectLocalization(selectedTitle)[0]);

    const projectMap = (projectList: (ILocalizedProjectItem & { __ID: number })[]) => {
        return projectList.map(proj => (
            <ProjectListItemMobile key={proj.__ID} project={proj} isSelected={selectedProject===proj.__ID} onSelect={handleSelectItem} />
        ));
    }

    const onMenuOpen = () => {
        setIsOpen(current => !current);
    }

    const handleSelectItem = (mID: number) => {
        handleProjectSelection(mID);
        setIsOpen(false);
    }

    useEffect(() => {
        const handleOutsideClick = (ev: PointerEvent) => {
            if (_selectorRef.current && _selectorRef.current.contains(ev.target as Node | null)) {
                return;
            }
            if (_menuRef.current && _menuRef.current.contains(ev.target as Node | null)) {
                return;
            }

            setIsOpen(false); // it's outside
        }

        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    const LabelJSX = ({children}: {children?: React.ReactNode}) => {
        return (
            <label className="text-emerald-400 text-sm font-bold uppercase">
                { children }
            </label>
        )
    };

    const variants = {
        hidden: {
            height: 0,
            opacity: 0,
        },
        visible: {
            height: "auto",
            opacity: 1,
        }
    }

    return (
        <div className="relative z-1">
            <button ref={_selectorRef} type="button" className="flex gap-4 w-full text-left items-center h-12 justify-between bg-gray-900 rounded-lg" onClick={onMenuOpen}>
                <div className="grow-1 shrink-1 py-1 px-3 overflow-x-hidden text-ellipsis text-emerald-400 text-lg font-medium">
                    { localizedSelectedTitle }
                </div>
                <div className="flex items-center justify-center grow-0 shrink-0 h-full px-1 bg-emerald-900 rounded-r-lg">
                    <ChevronDown size={32} color="var(--color-emerald-400)" className={cn("transition-transform", isOpen?"rotate-180":"rotate-0")} />
                </div>
            </button>
            <AnimatePresence>
                { isOpen && (
                    <motion.div
                        className="absolute top-full translate-y-2 w-full bg-gray-900 rounded-lg overflow-hidden"
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        ref={_menuRef}
                    >
                        <ul className="flex flex-col p-4">
                            <LabelJSX>{labelPublic}</LabelJSX>
                                { projectMap(publicProjects) }
                            <LabelJSX>{labelPrivate}</LabelJSX>
                                { projectMap(privateProjects) }
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}