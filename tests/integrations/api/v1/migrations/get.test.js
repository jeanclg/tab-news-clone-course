test("GET to /api/v1/status", async () => {
  const res = await fetch("http://localhost:3000/api/v1/migrations");

  const responseBody = await res.json();

  console.log(responseBody);

  expect(res.status).toBe(200);
  expect(Array.isArray(responseBody)).toBe(true);
});
