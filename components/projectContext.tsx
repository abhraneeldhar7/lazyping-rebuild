"use client"
import { ProjectType } from "@/lib/types"
import { createContext, useContext } from "react"
const ProjectContext = createContext<ProjectType | null>(null)
export function ProjectContextProvider({
    projectData,
    children,
}: {
    projectData: ProjectType | null,
    children: React.ReactNode
}) {
    return (
        <ProjectContext.Provider value={projectData}>
            {children}
        </ProjectContext.Provider>
    )
}

export const useProject = () => {
    const ctx = useContext(ProjectContext)
    if (!ctx) throw new Error("useProject must be inside ProjectLayout")
    return ctx
}