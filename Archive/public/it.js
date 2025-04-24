document.getElementById("generate-itinerary-btn").addEventListener(
    "click",
    async () => {
        // Collect input values
        const destination = document.getElementById("destination").value;
        const travelDates = document.getElementById("travelDates").value;
        const healthConditions =
            document.getElementById("healthConditions").value;

        // Validate the inputs
        if (!destination || !travelDates || !healthConditions) {
            alert("Please fill out all fields.");
            return;
        }

        // Create the request body
        const requestBody = {
            destination,
            travelDates,
            healthConditions,
        };

        try {
            // Send the request to the backend API
            const response = await fetch(
                "http://localhost:8000/api/itinerary",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                },
            );

            const data = await response.json();

            // Display the generated itinerary
            if (response.ok) {
                document.getElementById("itinerary-output").innerHTML =
                    `<pre>${data.itinerary}</pre>`;
            } else {
                document.getElementById("itinerary-output").innerHTML =
                    `<p>Error: ${data.error}</p>`;
            }
        } catch (error) {
            document.getElementById("itinerary-output").innerHTML =
                `<p>Something went wrong. Please try again later.</p>`;
        }
    },
);
