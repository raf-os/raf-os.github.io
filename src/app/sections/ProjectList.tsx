'use client';

import Segment from "@/components/layout/Segment";
import { TitleListItem, ProjectListLabel, ProjectListSection, ProjectItem } from "./ProjectList/desktop";
import { useLocalization } from "@/hooks/useLocalization";
import { myProjects } from "./ProjectList/localizations";
import { ProjectListContext, type TProjectListContext } from "./ProjectList/context";
import { ProjectListMobile } from "./ProjectList/mobile";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Responsive, { Queries } from "@/components/layout/Responsive";

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
                    <div className="flex flex-col lg:flex-row lg:flex-nowrap gap-8 w-full lg:w-[1024px] h-full">
                        <Responsive breakpoint={Queries.IsDesktop}
                            onMatch={(
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
                            )}
                            onFail={(
                                <ProjectListMobile labelPublic={publicProjectsLabel} labelPrivate={privateProjectsLabel} selectedProject={selectedProject} />
                            )}
                        />

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
