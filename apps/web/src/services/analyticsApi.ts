import API_BASE_URL from "../config/api";

export interface SalaryAnalytics {
  currency: string;
  totalEmployees: number;
  totalSalaryCost: number;
  averageSalary: number;
  medianSalary: number;
}

interface SalaryAnalyticsResponse {
  data: SalaryAnalytics;
}

export async function fetchSalaryAnalytics(): Promise<SalaryAnalytics> {
  const response = await fetch(
    `${API_BASE_URL}/analytics/summary`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch salary analytics");
  }

  const result =
    (await response.json()) as SalaryAnalyticsResponse;

  return result.data;
}