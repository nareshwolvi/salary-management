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