import { Router } from "express";
import {
  listEmployees,
  updateEmployeeSalary,
} from "./employee.controller.js";

const router = Router();

router.get("/", listEmployees);

router.patch("/:employeeId/salary", updateEmployeeSalary);

export default router;
