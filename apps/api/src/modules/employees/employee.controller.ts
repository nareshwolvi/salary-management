import type { Request, Response } from "express";
import { getEmployees, updateSalary } from "./employee.service.js";
import { Prisma } from "../../../generated/prisma/client.js";

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

function parseSalary(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const salary = String(value).trim();

  if (!/^\d+(\.\d{1,2})?$/.test(salary)) {
    return null;
  }

  if (Number(salary) <= 0) {
    return null;
  }

  return salary;
}

function parseCurrency(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const currency = value.trim().toUpperCase();

  if (!/^[A-Z]{3}$/.test(currency)) {
    return null;
  }

  return currency;
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

export async function updateEmployeeSalary(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const employeeId =
      typeof req.params.employeeId === "string"
        ? req.params.employeeId.trim()
        : "";

    if (!employeeId) {
      res.status(400).json({
        message: "Employee ID is required",
      });
      return;
    }

    const salary = parseSalary(req.body?.salary);
    const currency = parseCurrency(req.body?.currency);

    if (salary === null) {
      res.status(400).json({
        message:
          "Salary must be a positive number with a maximum of 2 decimal places",
      });
      return;
    }

    if (currency === null) {
      res.status(400).json({
        message: "Currency must be a valid 3-letter currency code",
      });
      return;
    }

    const employee = await updateSalary(
      employeeId,
      salary,
      currency,
    );

    res.status(200).json({
      data: employee,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({
        message: "Employee not found",
      });
      return;
    }

    console.error("Failed to update employee salary:", error);

    res.status(500).json({
      message: "Failed to update employee salary",
    });
  }
}