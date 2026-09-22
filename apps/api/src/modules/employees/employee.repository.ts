import { prisma } from "../../config/prisma.js";

export interface EmployeeListParams {
  skip: number;
  take: number;
  search?: string;
  country?: string;
  department?: string;
  role?: string;
  sortBy: "name" | "salary" | "country" | "department" | "role";
  sortOrder: "asc" | "desc";
}

export async function findEmployees(params: EmployeeListParams) {
  const {
    skip,
    take,
    search,
    country,
    department,
    role,
    sortBy,
    sortOrder,
  } = params;

  const where = {
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              employeeId: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
    ...(country ? { country } : {}),
    ...(department ? { department } : {}),
    ...(role ? { role } : {}),
  };

  const orderBy = {
    [sortBy]: sortOrder,
  };

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take,
      orderBy,
    }),
    prisma.employee.count({
      where,
    }),
  ]);

  return {
    employees,
    total,
  };
}