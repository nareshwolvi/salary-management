# Salary Management System — Requirements

## 1. Goal

Build a web-based salary management application that enables an HR Manager to manage and understand the current salary structure of an organization with approximately 10,000 employees across multiple countries. The system will replace the core salary-management workflow currently handled through spreadsheets and provide searchable employee salary data and useful organizational salary insights.

## 2. User Persona

**Primary user:** HR Manager

The HR Manager should be able to quickly find employees, view their current salary information, update salaries, and analyze how salary costs are distributed across countries, departments, and roles.

## 3. Scope & Features

### Employee & Salary Management
- Seed the system with 10,000 employees.
- Store Employee ID, name, department, country, role/job title, salary, and currency.
- View employee salary information.
- Search employees by relevant attributes such as name, Employee ID, role, or department.
- Filter and sort employees.
- Update the current salary and currency for an employee.
- Provide paginated employee results rather than loading all 10,000 records into the UI at once.

### Salary Analytics
Provide an HR dashboard containing useful salary insights, including:
- Total number of employees.
- Total salary cost.
- Average salary.
- Median salary.
- Salary distribution.
- Salary comparisons by country.
- Salary comparisons by department.
- Salary comparisons by role.

Analytics should support relevant filters so the HR Manager can investigate specific groups of employees.

### Currency Handling
Employees may retain their local salary currency. For cross-currency organizational comparisons, the application will use a documented fixed/deterministic FX conversion table rather than live exchange-rate data. This keeps analytics deterministic and avoids an external runtime dependency.

## 4. Deliberately Out of Scope

The following features are intentionally excluded:

- **Salary history/effective dates:** Current salary is sufficient for the assessment; historical compensation tracking is not required.
- **Full employee lifecycle management:** Employee creation, deletion, deactivation, and profile-management workflows are excluded because the assessment only requires viewing and updating salary information for seeded employees.
- **Detailed compensation components:** Bonuses, equity, benefits, allowances, and tax/deduction calculations are excluded to keep the focus on salary management.
- **Payroll processing:** Payroll calculation, payslips, taxation, and payment processing are outside the problem scope.
- **Natural-language/AI querying:** A dashboard with filters and analytics is sufficient; natural-language salary queries are not required.
- **Authentication and multi-role authorization:** The assessment specifies a single HR Manager persona, so a full authentication/RBAC system is unnecessary.
- **Excel/CSV import/export:** Reproducing spreadsheet functionality is not required. The application focuses on providing a better web-based workflow.
- **Live FX integration:** Fixed deterministic rates are preferred for reproducible analytics and to avoid unnecessary external dependencies.

## 5. Non-Functional Requirements

- Maintainable and modular code structure.
- Responsive and understandable UI.
- RESTful backend APIs.
- Efficient database querying, filtering, sorting, and pagination for 10,000 employees.
- Meaningful unit and API tests that are fast, deterministic, and easy to understand.
- Production-ready deployment.
- Incremental Git commits demonstrating the evolution of the solution.
- Documentation covering requirements, architecture, design decisions, trade-offs, testing, performance considerations, and intentional AI usage.

## 6. Success Criteria

The solution is successful when an HR Manager can efficiently search and filter the 10,000 seeded employees, view and update current salary information, and use the dashboard to understand salary costs and distributions across relevant organizational dimensions. The implementation should demonstrate clear product thinking, maintainable engineering practices, appropriate testing, and pragmatic architectural decisions.