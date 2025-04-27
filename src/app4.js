// Import the Application and Router classes from the Oak module
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import the createExitSignal function from the JS+OAI shared library
import { createExitSignal, staticServer } from "./shared/server.ts";

// Create instances of the Application and Router classes
const app = new Application();
const router = new Router();

// Check if the input is valid and calculate the square of the number
router.get("/api/square", (ctx) => {
    const number = parseFloat(ctx.request.url.searchParams.get("number"));

    ctx.response.body = isNaN(number)
        ? { error: "Please enter a valid number." }
        : { square: (number ** 2).toFixed(2) };
});

// Tell the app to use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Try serving undefined routes with static files
app.use(staticServer);

// Start the server
console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
