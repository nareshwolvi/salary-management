import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Sales",
  "Marketing",
  "Finance",
  "Human Resources",
  "Operations",
  "Customer Success",
  "Legal",
];

const countries = [
  { name: "India", currency: "INR", minSalary: 600000, maxSalary: 3000000 },
  { name: "United States", currency: "USD", minSalary: 60000, maxSalary: 220000 },
  { name: "United Kingdom", currency: "GBP", minSalary: 40000, maxSalary: 140000 },
  { name: "Germany", currency: "EUR", minSalary: 45000, maxSalary: 150000 },
  { name: "Canada", currency: "CAD", minSalary: 55000, maxSalary: 170000 },
  { name: "Australia", currency: "AUD", minSalary: 60000, maxSalary: 180000 },
  { name: "Singapore", currency: "SGD", minSalary: 50000, maxSalary: 180000 },
  { name: "Japan", currency: "JPY", minSalary: 5000000, maxSalary: 22000000 },
];

const roles = [
  "Software Engineer",
  "Senior Software Engineer",
  "Staff Engineer",
  "Product Manager",
  "Senior Product Manager",
  "UX Designer",
  "UI Designer",
  "Sales Manager",
  "Sales Executive",
  "Marketing Manager",
  "Financial Analyst",
  "HR Manager",
  "Operations Manager",
  "Customer Success Manager",
  "Legal Counsel",
];

const firstNames = [
  "Aarav",
  "Aditi",
  "Arjun",
  "Ananya",
  "Rahul",
  "Priya",
  "Vikram",
  "Sneha",
  "Rohan",
  "Kavya",
  "Daniel",
  "Emma",
  "Michael",
  "Olivia",
  "James",
  "Sophia",
  "William",
  "Mia",
];

const lastNames = [
  "Sharma",
  "Patel",
  "Kumar",
  "Singh",
  "Reddy",
  "Iyer",
  "Nair",
  "Mehta",
  "Gupta",
  "Brown",
  "Smith",
  "Johnson",
  "Williams",
  "Taylor",
  "Anderson",
  "Thomas",
];

function deterministicRandom(seed: number): number {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function randomItem<T>(items: T[], seed: number): T {
  return items[Math.floor(deterministicRandom(seed) * items.length)]!;
}

function generateSalary(
  minSalary: number,
  maxSalary: number,
  seed: number,
): number {
  const random = deterministicRandom(seed);

  const salary = minSalary + random * (maxSalary - minSalary);

  return Math.round(salary / 100) * 100;
}

function generateEmployee(index: number) {
  const country = randomItem(countries, index * 11);
  const department = randomItem(departments, index * 13);
  const role = randomItem(roles, index * 17);
  const firstName = randomItem(firstNames, index * 19);
  const lastName = randomItem(lastNames, index * 23);

  const salary = generateSalary(
    country.minSalary,
    country.maxSalary,
    index * 29,
  );

  return {
    employeeId: `EMP-${String(index + 1).padStart(5, "0")}`,
    name: `${firstName} ${lastName}`,
    department,
    country: country.name,
    role,
    currency: country.currency,
    salary,
  };
}

async function main() {
  console.log("Starting employee seed...");

  const employees = Array.from(
    { length: 10_000 },
    (_, index) => generateEmployee(index),
  );

  await prisma.employee.createMany({
    data: employees,
    skipDuplicates: true,
  });

  const count = await prisma.employee.count();

  console.log(`Employee seed completed. Total employees: ${count}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
