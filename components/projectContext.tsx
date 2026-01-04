"use client"
import { EndpointType, PingLog, ProjectType } from "@/lib/types"
import { createContext, useContext } from "react"



interface ProjectContextType {
    projectData: ProjectType
    endpoints: EndpointType[]
    logs: PingLog[]
}

const ProjectContext = createContext<ProjectContextType | null>(null)

export function ProjectContextProvider({
    projectData,
    endpoints,
    logs,
    children,
}: {
    projectData: ProjectType,
    endpoints: EndpointType[],
    logs: PingLog[]
    children: React.ReactNode
}) {
    return (
        <ProjectContext.Provider value={{
            projectData,
            endpoints,
            logs
        }}>
            {children}
        </ProjectContext.Provider>
    )
}

export const useProject = () => {
    const ctx = useContext(ProjectContext)
    if (!ctx) throw new Error("useProject must be inside ProjectLayout")
    return ctx
}