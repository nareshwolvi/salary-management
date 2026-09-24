import { useEffect, useState } from "react";
import EmployeeTable from "./components/EmployeeTable";
import { fetchSalaryAnalytics } from "./services/analyticsApi";
import type { SalaryAnalytics } from "./services/analyticsApi";

const navigationItems = [
  {
    label: "Overview",
    icon: "pi pi-chart-bar",
  },
  {
    label: "Employees",
    icon: "pi pi-users",
  },
];

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [analytics, setAnalytics] =
    useState<SalaryAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      try {
        setAnalyticsLoading(true);
        setAnalyticsError(null);

        const result = await fetchSalaryAnalytics();

        if (!cancelled) {
          setAnalytics(result);
        }
      } catch {
        if (!cancelled) {
          setAnalyticsError("Unable to load salary analytics.");
        }
      } finally {
        if (!cancelled) {
          setAnalyticsLoading(false);
        }
      }
    }

    void loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatCurrency = (value: number) => {
    if (!analytics) {
      return "—";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: analytics.currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const kpis = [
    {
      label: "Total Employees",
      value: analyticsLoading
        ? "Loading..."
        : analytics
          ? analytics.totalEmployees.toLocaleString()
          : "—",
      icon: "pi pi-users",
    },
    {
      label: "Total Salary Cost",
      value: analyticsLoading
        ? "Loading..."
        : formatCurrency(analytics?.totalSalaryCost ?? 0),
      icon: "pi pi-wallet",
    },
    {
      label: "Average Salary",
      value: analyticsLoading
        ? "Loading..."
        : formatCurrency(analytics?.averageSalary ?? 0),
      icon: "pi pi-chart-line",
    },
    {
      label: "Median Salary",
      value: analyticsLoading
        ? "Loading..."
        : formatCurrency(analytics?.medianSalary ?? 0),
      icon: "pi pi-chart-bar",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Salary Management
            </h1>
            <p className="text-xs text-slate-500">
              HR Manager Portal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-700">
                HR Manager
              </p>
              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              HR
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white lg:min-h-[calc(100vh-4rem)] lg:w-60 lg:border-b-0 lg:border-r">
          <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
            {navigationItems.map((item) => {
              const isActive = activePage === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActivePage(item.label)}
                  className={`flex min-w-fit items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <i className={item.icon} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <p className="mb-1 text-sm font-medium text-slate-500">
              {activePage}
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {activePage === "Overview"
                ? "Salary overview"
                : "Employee management"}
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Manage employee salary information and understand how
              the organization pays people.
            </p>
          </div>

          {activePage === "Overview" ? (
            <>
              {analyticsError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {analyticsError}
                </div>
              )}

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">
                        {kpi.label}
                      </span>

                      <i
                        className={`${kpi.icon} text-slate-400`}
                        aria-hidden="true"
                      />
                    </div>

                    <p className="text-2xl font-semibold text-slate-900">
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </section>
            </>
          ) : (
            <EmployeeTable />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;