import {
  findEmployees,
  updateEmployeeSalary,
  type EmployeeListParams,
} from "./employee.repository.js";

export interface EmployeeListQuery {
  page: number;
  pageSize: number;
  search?: string;
  country?: string;
  department?: string;
  role?: string;
  sortBy: EmployeeListParams["sortBy"];
  sortOrder: EmployeeListParams["sortOrder"];
}

export async function getEmployees(query: EmployeeListQuery) {
  const skip = (query.page - 1) * query.pageSize;

  const { employees, total } = await findEmployees({
    skip,
    take: query.pageSize,
    ...(query.search !== undefined && { search: query.search }),
    ...(query.country !== undefined && { country: query.country }),
    ...(query.department !== undefined && {
      department: query.department,
    }),
    ...(query.role !== undefined && { role: query.role }),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return {
    data: employees,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    },
  };
}

export async function updateSalary(
  employeeId: string,
  salary: string,
  currency: string,
) {
  return updateEmployeeSalary(employeeId, salary, currency);
}