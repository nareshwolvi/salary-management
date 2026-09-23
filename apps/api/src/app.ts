import express from "express";
import cors from "cors";
import helmet from "helmet";
import employeeRoutes from "./modules/employees/employee.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "salary-management-api",
  });
});

app.use("/api/employees", employeeRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;
