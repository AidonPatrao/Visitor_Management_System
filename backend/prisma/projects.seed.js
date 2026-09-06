import prisma from '../src/db/prisma.js'

export const projectSeed = async ()=> {
    await prisma.projects.createMany({
        data:[
            {projectName:"test-website",departmentId:1},
            {projectName:"test-admin-feature",departmentId:1},
            {projectName:"Traceify",departmentId:1},
            {projectName:"Project Nexus",departmentId:2},
            {projectName:"PeoplePulse",departmentId:2},
            {projectName:"TalentFlow",departmentId:2},
            {projectName:"Project Equinox",departmentId:3},
            {projectName:"FinSight",departmentId:3},
            {projectName:"LedgerSync",departmentId:3},
            {projectName:"None",departmentId:7}
            
        ]
    })
}

projectSeed() 