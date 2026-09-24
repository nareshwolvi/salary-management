export interface Employee {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  country: string;
  role: string;
  currency: string;
  salary: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface EmployeeListResponse {
  data: Employee[];
  pagination: EmployeePagination;
}