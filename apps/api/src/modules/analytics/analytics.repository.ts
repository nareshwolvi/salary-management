import { prisma } from "../../config/prisma.js";

export async function getSalarySummary() {
  const employees = await prisma.employee.findMany({
    select: {
      salary: true,
      currency: true,
    },
  });

  return employees;
}

export async function getSalaryBreakdown(groupBy: "country" | "department") {
  const employees = await prisma.employee.findMany({
    select: {
      country: true,
      department: true,
      salary: true,
      currency: true,
    },
  });

  return employees.map((employee) => ({
    group:
      groupBy === "country"
        ? employee.country
        : employee.department,
    salary: Number(employee.salary),
    currency: employee.currency,
  }));
}