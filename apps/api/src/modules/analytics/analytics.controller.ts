import type { Request, Response } from "express";
import { getSalaryAnalytics } from "./analytics.service.js";

export async function getSalarySummary(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const analytics = await getSalaryAnalytics();

    res.status(200).json({
      data: analytics,
    });
  } catch (error) {
    console.error("Failed to calculate salary analytics:", error);

    res.status(500).json({
      message: "Failed to calculate salary analytics",
    });
  }
}