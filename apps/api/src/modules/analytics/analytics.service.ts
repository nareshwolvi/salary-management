import { getSalarySummary } from "./analytics.repository.js";
import { getSalaryBreakdown as getSalaryBreakdownData } from "./analytics.repository.js";

const FX_TO_USD: Record<string, number> = {
  USD: 1,
  INR: 0.012,
  EUR: 1.08,
  GBP: 1.27,
  JPY: 0.0067,
  AED: 0.2723,
  SGD: 0.74,
  AUD: 0.66,
  CAD: 0.73,
};

function convertToUsd(salary: number, currency: string): number {
  const rate = FX_TO_USD[currency];

  if (rate === undefined) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  return salary * rate;
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1]! + sorted[middle]!) / 2;
  }

  return sorted[middle]!;
}

export async function getSalaryAnalytics() {
  const employees = await getSalarySummary();

  const salariesInUsd = employees.map((employee) =>
    convertToUsd(Number(employee.salary), employee.currency),
  );

  const totalSalaryCost = salariesInUsd.reduce(
    (total, salary) => total + salary,
    0,
  );

  const averageSalary =
    salariesInUsd.length > 0
      ? totalSalaryCost / salariesInUsd.length
      : 0;

  const medianSalary = calculateMedian(salariesInUsd);

  return {
    currency: "USD",
    totalEmployees: employees.length,
    totalSalaryCost: Number(totalSalaryCost.toFixed(2)),
    averageSalary: Number(averageSalary.toFixed(2)),
    medianSalary: Number(medianSalary.toFixed(2)),
  };
}

export async function getSalaryBreakdown(
  groupBy: "country" | "department",
) {
  const employees = await getSalaryBreakdownData(groupBy);

  const groups = new Map<
    string,
    {
      employeeCount: number;
      totalSalaryCost: number;
    }
  >();

  for (const employee of employees) {
    const salaryInUsd = convertToUsd(
      employee.salary,
      employee.currency,
    );

    const existing = groups.get(employee.group);

    if (existing) {
      existing.employeeCount += 1;
      existing.totalSalaryCost += salaryInUsd;
    } else {
      groups.set(employee.group, {
        employeeCount: 1,
        totalSalaryCost: salaryInUsd,
      });
    }
  }

  return Array.from(groups.entries())
    .map(([group, values]) => ({
      group,
      employeeCount: values.employeeCount,
      totalSalaryCost: Number(values.totalSalaryCost.toFixed(2)),
      averageSalary: Number(
        (values.totalSalaryCost / values.employeeCount).toFixed(2),
      ),
    }))
    .sort((a, b) => a.group.localeCompare(b.group));
}