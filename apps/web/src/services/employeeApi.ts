import API_BASE_URL from "../config/api";
import type {
  EmployeeListResponse,
  Employee
} from "../types/employees";

export interface EmployeeListParams {
  page: number;
  pageSize: number;
  search?: string;
  country?: string;
  department?: string;
  role?: string;
  sortBy?: "name" | "salary" | "country" | "department" | "role";
  sortOrder?: "asc" | "desc";
}

export async function fetchEmployees(
  params: EmployeeListParams,
): Promise<EmployeeListResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.country) {
    searchParams.set("country", params.country);
  }

  if (params.department) {
    searchParams.set("department", params.department);
  }

  if (params.role) {
    searchParams.set("role", params.role);
  }

  if (params.sortBy) {
    searchParams.set("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    searchParams.set("sortOrder", params.sortOrder);
  }

  const response = await fetch(
    `${API_BASE_URL}/employees?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  return response.json() as Promise<EmployeeListResponse>;
}

export async function updateEmployeeSalary(
  employeeId: string,
  salary: string,
  currency: string,
): Promise<Employee> {
  const response = await fetch(
    `${API_BASE_URL}/employees/${encodeURIComponent(employeeId)}/salary`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        salary,
        currency,
      }),
    },
  );

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(
      result?.message ?? "Failed to update employee salary",
    );
  }

  const result = (await response.json()) as {
    data: Employee;
  };

  return result.data;
}