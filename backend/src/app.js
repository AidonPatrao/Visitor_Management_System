import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from '../src/routes/auth.routes.js'
import departmentsRouter from './routes/departments.routes.js'
import projectsRouter from './routes/projects.routes.js'
import employeesRouter from './routes/employees.routes.js'
import operatorRouter from './routes/operators.routes.js'
import adminVisitorConfigsRouter from './routes/visitorConfigs.routes.js'
import visitorRouter from './routes/visitor.routes.js'
import uploadRoutes from "./routes/upload.routes.js";


const app = express()
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/admin',departmentsRouter)
app.use('/api/admin',projectsRouter)
app.use('/api/admin',employeesRouter)
app.use('/api/admin',operatorRouter)
app.use('/api/admin',adminVisitorConfigsRouter)
app.use("/api/visitors", visitorRouter);
app.use("/api/upload", uploadRoutes);


export default app