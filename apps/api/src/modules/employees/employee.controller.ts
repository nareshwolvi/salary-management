import type { Request, Response } from "express";
import { getEmployees } from "./employee.service.js";

const SORT_FIELDS = [
  "name",
  "salary",
  "country",
  "department",
  "role",
] as const;

const SORT_ORDERS = ["asc", "desc"] as const;

function parsePositiveInteger(
  value: unknown,
  defaultValue: number,
): number {
  if (typeof value !== "string") {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return defaultValue;
  }

  return parsed;
}

function parseOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

export async function listEmployees(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const page = parsePositiveInteger(req.query.page, 1);
    const pageSize = Math.min(
      parsePositiveInteger(req.query.pageSize, 25),
      100,
    );

    const search = parseOptionalString(req.query.search);
    const country = parseOptionalString(req.query.country);
    const department = parseOptionalString(req.query.department);
    const role = parseOptionalString(req.query.role);

    const requestedSortBy = parseOptionalString(req.query.sortBy);
    const requestedSortOrder = parseOptionalString(req.query.sortOrder);

    const sortBy = SORT_FIELDS.includes(
      requestedSortBy as (typeof SORT_FIELDS)[number],
    )
      ? (requestedSortBy as (typeof SORT_FIELDS)[number])
      : "name";

    const sortOrder = SORT_ORDERS.includes(
      requestedSortOrder as (typeof SORT_ORDERS)[number],
    )
      ? (requestedSortOrder as (typeof SORT_ORDERS)[number])
      : "asc";

    const result = await getEmployees({
        page,
        pageSize,
        ...(search !== undefined && { search }),
        ...(country !== undefined && { country }),
        ...(department !== undefined && { department }),
        ...(role !== undefined && { role }),
        sortBy,
        sortOrder,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch employees:", error);

    res.status(500).json({
      message: "Failed to fetch employees",
    });
  }
}