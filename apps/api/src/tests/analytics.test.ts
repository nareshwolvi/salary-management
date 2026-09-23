import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /api/analytics/summary", () => {
  it("returns salary summary for all employees", async () => {
    const response = await request(app)
      .get("/api/analytics/summary");

    expect(response.status).toBe(200);

    expect(response.body.data).toMatchObject({
      currency: "USD",
      totalEmployees: 10000,
    });

    expect(response.body.data.totalSalaryCost).toEqual(
      expect.any(Number),
    );

    expect(response.body.data.averageSalary).toEqual(
      expect.any(Number),
    );

    expect(response.body.data.medianSalary).toEqual(
      expect.any(Number),
    );
  });
});

describe("GET /api/analytics/breakdown", () => {
  it("returns salary breakdown by country", async () => {
    const response = await request(app)
      .get("/api/analytics/breakdown")
      .query({
        groupBy: "country",
      });

    expect(response.status).toBe(200);

    expect(response.body.data.length).toBeGreaterThan(0);

    for (const group of response.body.data) {
      expect(group).toMatchObject({
        group: expect.any(String),
        employeeCount: expect.any(Number),
        totalSalaryCost: expect.any(Number),
        averageSalary: expect.any(Number),
      });
    }
  });

  it("returns salary breakdown by department", async () => {
    const response = await request(app)
      .get("/api/analytics/breakdown")
      .query({
        groupBy: "department",
      });

    expect(response.status).toBe(200);

    expect(response.body.data.length).toBeGreaterThan(0);

    for (const group of response.body.data) {
      expect(group).toMatchObject({
        group: expect.any(String),
        employeeCount: expect.any(Number),
        totalSalaryCost: expect.any(Number),
        averageSalary: expect.any(Number),
      });
    }
  });

  it("rejects an invalid groupBy value", async () => {
    const response = await request(app)
      .get("/api/analytics/breakdown")
      .query({
        groupBy: "invalid",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "groupBy must be either country or department",
    );
  });
});