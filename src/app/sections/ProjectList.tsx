'use client';

import Segment from "@/components/layout/Segment";
import { useLocalization, Localized, AvailableLanguages, type TLocalizedItem } from "@/hooks/useLocalization";
import { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@lib/utils";
import Image from "next/image";

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
    languages?: string,
    _NAME: string,
    _TYPE: "private" | "public",
}

const myProjects: ILocalizedProjectItem[] = [{
    _NAME: "website-project",
    _TYPE: "public",
    'en-us': {
        title: "raf-os.github.io",
        description:    "It's this website right here!\n\n" +
                        "It uses the *Next.JS* framework to export a static, fully front-end website to be hosted as a github page. " +
                        "It's written mostly in typescript, with some HTML and CSS for the layout and styling. " +
                        "The source code is fully available on my github profile, or you can also click the button at the end of " +
                        "this description to be taken to the repository automatically.\n\n" +
                        "The moving background you see uses *Babylon.js* to render a real-time procedurally generated 3D scene. " +
                        "Initially, the idea was to have a cityscape as the background, with buildings passing through. " +
                        "While it worked, a single simple building 3D model I made in blender, while very small in file size (~50kb), " +
                        "dramatically increased the initial page load time, which was unacceptable. I then chose to not load " +
                        "any models at all, but to procedurally generate some terrain through the use of a GLSL shader. " +
                        "The shader works by both displacing a flat surface vertically, thus adding the mountain heights, and drawing " +
                        "the colorful square grid texture. The sun itself is also drawn using a separate shader, leaving the sky as " +
                        "the only thing that's actually an image texture, that I rendered using blender.",
    },
    'pt-br': {
        title: "raf-os.github.io",
        description: "Lorem ipsum"
    },
    image: "website.webp",
    hyperlink: "https://github.com/raf-os/raf-os.github.io",
    languages: "Typescript, HTML, CSS, GLSL"
}, {
    _NAME: "test-vite-project",
    _TYPE: "public",
    'en-us': {
        title: "Test Playground",
        description:    "A collection of various front-end experiments written in typescript. " +
                        "It uses Vite and react-router as its base.\n\n" +
                        "Right now, it contains: an attempt at making a better web form system that " +
                        "returns a JSON object when the form is submitted; and a few prototypes of an " +
                        "app that would theoretically allow the user to create an app by merely dragging and dropping elements. " +
                        "The latter is meant to be a more accessible alternative to coding, targetting less experienced " +
                        "users, providing more ease of use at the expense of complexity (for better or worse).",
    },
    'pt-br': {
        title: "Test Playground",
        description: "Lorem ipsum"
    },
    image: "playground.webp",
    hyperlink: "https://github.com/raf-os/my-vite-learn-app",
    languages: "Typescript, HTML, CSS"
}, {
    _NAME: "godot-fps",
    _TYPE: "public",
    'en-us': {
        title: "Godot C# FPS",
        description:    "A simple first person shooter game prototype using the godot game engine, written entirely in C#. " +
                        "The models were downloaded from sketchfab, which I then had to rig and animate in blender. " +
                        "Right now, these assets are not included in the github repository, as they're a bit larger in size " +
                        "and not ideal for a repo, and while the models were free downloads, I'm not sure under what license they're under, " +
                        "so I don't know how freely I may distribute them, and if there are any additional prerequisites such as crediting " +
                        "the authors. I will probably get this sorted out later.\n\n" +
                        "**W A S D** - Move\n\n**Space** - Jump\n\n**Left mouse button** - Shoot",
    },
    'pt-br': {
        title: "Godot C# FPS",
        description: "Lorem ipsum"
    },
    image: "godot-fps.webp",
    hyperlink: "https://github.com/raf-os/godot-csharp-fps",
    languages: "C#"
}, {
    _NAME: "nutria-dynamic",
    _TYPE: "private",
    'en-us': {
        title: "NutrIA Dynamic Website",
        description:    "A commercial project I started with my brother that leverages a large language model on a separate back end " +
                        "to generate custom nutritional reports to clients, which this website would then arrange the data " +
                        "in a more user-friendly way, with the idea of creating more modular and personalized reports, to better " +
                        "help them achieve their nutritional goals.\n\n" +
                        "While this project is mostly aligned with front-end development, it still has some light back-end work " +
                        "that fetches data from a mongodb database.\n\n" +
                        "*As of now, the project is in an indefinite hiatus.*",
    },
    'pt-br': {
        title: "NutrIA Site Dinâmico",
        description: "Lorem ipsum"
    },
    image: "nutria-dynamic.webp",
    languages: "Typescript, HTML, CSS"
}, {
    _NAME: "nutria-rest-api",
    _TYPE: "private",
    'en-us': {
        title: "NutrIA REST API",
        description:    "A commercial project I started with my brother. This is the back-end portion of the project, " +
                        "and uses the FastAPI python library to set up an API endpoint that communicates with the Whatsapp and OpenAI APIs." +
                        "My contributions were mostly at the beggining, helping set up and organize the original project. " +
                        "After that was done, I moved on to the more UI oriented areas.",
    },
    'pt-br': {
        title: "REST API do NutrIA",
        description: "Lorem ipsum"
    },
    image: "nutria-rest-api.webp",
    languages: "Python"
}, {
    _NAME: "nutria-dashboard",
    _TYPE: "private",
    'en-us': {
        title: "AI Agent Dashboard",
        description:    "A dashboard made to help configuring and monitoring the activity of AI chatbot agents in an easy, " +
                        "centralized and human readable way, as to lower the barrier of entry for both their deployment and " +
                        "their maintenance. This one inspired some of the experiments on my personal project up above, 'Test Playground'.\n\n" +
                        "This project has an equal amount of front and back-end work, and contains some basic user authentication.\n\n" +
                        "*As of now, the project is in an indefinite hiatus.*",
    },
    'pt-br': {
        title: "Dashboard do NutrIA",
        description: "Lorem ipsum"
    },
    image: "nutria-dashboard.webp",
    languages: "Typescript, HTML, CSS"
}]

