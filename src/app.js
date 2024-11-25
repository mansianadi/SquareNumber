// Import the Application and Router classes from the Oak module
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import the createExitSignal function from the JS+OAI shared library
import { createExitSignal, staticServer } from "./shared/server.ts";

import { promptGPT } from "./shared/openai.ts";
import { promptDalle } from "./shared/openai.ts";

// Create instances of the Application and Router classes
const app = new Application();
const router = new Router();

// Function to generate cocktail recipe using API
async function generateCocktailRecipe(ingredients, flavor, mood) {
    const prompt =
        `Create a unique cocktail recipe using these ingredients: ${ingredients}.
         Make it ${flavor} and suitable for a ${mood} occasion. Include detailed instructions.
         Add alot of Emojis.`;
    const rawRecipe = await promptGPT(prompt, { max_tokens: 1005 });

    // Remove markdown characters
    const cleanedRecipe = rawRecipe
        .replace(/[*#_`]/g, "")
        .trim();

    return cleanedRecipe;
}

// Function to generate cocktail image based on the recipe
async function generateCocktailImage(ingredients, flavor, mood) {
    const prompt = `Generate a picture of a cocktail using ${ingredients}.
                    The flavor is "${flavor}", and the mood is "${mood}".
                    The cocktail should look realistic, with a beautiful presentation.`;

    const imageResponse = await promptDalle(prompt);
    const imageUrl = imageResponse.url;
    return imageUrl;
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

    // Generate recipe and image
    try {
        const recipe = await generateCocktailRecipe(ingredients, flavor, mood);
        const imageUrl = await generateCocktailImage(ingredients, flavor, mood);
        ctx.response.body = { recipe, imageUrl }; // Return both recipe and image URL
    } catch (error) {
        console.error("Error generating cocktail:", error);
        ctx.response.status = 500;
        ctx.response.body = {
            error: "Failed to generate cocktail recipe or image.",
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
