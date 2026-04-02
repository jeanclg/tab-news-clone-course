import database from "infra/database.js";

async function cleanDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

beforeAll(async () => {
  await cleanDatabase();
});

test("GET to /api/v1/migrations", async () => {
  const res = await fetch("http://localhost:3000/api/v1/migrations");

  const responseBody = await res.json();

  console.log(responseBody);

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
