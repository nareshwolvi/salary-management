import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { fetchEmployees, updateEmployeeSalary } from "../services/employeeApi";
import type {
  Employee,
  EmployeePagination,
} from "../types/employees";

type SortField =
  | "name"
  | "salary"
  | "country"
  | "department"
  | "role";

type SortOrder = "asc" | "desc";

const COUNTRIES = [
  "Australia",
  "Canada",
  "Germany",
  "India",
  "Japan",
  "Singapore",
  "United Kingdom",
  "United States",
];

const DEPARTMENTS = [
  "Engineering",
  "Finance",
  "Human Resources",
  "Legal",
  "Marketing",
  "Operations",
  "Product",
  "Sales",
  "Support",
  "Technology",
];

const ROLES = [
  "Accountant",
  "Business Analyst",
  "Data Analyst",
  "DevOps Engineer",
  "Finance Manager",
  "HR Manager",
  "Product Manager",
  "Project Manager",
  "QA Engineer",
  "Sales Executive",
  "Sales Manager",
  "Software Engineer",
  "Support Engineer",
  "UI/UX Designer",
  "UX Researcher",
];

const CURRENCIES = [
  "AUD",
  "CAD",
  "EUR",
  "GBP",
  "INR",
  "JPY",
  "SGD",
  "USD",
];

