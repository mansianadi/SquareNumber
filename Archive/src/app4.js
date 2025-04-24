// deno-lint-ignore-file
// Import the Application and Router classes from the Oak module
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import the createExitSignal function from the JS+OAI shared library
import { createExitSignal, staticServer } from "./shared/server.ts";

import { promptGPT } from "./shared/openai.ts";

// Create instances of the Application and Router classes
const app = new Application();
const router = new Router();

// Function to generate a travel itinerary considering health conditions
async function generateItinerary(destination, travelDates, healthConditions) {
    const prompt = `
        Create a personalized travel itinerary for someone traveling to ${destination} from ${travelDates}. 
        The traveler has the following health conditions: ${healthConditions}.
        Include health-related tips and advice for the trip, considering the destination's weather, health risks, and other factors. 
        Provide daily activity suggestions that are suitable for someone with these conditions.`;

    const rawItinerary = await promptGPT(prompt, { max_tokens: 1005 });

    // Clean up the output
    const cleanedItinerary = rawItinerary
        .replace(/[*#_`]/g, "")
        .trim();

    return cleanedItinerary;
}

// API for generating a travel itinerary
router.post("/api/itinerary", async (ctx) => {
    console.log("/API/Itinerary");
    const { destination, travelDates, healthConditions } = await ctx.request
        .body({ type: "json" }).value;

    if (!destination || !travelDates || !healthConditions) {
        ctx.response.status = 400;
        ctx.response.body = {
            error:
                "Please provide destination, travel dates, and health conditions.",
        };
        return;
    }

    try {
        const itinerary = await generateItinerary(
            destination,
            travelDates,
            healthConditions,
        );
        ctx.response.status = 200;
        ctx.response.body = { itinerary };
        // deno-lint-ignore no-unused-vars
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = {
            error: "Error generating itinerary. Please try again later.",
        };
    }
});

// Tell the app to use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Try serving undefined routes with static files
app.use(staticServer);

// Start the server
console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
