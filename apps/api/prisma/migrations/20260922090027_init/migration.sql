-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "salary" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeId_key" ON "Employee"("employeeId");

-- CreateIndex
CREATE INDEX "Employee_name_idx" ON "Employee"("name");

-- CreateIndex
CREATE INDEX "Employee_country_idx" ON "Employee"("country");

-- CreateIndex
CREATE INDEX "Employee_department_idx" ON "Employee"("department");

-- CreateIndex
CREATE INDEX "Employee_role_idx" ON "Employee"("role");

-- CreateIndex
CREATE INDEX "Employee_currency_idx" ON "Employee"("currency");

-- CreateIndex
CREATE INDEX "Employee_salary_idx" ON "Employee"("salary");
