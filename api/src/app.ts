import express, { Application } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import userRoute from "./routes/user.routes"
import workflowRoute from "./routes/workflows.routes"
import categoryRoute from "./routes/category.routes"
import produitRoute from "./routes/product.routes"
import employee from "./routes/employee.routes"
import vente from "./routes/vente"
import perfoEmp from "./routes/perfoEmp.routes"
import logsRoute from "./routes/logs.routes"


const app: Application = express();

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoute)
app.use("/api/workflow", workflowRoute)
app.use("/api/category",categoryRoute)

app.use("/api/product", produitRoute)
app.use("/api/employee", employee)
app.use("/api/sale", vente)

app.use("/api/perfoEmp", perfoEmp)
app.use("/api/log", logsRoute)


export default app;
