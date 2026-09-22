import { Router } from "express";
import { listEmployees } from "./employee.controller.js";

const router = Router();

router.get("/", listEmployees);

export default router;
