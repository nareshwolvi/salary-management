import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { prisma } from "../config/prisma.js";

const TEST_EMPLOYEE_ID = "EMP-00272";

let originalSalary: string;
let originalCurrency: string;

beforeAll(async () => {
  const employee = await prisma.employee.findUnique({
    where: {
      employeeId: TEST_EMPLOYEE_ID,
    },
    select: {
      salary: true,
      currency: true,
    },
  });

  if (!employee) {
    throw new Error(`Test employee ${TEST_EMPLOYEE_ID} was not found`);
  }

  originalSalary = employee.salary.toString();
  originalCurrency = employee.currency;
});

afterAll(async () => {
  await prisma.employee.update({
    where: {
      employeeId: TEST_EMPLOYEE_ID,
    },
    data: {
      salary: originalSalary,
      currency: originalCurrency,
    },
  });

  await prisma.$disconnect();
});

describe("PATCH /api/employees/:employeeId/salary", () => {
  it("updates an employee salary successfully", async () => {
    const response = await request(app)
      .patch(`/api/employees/${TEST_EMPLOYEE_ID}/salary`)
      .send({
        salary: "75000",
        currency: "USD",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.employeeId).toBe(TEST_EMPLOYEE_ID);
    expect(response.body.data.salary).toBe("75000");
    expect(response.body.data.currency).toBe("USD");
  });

  it("rejects a negative salary", async () => {
    const response = await request(app)
      .patch(`/api/employees/${TEST_EMPLOYEE_ID}/salary`)
      .send({
        salary: "-1000",
        currency: "USD",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("positive number");
  });

  it("rejects a salary with more than two decimal places", async () => {
    const response = await request(app)
      .patch(`/api/employees/${TEST_EMPLOYEE_ID}/salary`)
      .send({
        salary: "75000.123",
        currency: "USD",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "maximum of 2 decimal places",
    );
  });

  it("rejects an invalid currency", async () => {
    const response = await request(app)
      .patch(`/api/employees/${TEST_EMPLOYEE_ID}/salary`)
      .send({
        salary: "75000",
        currency: "INVALID",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "valid 3-letter currency code",
    );
  });

  it("returns 404 for a nonexistent employee", async () => {
    const response = await request(app)
      .patch("/api/employees/EMP-99999/salary")
      .send({
        salary: "75000",
        currency: "USD",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Employee not found");
  });
});