import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Initialize the application
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

// Initialize the router
const router = new Router();

// Sample health profile for the user (this could come from a database)
const healthProfile = {
  name: "Mansi Anadi",
  allergies: ["Pollen", "Dust"],
  conditions: ["Asthma"],
  preferredActivities: ["Indoor", "Sightseeing"],
};

// Simple itinerary generation logic
function generateItinerary(location, profile) {
  const { allergies, conditions, preferredActivities } = profile;
  const activities = [];

  // Suggest activities based on health conditions
  if (conditions.includes("Asthma")) {
    activities.push(
      "Visit indoor museums and art galleries to avoid outdoor allergens.",
    );
  } else {
    activities.push("Explore local parks and outdoor attractions.");
  }

  // Filter activities based on allergies
  if (allergies.includes("Pollen")) {
    activities.push(
      "Avoid outdoor activities with high pollen count. Opt for indoor museums or galleries.",
    );
  }

  // Suggest activities based on preferences
  if (preferredActivities.includes("Indoor")) {
    activities.push(
      "Plan for indoor activities like visiting local museums and theaters.",
    );
  } else if (preferredActivities.includes("Sightseeing")) {
    activities.push(
      "Explore the city's sightseeing spots, including parks, markets, and monuments.",
    );
  }

  return {
    location,
    suggestedActivities: activities,
  };
}

router.get("/", (context) => {
  context.response.body = "Welcome to the Voyare AI Travel Health API!";
});

router.post("/generate-itinerary", async (context) => {
  const { location, healthProfile } = await context.request.body().value;

  // Generate itinerary based on health profile
  const itinerary = generateItinerary(location, healthProfile);

  context.response.body = {
    message: "Itinerary generated successfully!",
    itinerary,
  };
});

// Function to fetch AI-generated itinerary from the Deno backend
// Function to fetch AI-generated itinerary from the Deno backend
async function generateItinerary() {
  const output = document.getElementById("itinerary-output");
  output.innerHTML = "Generating itinerary...";

  const healthProfile = {
    conditions: ["Asthma"], // Example: Add actual conditions
    allergies: ["Pollen"], // Example: Add actual allergies
  };

  try {
    const response = await fetch("http://localhost:8000/generate-itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: "Paris, France", healthProfile }),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    output.innerHTML = `<pre>${data.itinerary}</pre>`;
  } catch (error) {
    output.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

async function generateItinerary(event) {
  event.preventDefault(); // Prevent the form from submitting

  const output = document.getElementById("itinerary-output");
  const location = document.getElementById("location").value;

  if (!location) {
    output.innerHTML = "<p>Please enter a location.</p>";
    return;
  }

  output.innerHTML = "Generating itinerary...";

  // Construct the health profile object
  const healthProfile = {
    name: "Mansi Anadi",
    allergies: ["Pollen", "Dust"],
    conditions: ["Asthma"],
    preferredActivities: ["Indoor", "Sightseeing"],
  };

  try {
    const response = await fetch("http://localhost:8000/generate-itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, healthProfile }),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const itinerary = data.itinerary;

    // Display the itinerary
    output.innerHTML = `
      <h3>Suggested Activities for ${itinerary.location}</h3>
      <ul>
        ${
      itinerary.suggestedActivities.map((activity) => `<li>${activity}</li>`)
        .join("")
    }
      </ul>
    `;
  } catch (error) {
    output.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Attach the event listener to the form submit
document.getElementById("itinerary-form").addEventListener(
  "submit",
  generateItinerary,
);

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
