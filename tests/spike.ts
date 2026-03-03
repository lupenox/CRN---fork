// run: deno run --allow-net --allow-read --allow-env spike.ts

import "jsr:@std/dotenv/load";
import { GET } from "../api/routes/dynamic.ts";

async function runTest() {
    console.log("--- Starting CRUD Verification (SCRUM-27) ---");

    //events table
    console.log("Testing: GET /events");
    const reqEvents = new Request("http://localhost/api/data?table=events");
    const resEvents = await GET(reqEvents);
    const eventsData = await resEvents.json();
    console.log("Events Data:", eventsData);

    // Sanitization Test: Unauthorized Table
    console.log("\nTesting: Sanitization (Unauthorized Table)");
    const reqFake = new Request("http://localhost/api/data?table=users"); // 'users' is not in allow-list
    const resFake = await GET(reqFake);
    const fakeData = await resFake.json();
    console.log("🔒 Security Test (Unauthorized Table):", fakeData.error === "Table is not in the allow list" ? "PASS" : "FAIL", fakeData);

    // Test: Invalid ID Type
    console.log("\nTesting: Sanitization (Invalid ID Type)");
    const reqNan = new Request("http://localhost/api/data?table=poc_test&id=not-a-number");
    const resNan = await GET(reqNan);
    const nanData = await resNan.json();
    console.log("🛡️ Data Integrity Test (Invalid ID):", nanData.success === false ? "PASS" : "FAIL", nanData);

    // Test: SQL Injection Attempt
    console.log("\nTesting: Sanitization (SQL Injection Attempt)");
    const reqInject = new Request("http://localhost/api/data?table=events;DROP TABLE events;--");
    const resInject = await GET(reqInject);
    const injectData = await resInject.json();
    console.log("🛑 SQL Injection Blocked:", injectData.error.includes("allow list") ? "PASS" : "FAIL");

    console.log("\n--- Verification Complete ---");
}

runTest();