export default function ProjectList() {
    const [ selectedProject, setSelectedProject ] = useState<number>(0);
    const [ sectionHeader, sectionSubtitle, publicProjectsLabel, privateProjectsLabel ] = useLocalization([{
        "en-us": "My projects",
        "pt-br": "Meus projetos"
    }, {
        "en-us": "Here's a list of my programming projects I've been involved with:",
        "pt-br": "Aqui está uma lista de todos meus projetos de programação nos quais eu me envolvi:"
    }, {
        "en-us": "Public projects",
        "pt-br": "Projetos públicos"
    }, {
        "en-us": "Private projects",
        "pt-br": "Projetos privados"
    }]);

    const onProjectSelected = (pid: number) => {
        if (pid === selectedProject) return false;

        setSelectedProject(pid);
        return true;
    }

    const ctx: TProjectListContext = {
        handleProjectSelection: onProjectSelected
    }

    const projects: Record<string, React.ReactNode[]> = {
        private: [],
        public: [],
    }

    myProjects.map((p, idx) => {
        const jsx = (<TitleListItem pid={idx} item={p} key={`pid[${idx}]::${p._NAME}`} isSelected={idx===selectedProject} />);
        if (p._TYPE==="private") { projects.private.push(jsx); }
        else if (p._TYPE==="public") { projects.public.push(jsx); }
    });

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
                    <div className="flex flex-nowrap gap-8 w-full lg:w-[1024px] h-full">
                        <div className="w-1/4 h-full grow-0 shrink-0 flex flex-col gap-2 items-end pr-4 border-r-2 border-emerald-500 text-lg">
                            <ProjectListLabel htmlFor="public-projects">{ publicProjectsLabel }</ProjectListLabel>
                            <ProjectListSection id="public-projects">
                                { projects.public }
                            </ProjectListSection>

                            <ProjectListLabel htmlFor="private-projects">{ privateProjectsLabel }</ProjectListLabel>
                            <ProjectListSection id="private-projects">
                                { projects.private }
                            </ProjectListSection>
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

function ProjectListLabel({ children, className, ...rest}: React.ComponentPropsWithRef<'label'>) {
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

function ProjectListSection({children, className, ...rest}: React.ComponentPropsWithRef<'ul'>) {
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

function TitleListItem({ item, isSelected, pid }: { item: ILocalizedProjectItem, isSelected: boolean, pid: number}) {
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

function ProjectItem({ item }: { item: ILocalizedProjectItem }) {
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
                className="text-2xl font-medium text-emerald-400"
            >
                { title }
            </h2>

            <div className="w-full markdown-styling">
                <div className="lg:float-right p-8">
                    <Image
                        width={256}
                        height={256}
                        src={`/project-images/${image}`}
                        className="rounded-full outline-4 outline-offset-2 outline-emerald-500 shadow-lg shadow-black/25 object-cover object-center"
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

function formatProjectLocalization(project: ILocalizedProjectItem) {
    const {image: _, hyperlink: __, _NAME: _N, _TYPE: _T, languages: _L , ...localizations} = project;
    const formatted: TLocalizedItem[] = [];

    for (const [key, value] of Object.entries(localizations)) {
        Object.entries(value).map(([_, v], idx) => {
            formatted[idx] = { ...formatted[idx], [key]: v }
        });
    }

    return formatted;
}