'use client';

import { createContext } from "react";

export type TProjectListContext = {
    handleProjectSelection: (pid: number) => boolean;
}
export const ProjectListContext = createContext<TProjectListContext>({
    handleProjectSelection: () => false,
});