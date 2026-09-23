import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /api/employees", () => {
  it("returns paginated employees", async () => {
    const response = await request(app)
      .get("/api/employees")
      .query({
        page: 1,
        pageSize: 10,
      });

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveLength(10);

    expect(response.body.pagination).toEqual({
      page: 1,
      pageSize: 10,
      total: 10000,
      totalPages: 1000,
    });
  });

  it("filters employees by country", async () => {
    const response = await request(app)
      .get("/api/employees")
      .query({
        country: "India",
        page: 1,
        pageSize: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(10);

    for (const employee of response.body.data) {
      expect(employee.country).toBe("India");
    }

    expect(response.body.pagination.total).toBeGreaterThan(0);
  });

  it("searches employees by employee ID", async () => {
    const response = await request(app)
      .get("/api/employees")
      .query({
        search: "EMP-00272",
        page: 1,
        pageSize: 10,
      });

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].employeeId).toBe("EMP-00272");
  });

  it("sorts employees by salary descending", async () => {
    const response = await request(app)
      .get("/api/employees")
      .query({
        page: 1,
        pageSize: 10,
        sortBy: "salary",
        sortOrder: "desc",
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(10);

    const salaries = response.body.data.map(
      (employee: { salary: string }) => Number(employee.salary),
    );

    for (let index = 1; index < salaries.length; index += 1) {
      expect(salaries[index]).toBeLessThanOrEqual(salaries[index - 1]);
    }
  });
});