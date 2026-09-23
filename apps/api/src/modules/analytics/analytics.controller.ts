import type { Request, Response } from "express";
import {
  getSalaryAnalytics,
  getSalaryBreakdown,
} from "./analytics.service.js";

const GROUP_BY_VALUES = ["country", "department"] as const;

function parseGroupBy(
  value: unknown,
): (typeof GROUP_BY_VALUES)[number] | null {
  if (typeof value !== "string") {
    return null;
  }

  return GROUP_BY_VALUES.includes(
    value as (typeof GROUP_BY_VALUES)[number],
  )
    ? (value as (typeof GROUP_BY_VALUES)[number])
    : null;
}

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

export async function getSalaryBreakdownSummary(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const groupBy = parseGroupBy(req.query.groupBy);

    if (groupBy === null) {
      res.status(400).json({
        message: "groupBy must be either country or department",
      });
      return;
    }

    const breakdown = await getSalaryBreakdown(groupBy);

    res.status(200).json({
      data: breakdown,
    });
  } catch (error) {
    console.error("Failed to calculate salary breakdown:", error);

    res.status(500).json({
      message: "Failed to calculate salary breakdown",
    });
  }
}