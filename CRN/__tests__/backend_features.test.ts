//run: npm run test:backend 

/**
 * SCRUM-39: Backend Feature Integration Tests
 * * This test suite verifies the Deno API endpoints from the React Native (Jest) environment.
 * Documentation of verified features:
 * 1. Connectivity: Ensures the API /health endpoint is reachable.
 * 2. Data Integrity: Validates that /events returns correctly structured database records.
 * 3. Access Control: Confirms unauthorized table requests are blocked via an allow-list.
 * 4. Security: Verifies sanitization logic against SQL Injection attempts.
 * 5. Authentication: Tests that the /login route correctly rejects invalid credentials.
 */

const BASE_URL = "http://localhost:8000";

describe("Backend API & Security (SCRUM-39)", () => {
  
  test("Health Check: API is reachable", async () => {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  test("Verification: GET /events returns data", async () => {
  const response = await fetch(`${BASE_URL}/events`); 
  const data = await response.json();
  
  expect(response.status).toBe(200);
  expect(data.success).toBe(true);
  expect(Array.isArray(data.data)).toBe(true); // Checks the nested array
  }, 10000);

  test("Security: Block unauthorized table access", async () => {
    const response = await fetch(`${BASE_URL}/dynamic?table=users`);
    const data = await response.json();
    expect(data.error).toBe("Table is not in the allow list");
  });

  test("SQL Injection: Sanitize malicious table names", async () => {
    const maliciousInput = "events;DROP TABLE events;--";
    const response = await fetch(`${BASE_URL}/dynamic?table=${encodeURIComponent(maliciousInput)}`);
    const data = await response.json();
    expect(data.error).toMatch(/allow list/);
  });

  test("Security: Reject login with invalid credentials", async () => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "testuser",
        password: "wrongpassword123"
      })
    });

    const data = await response.json();

    expect(data.success).toBe(false);
    console.log("🔒 Auth Test Result:", data.error || "Access Denied");
  });

});