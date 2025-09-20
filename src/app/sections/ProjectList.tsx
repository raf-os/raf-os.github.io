'use client';

import Segment from "@/components/layout/Segment";
import { useLocalization, Localized, AvailableLanguages, type TLocalizedItem } from "@/hooks/useLocalization";
import { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@lib/utils";

type TProjectListContext = {
    handleProjectSelection: (pid: number) => boolean;
}
const ProjectListContext = createContext<TProjectListContext>({
    handleProjectSelection: () => false,
});

interface IProjectItem {
    title: string,
    description: string,
}

type ILocalizedProjectItem = Record<keyof typeof AvailableLanguages, IProjectItem> & {
    image: string,
    hyperlink?: string,
    _NAME: string,
    _TYPE: "private" | "public",
}

const myProjects: ILocalizedProjectItem[] = [{
    _NAME: "website-project",
    _TYPE: "public",
    'en-us': {
        title: "raf-os.github.io",
        description: "It's this website!",
    },
    'pt-br': {
        title: "raf-os.github.io",
        description: "Lorem ipsum"
    },
    image: "website.webp",
    hyperlink: "https://github.com/raf-os/raf-os.github.io"
}, {
    _NAME: "test-vite-project",
    _TYPE: "public",
    'en-us': {
        title: "Test Playground",
        description: "Lorem ipsum",
    },
    'pt-br': {
        title: "Test Playground",
        description: "Lorem ipsum"
    },
    image: "playground.webp",
    hyperlink: "https://github.com/raf-os/my-vite-learn-app"
}]

export default function ProjectList() {
    const [ selectedProject, setSelectedProject ] = useState<number>(0);
    const [ sectionHeader, sectionSubtitle ] = useLocalization([{
        "en-us": "My projects",
        "pt-br": "Meus projetos"
    }, {
        "en-us": "Here's a list of my public projects available on my github page:",
        "pt-br": "Aqui está uma lista de todos meus projetos públicos disponíveis na minha página do github:"
    }]);

    const onProjectSelected = (pid: number) => {
        if (pid === selectedProject) return false;

        setSelectedProject(pid);
        return true;
    }

    const ctx: TProjectListContext = {
        handleProjectSelection: onProjectSelected
    }

    return (
        <div
            className="flex justify-center w-full bg-gray-800 py-12 min-h-lvh"
        >
            <Segment.Root className="gap-6">
                <Segment.Main>
                    <div className="flex flex-col gap-4 text-center">
                        <h1 className="text-4xl font-medium">
                            { sectionHeader }
                        </h1>

                        <p>
                            { sectionSubtitle }
                        </p>
                    </div>
                </Segment.Main>

                <ProjectListContext.Provider value={ctx}>
                    <div className="flex flex-nowrap gap-8 w-full h-full">
                        <div className="w-1/4 h-full grow-0 shrink-0 flex flex-col gap-2 items-end pr-4 border-r-2 border-emerald-500 text-lg">
                        { myProjects.map((p, idx) => (
                            <TitleListItem pid={idx} item={p} key={`pid[${idx}]::${p._NAME}`} isSelected={idx===selectedProject} />
                        )) }
                        </div>

                        <div
                            className="flex flex-col grow-1 shrink-1 overflow-x-hidden"
                        >
                            <AnimatePresence mode="wait">
                                <ProjectItem key={selectedProject} item={myProjects[selectedProject]} />
                            </AnimatePresence>
                        </div>
                    </div>
                </ProjectListContext.Provider>
            </Segment.Root>
        </div>
    )
}

function TitleListItem({ item, isSelected, pid }: { item: ILocalizedProjectItem, isSelected: boolean, pid: number}) {
    const [ t ] = formatProjectLocalization(item);
    const projectTitle = useLocalization(t);

    const { handleProjectSelection } = useContext(ProjectListContext);

    const handleSelect = () => {
        handleProjectSelection(pid);
    }

    return (
        <button
            type="button"
            className={cn(
                "cursor-pointer flex relative",
                isSelected && "font-bold"
            )}
            onClick={handleSelect}
        >
            { projectTitle }

            { isSelected && (
                <motion.div
                    className="w-[6px] translate-x-[14px] h-full absolute top-0 left-full rounded-full bg-emerald-500"
                    layoutId="selector"
                />
            )}
        </button>
    )
}

function ProjectItem({ item }: { item: ILocalizedProjectItem }) {
    const { image, hyperlink } = item;

    const formatted = formatProjectLocalization(item);
    const [ title, description ] = useLocalization(formatted);

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
                className="text-2xl font-medium text-emerald-400"
            >
                { title }
            </h2>

            <div className="w-full">
                <div className="md:float-left p-8">
                    <img
                        width={256}
                        height={256}
                        src={`/project-images/${image}`}
                        className="rounded-full outline-2 outline-offset-2 outline-emerald-500 shadow-lg shadow-black/25 object-cover object-center"
                        alt="Project image"
                    />
                </div>
                <Localized className="md:clear-right">
                    { description }
                </Localized>
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

function formatProjectLocalization(project: ILocalizedProjectItem) {
    const {image: _, hyperlink: __, _NAME: ___, ...localizations} = project;
    const formatted: TLocalizedItem[] = [];

    for (const [key, value] of Object.entries(localizations)) {
        Object.entries(value).map(([_, v], idx) => {
            formatted[idx] = { ...formatted[idx], [key]: v }
        });
    }

    return formatted;
}