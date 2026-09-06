import prisma from '../src/db/prisma.js'


export const departmentSeed = async () => {
   await prisma.departments.createMany({
    data:[
        {departmentName:"QA"},
        {departmentName:"HR"},
        {departmentName:"Finance"},
        {departmentName:"Maintenance"} 
    ],
    skipDuplicates: true
   })
}

departmentSeed()