function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] =
    useState<EmployeePagination | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");

  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] =
    useState<SortOrder>("asc");

  const [editingEmployeeId, setEditingEmployeeId] =
    useState<string | null>(null);
  const [editingSalary, setEditingSalary] = useState("");
  const [editingCurrency, setEditingCurrency] = useState("");
  const [savingEmployeeId, setSavingEmployeeId] =
    useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadEmployees() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchEmployees({
          page,
          pageSize,
          ...(search.trim() && { search: search.trim() }),
          ...(country && { country }),
          ...(department && { department }),
          ...(role && { role }),
          sortBy,
          sortOrder,
        });

        if (!cancelled) {
          setEmployees(response.data);
          setPagination(response.pagination);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load employees.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadEmployees();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    search,
    country,
    department,
    role,
    sortBy,
    sortOrder,
  ]);

  function handleSearchChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handleCountryChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    setCountry(event.target.value);
    setPage(1);
  }

  function handleDepartmentChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    setDepartment(event.target.value);
    setPage(1);
  }

  function handleRoleChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    setRole(event.target.value);
    setPage(1);
  }

  function handleSort(field: SortField) {
    if (sortBy === field) {
      setSortOrder((currentOrder) =>
        currentOrder === "asc" ? "desc" : "asc",
      );
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }

    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setCountry("");
    setDepartment("");
    setRole("");
    setPage(1);
  }

  function goToPreviousPage() {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }

  function goToNextPage() {
    if (!pagination) {
      return;
    }

    setPage((currentPage) =>
      Math.min(pagination.totalPages, currentPage + 1),
    );
  }

  function startEditing(employee: Employee) {
    setEditingEmployeeId(employee.employeeId);
    setEditingSalary(employee.salary);
    setEditingCurrency(employee.currency);
    setSaveError(null);
    setSaveSuccess(null);
  }

  function cancelEditing() {
    setEditingEmployeeId(null);
    setEditingSalary("");
    setEditingCurrency("");
    setSaveError(null);
  }

  async function saveSalary(employee: Employee) {
    const salary = editingSalary.trim();

    if (!/^\d+(\.\d{1,2})?$/.test(salary)) {
      setSaveError(
        "Salary must be a positive number with a maximum of 2 decimal places.",
      );
      return;
    }

    if (Number(salary) <= 0) {
      setSaveError("Salary must be greater than zero.");
      return;
    }

    if (!CURRENCIES.includes(editingCurrency)) {
      setSaveError("Please select a valid currency.");
      return;
    }

    try {
      setSavingEmployeeId(employee.employeeId);
      setSaveError(null);
      setSaveSuccess(null);

      const updatedEmployee = await updateEmployeeSalary(
        employee.employeeId,
        salary,
        editingCurrency,
      );

      setEmployees((currentEmployees) =>
        currentEmployees.map((currentEmployee) =>
          currentEmployee.employeeId === employee.employeeId
            ? updatedEmployee
            : currentEmployee,
        ),
      );

      setEditingEmployeeId(null);
      setEditingSalary("");
      setEditingCurrency("");
      setSaveSuccess(
        `Salary updated for ${employee.employeeId}.`,
      );
    } catch (saveError) {
      setSaveError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update salary.",
      );
    } finally {
      setSavingEmployeeId(null);
    }
  }

  const hasFilters =
    search.trim() !== "" ||
    country !== "" ||
    department !== "" ||
    role !== "";

  function getSortIcon(field: SortField) {
    if (sortBy !== field) {
      return "pi pi-sort-alt";
    }

    return sortOrder === "asc"
      ? "pi pi-sort-amount-up"
      : "pi pi-sort-amount-down";
  }

  function renderSortableHeader(
    label: string,
    field: SortField,
  ) {
    return (
      <button
        type="button"
        onClick={() => handleSort(field)}
        className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900"
      >
        <span>{label}</span>

        <i
          className={getSortIcon(field)}
          aria-hidden="true"
        />
      </button>
    );
  }

  function renderSalaryCell(employee: Employee) {
    const isEditing =
      editingEmployeeId === employee.employeeId;

    if (!isEditing) {
      return (
        <span className="font-medium text-slate-700">
          {employee.salary}
        </span>
      );
    }

    return (
      <InputText
        value={editingSalary}
        onChange={(event) =>
          setEditingSalary(event.target.value)
        }
        inputMode="decimal"
        aria-label={`Salary for ${employee.employeeId}`}
        className="w-32"
      />
    );
  }

  function renderCurrencyCell(employee: Employee) {
    const isEditing =
      editingEmployeeId === employee.employeeId;

    if (!isEditing) {
      return employee.currency;
    }

    return (
      <select
        value={editingCurrency}
        onChange={(event) =>
          setEditingCurrency(event.target.value)
        }
        aria-label={`Currency for ${employee.employeeId}`}
        className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-700"
      >
        {CURRENCIES.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    );
  }

 function renderActionsCell(employee: Employee) {
  const isEditing =
    editingEmployeeId === employee.employeeId;

  const isSaving =
    savingEmployeeId === employee.employeeId;

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          startEditing(employee);
        }}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Edit
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void saveSalary(employee);
        }}
        disabled={isSaving}
        className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          cancelEditing();
        }}
        disabled={isSaving}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900">
            Employees
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Search, filter, sort, and update employee salary
            information.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <span className="p-input-icon-left">
            <i
              className="pi pi-search"
              aria-hidden="true"
            />

            <InputText
              value={search}
              onChange={handleSearchChange}
              placeholder="Search employee..."
              aria-label="Search employees"
              className="w-full"
            />
          </span>

          <select
            value={country}
            onChange={handleCountryChange}
            aria-label="Filter by country"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="">All countries</option>

            {COUNTRIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={department}
            onChange={handleDepartmentChange}
            aria-label="Filter by department"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="">All departments</option>

            {DEPARTMENTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={role}
            onChange={handleRoleChange}
            aria-label="Filter by role"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="">All roles</option>

            {ROLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <div className="mt-3">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Clear filters
            </button>
          </div>
        )}

        {saveError && (
          <div className="mt-4">
            <Message
              severity="error"
              text={saveError}
            />
          </div>
        )}

        {saveSuccess && (
          <div className="mt-4">
            <Message
              severity="success"
              text={saveSuccess}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="p-4">
          <Message
            severity="error"
            text={error}
          />
        </div>
      )}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <ProgressSpinner
            style={{
              width: "40px",
              height: "40px",
            }}
            strokeWidth="4"
          />
        </div>
      ) : (
        <>
          <DataTable
            value={employees}
            stripedRows
            responsiveLayout="scroll"
            emptyMessage="No employees found."
          >
            <Column
              field="employeeId"
              header="Employee ID"
            />

            <Column
              field="name"
              header={renderSortableHeader("Name", "name")}
            />

            <Column
              field="department"
              header={renderSortableHeader(
                "Department",
                "department",
              )}
            />

            <Column
              field="country"
              header={renderSortableHeader(
                "Country",
                "country",
              )}
            />

            <Column
              field="role"
              header={renderSortableHeader("Role", "role")}
            />

            <Column
              field="currency"
              header="Currency"
              body={renderCurrencyCell}
            />

            <Column
              field="salary"
              header={renderSortableHeader(
                "Salary",
                "salary",
              )}
              body={renderSalaryCell}
            />

            <Column
              header="Actions"
              body={renderActionsCell}
            />
          </DataTable>

          {pagination && (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {(pagination.page - 1) *
                    pagination.pageSize +
                    1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-700">
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                  {pagination.total.toLocaleString()}
                </span>{" "}
                employees
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={pagination.page === 1}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="px-2 text-sm text-slate-600">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </span>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={
                    pagination.page ===
                    pagination.totalPages
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default EmployeeTable;