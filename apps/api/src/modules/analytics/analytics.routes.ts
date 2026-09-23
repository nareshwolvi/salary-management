import { Router } from "express";
import { getSalarySummary } from "./analytics.controller.js";

const router = Router();

router.get("/summary", getSalarySummary);

export default router;