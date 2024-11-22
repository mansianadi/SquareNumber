// Import the Application and Router classes from the Oak module
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import the createExitSignal function from the JS+OAI shared library
import { createExitSignal, staticServer } from "./shared/server.ts";

import { promptGPT } from "./shared/openai.ts";
//import { promptDalle } from "./shared/openai.ts";

// Create instances of the Application and Router classes
const app = new Application();
const router = new Router();

// Function to generate cocktail recipe using OpenAI API
async function generateCocktailRecipe(ingredients, flavor, mood) {
    const prompt =
        `Create a unique cocktail recipe using these ingredients: ${ingredients}.
         Make it ${flavor} and suitable for a ${mood} occasion. Include detailed instructions.
         Add Emojis. Make the name of the cocktail, Ingredients and Instructions in orange.
         `;
    const rawRecipe = await promptGPT(prompt, { max_tokens: 1005 });

    // Remove markdown characters
    const cleanedRecipe = rawRecipe
        .replace(/[*#_`]/g, "")
        .trim();

    //const response = await promptDalle(
    //  `Generate a cocktail based on ${ingredients}.
    //    The flavor is "${flavor}", the mood is "${mood}". `,
    //);

    //const imageResponse = await promptDalle(response);
    //const imageUrl = imageResponse.url;

    return cleanedRecipe;
}

// API for generating cocktail recipe
router.post("/api/cocktail", async (ctx) => {
    console.log("/API/Cocktail");
    const { ingredients, flavor, mood } = await ctx.request.body({
        type: "json",
    }).value;

    if (!ingredients) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Please provide ingredients." };
        return;
    }

    const recipe = await generateCocktailRecipe(ingredients, flavor, mood);
    ctx.response.body = { recipe };
});

// Tell the app to use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Try serving undefined routes with static files
app.use(staticServer);

// Start the server
console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
