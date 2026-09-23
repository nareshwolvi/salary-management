import { Router } from "express";
import {
  getSalarySummary,
  getSalaryBreakdownSummary,
} from "./analytics.controller.js";

const router = Router();

router.get("/summary", getSalarySummary);
router.get("/breakdown", getSalaryBreakdownSummary);

export default router;